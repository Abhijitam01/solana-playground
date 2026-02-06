"use client";

import { useEffect, useMemo, useState } from "react";
import { setCohortId } from "@/lib/analytics";

const normalizeApiUrl = (raw: string) => {
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/cohorts") ? trimmed.slice(0, -"/cohorts".length) : trimmed;
};

const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
);

type Cohort = {
  id: string;
  name: string;
  description?: string | null;
  inviteCode: string;
  memberCount: number;
};

type Summary = {
  totalSessions: number;
  firstTxStarts: number;
  firstTxSuccess: number;
  firstTxSuccessRate: number;
  avgTimeToFirstTxMs: number | null;
  executionSuccess: number;
  executionFailed: number;
  executionSuccessRate: number;
  stepChurn: Array<{ stepId: string; starts: number; completes: number; churnRate: number }>;
};

export default function InstructorPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const cohortSummaryUrl = useMemo(() => {
    if (!selectedCohort) return null;
    return `${API_URL}/cohorts/${selectedCohort.id}/summary`;
  }, [selectedCohort]);

  useEffect(() => {
    void fetch(`${API_URL}/cohorts`)
      .then((res) => res.json())
      .then(setCohorts)
      .catch(() => setCohorts([]));
  }, []);

  useEffect(() => {
    void fetch(`${API_URL}/analytics/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  useEffect(() => {
    if (!cohortSummaryUrl) return;
    setLoading(true);
    void fetch(cohortSummaryUrl)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cohortSummaryUrl]);

  const createCohort = async () => {
    if (!name.trim()) return;
    const res = await fetch(`${API_URL}/cohorts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || undefined }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setCohorts((prev) => [{ ...created, memberCount: 0 }, ...prev]);
    setName("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Instructor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track cohort performance, first transaction success, and step churn.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="panel p-4">
            <div className="text-xs text-muted-foreground">Total Sessions</div>
            <div className="text-2xl font-semibold">
              {summary?.totalSessions ?? "-"}
            </div>
          </div>
          <div className="panel p-4">
            <div className="text-xs text-muted-foreground">First Tx Success Rate</div>
            <div className="text-2xl font-semibold">
              {summary
                ? `${Math.round(summary.firstTxSuccessRate * 100)}%`
                : "-"}
            </div>
          </div>
          <div className="panel p-4">
            <div className="text-xs text-muted-foreground">Avg Time to First Tx</div>
            <div className="text-2xl font-semibold">
              {summary?.avgTimeToFirstTxMs
                ? `${Math.round(summary.avgTimeToFirstTxMs / 1000)}s`
                : "-"}
            </div>
          </div>
        </section>

        <section className="panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Cohorts</h2>
              <p className="text-xs text-muted-foreground">
                Create cohorts and share invite codes.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Cohort name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
              onClick={createCohort}
            >
              Create Cohort
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {cohorts.map((cohort) => (
              <button
                key={cohort.id}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedCohort?.id === cohort.id
                    ? "border-primary bg-primary-light/50"
                    : "border-border bg-muted/20 hover:border-primary/60"
                }`}
                onClick={() => {
                  setSelectedCohort(cohort);
                  setCohortId(cohort.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{cohort.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {cohort.memberCount} members
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Invite: {cohort.inviteCode}
                </div>
                {cohort.description && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {cohort.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Step Churn</h2>
            {loading && <span className="text-xs text-muted-foreground">Loading…</span>}
          </div>
          {summary?.stepChurn?.length ? (
            <div className="space-y-2">
              {summary.stepChurn.map((step) => (
                <div key={step.stepId} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{step.stepId}</span>
                    <span className="text-muted-foreground">
                      {Math.round(step.churnRate * 100)}% churn
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Starts: {step.starts} · Completes: {step.completes}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No step data yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}
