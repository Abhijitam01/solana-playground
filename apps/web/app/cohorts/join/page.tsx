"use client";

import { useState } from "react";
import { setCohortId } from "@/lib/analytics";

const normalizeApiUrl = (raw: string) => {
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/cohorts") ? trimmed.slice(0, -"/cohorts".length) : trimmed;
};

const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
);

export default function JoinCohortPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const joinCohort = async () => {
    setLoading(true);
    setStatus(null);
    const res = await fetch(`${API_URL}/cohorts/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: inviteCode.trim(), email: email.trim() || undefined }),
    });

    if (!res.ok) {
      setStatus("Invite code not found.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setCohortId(data.cohortId);
    setStatus(`Joined cohort: ${data.cohort.name}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-6 py-12 space-y-6">
        <header>
          <h1 className="text-3xl font-semibold">Join a Cohort</h1>
          <p className="text-sm text-muted-foreground">
            Enter the invite code provided by your instructor.
          </p>
        </header>

        <div className="panel p-6 space-y-4">
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"
            onClick={joinCohort}
            disabled={loading || !inviteCode.trim()}
          >
            {loading ? "Joining..." : "Join Cohort"}
          </button>
          {status && <div className="text-sm text-muted-foreground">{status}</div>}
        </div>
      </div>
    </div>
  );
}
