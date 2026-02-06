import { Router } from "express";
import { z } from "zod";
import { db, analyticsEvents } from "@solana-playground/db";
import { optionalAuthMiddleware, AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/error-handler";

export const analyticsRouter = Router();

analyticsRouter.use(optionalAuthMiddleware);

const AnalyticsEventSchema = z.object({
  sessionId: z.string().min(1),
  templateId: z.string().optional(),
  cohortId: z.string().uuid().optional(),
  event: z.string().min(1),
  stepId: z.string().optional(),
  success: z.boolean().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const AnalyticsEventsSchema = z.union([
  AnalyticsEventSchema,
  z.object({ events: z.array(AnalyticsEventSchema).min(1) }),
]);

analyticsRouter.post(
  "/events",
  asyncHandler(async (req: AuthRequest, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const parsed = AnalyticsEventsSchema.parse(req.body);
    const events = "events" in parsed ? parsed.events : [parsed];

    const values = events.map((event) => ({
      userId: req.userId ?? null,
      cohortId: event.cohortId ?? null,
      sessionId: event.sessionId,
      templateId: event.templateId ?? null,
      event: event.event,
      stepId: event.stepId ?? null,
      success: event.success ?? null,
      durationMs: event.durationMs ?? null,
      metadata: event.metadata ?? null,
    }));

    await db.insert(analyticsEvents).values(values);
    res.status(202).json({ stored: values.length });
  })
);

analyticsRouter.get(
  "/summary",
  asyncHandler(async (req, res) => {
    if (!db) {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Database not configured",
      });
    }

    const templateId = typeof req.query.templateId === "string" ? req.query.templateId : null;
    const cohortId = typeof req.query.cohortId === "string" ? req.query.cohortId : null;

    let events = await db.select().from(analyticsEvents);

    if (templateId) {
      events = events.filter((event) => event.templateId === templateId);
    }

    if (cohortId) {
      events = events.filter((event) => event.cohortId === cohortId);
    }

    const summary = computeSummary(events);
    res.json(summary);
  })
);

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
