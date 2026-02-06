import { Router } from "express";
import { z } from "zod";
import { db, cohorts, cohortMembers, analyticsEvents } from "@solana-playground/db";
import { optionalAuthMiddleware, AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/error-handler";
import { eq } from "drizzle-orm";

export const cohortsRouter = Router();

cohortsRouter.use(optionalAuthMiddleware);

const CreateCohortSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  inviteCode: z.string().optional(),
});

const JoinCohortSchema = z.object({
  inviteCode: z.string().min(4),
  email: z.string().email().optional(),
  sessionId: z.string().optional(),
});

cohortsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const cohortList = await db.select().from(cohorts);
    const members = await db.select().from(cohortMembers);

    const counts = new Map<string, number>();
    for (const member of members) {
      counts.set(member.cohortId, (counts.get(member.cohortId) || 0) + 1);
    }

    const withCounts = cohortList.map((cohort) => ({
      ...cohort,
      memberCount: counts.get(cohort.id) || 0,
    }));

    res.json(withCounts);
  })
);

cohortsRouter.post(
  "/",
  asyncHandler(async (req: AuthRequest, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const body = CreateCohortSchema.parse(req.body);
    const inviteCode = body.inviteCode ?? generateInviteCode();

    const [created] = await db
      .insert(cohorts)
      .values({
        name: body.name,
        description: body.description,
        inviteCode,
        createdBy: req.userId ?? null,
      })
      .returning();

    res.status(201).json(created);
  })
);

cohortsRouter.post(
  "/join",
  asyncHandler(async (req: AuthRequest, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const body = JoinCohortSchema.parse(req.body);

    const [cohort] = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.inviteCode, body.inviteCode))
      .limit(1);

    if (!cohort) {
      return res.status(404).json({
        error: "Not Found",
        message: "Invalid invite code",
      });
    }

    const members = await db
      .select()
      .from(cohortMembers)
      .where(eq(cohortMembers.cohortId, cohort.id));

    const alreadyMember = members.some((member) => {
      if (req.userId && member.userId === req.userId) return true;
      if (body.email && member.email === body.email) return true;
      return false;
    });

    if (!alreadyMember) {
      await db.insert(cohortMembers).values({
        cohortId: cohort.id,
        userId: req.userId ?? null,
        email: body.email ?? null,
        role: "student",
      });
    }

    res.json({
      cohort,
      cohortId: cohort.id,
    });
  })
);

cohortsRouter.get(
  "/:cohortId/members",
  asyncHandler(async (req, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const cohortId = req.params.cohortId;
    if (!cohortId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Cohort ID is required",
      });
    }
    const members = await db
      .select()
      .from(cohortMembers)
      .where(eq(cohortMembers.cohortId, cohortId));

    res.json(members);
  })
);

cohortsRouter.get(
  "/:cohortId/summary",
  asyncHandler(async (req, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const cohortId = req.params.cohortId;
    if (!cohortId) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Cohort ID is required",
      });
    }
    const events = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.cohortId, cohortId));

    const summary = computeSummary(events);
    res.json(summary);
  })
);

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function computeSummary(events: Array<(typeof analyticsEvents)["$inferSelect"]>) {
  const sessions = new Set<string>();
  const stepStarts = new Map<string, number>();
  const stepCompletes = new Map<string, number>();

  let firstTxStarts = 0;
  let firstTxSuccess = 0;
  let executionSuccess = 0;
  let executionFailed = 0;
  const firstTxDurations: number[] = [];

  for (const event of events) {
    sessions.add(event.sessionId);

    if (event.event === "first_tx_start") {
      firstTxStarts += 1;
    }
    if (event.event === "first_tx_success") {
      firstTxSuccess += 1;
      if (typeof event.durationMs === "number") {
        firstTxDurations.push(event.durationMs);
      }
    }
    if (event.event === "execution_success") {
      executionSuccess += 1;
    }
    if (event.event === "execution_failed") {
      executionFailed += 1;
    }
    if (event.event === "step_start" && event.stepId) {
      stepStarts.set(event.stepId, (stepStarts.get(event.stepId) || 0) + 1);
    }
    if (event.event === "step_complete" && event.stepId) {
      stepCompletes.set(event.stepId, (stepCompletes.get(event.stepId) || 0) + 1);
    }
  }

  const stepChurn = Array.from(stepStarts.entries()).map(([stepId, starts]) => {
    const completes = stepCompletes.get(stepId) || 0;
    return {
      stepId,
      starts,
      completes,
      churnRate: starts > 0 ? (starts - completes) / starts : 0,
    };
  });

  stepChurn.sort((a, b) => b.churnRate - a.churnRate);

  const avgFirstTxMs =
    firstTxDurations.length > 0
      ? Math.round(firstTxDurations.reduce((a, b) => a + b, 0) / firstTxDurations.length)
      : null;

  return {
    totalSessions: sessions.size,
    firstTxStarts,
    firstTxSuccess,
    firstTxSuccessRate: firstTxStarts > 0 ? firstTxSuccess / firstTxStarts : 0,
    avgTimeToFirstTxMs: avgFirstTxMs,
    executionSuccess,
    executionFailed,
    executionSuccessRate:
      executionSuccess + executionFailed > 0
        ? executionSuccess / (executionSuccess + executionFailed)
        : 0,
    stepChurn: stepChurn.slice(0, 10),
  };
}
