"use client";

import { motion } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Badge } from "./Badge";

interface StateDiffProps {
  before: any;
  after: any;
  label: string;
}

export function StateDiff({ before, after, label }: StateDiffProps) {
  const getDiff = () => {
    const changes: Array<{
      key: string;
      before: any;
      after: any;
      type: "added" | "removed" | "modified" | "unchanged";
    }> = [];

    const allKeys = new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ]);

    allKeys.forEach((key) => {
      const beforeValue = before?.[key];
      const afterValue = after?.[key];

      if (beforeValue === undefined && afterValue !== undefined) {
        changes.push({ key, before: null, after: afterValue, type: "added" });
      } else if (beforeValue !== undefined && afterValue === undefined) {
        changes.push({ key, before: beforeValue, after: null, type: "removed" });
      } else if (beforeValue !== afterValue) {
        changes.push({ key, before: beforeValue, after: afterValue, type: "modified" });
      } else {
        changes.push({ key, before: beforeValue, after: afterValue, type: "unchanged" });
      }
    });

    return changes;
  };

  const changes = getDiff();

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="space-y-2">
        {changes.map((change) => {
          if (change.type === "unchanged") return null;

          return (
            <motion.div
              key={change.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                change.type === "added"
                  ? "bg-success-light/30 border-success"
                  : change.type === "removed"
                  ? "bg-destructive-light/30 border-destructive"
                  : "bg-warning-light/30 border-warning"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-foreground">
                  {change.key}
                </span>
                <Badge
                  variant={
                    change.type === "added"
                      ? "success"
                      : change.type === "removed"
                      ? "destructive"
                      : "warning"
                  }
                  size="sm"
                >
                  {change.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                {change.type === "removed" || change.type === "modified" ? (
                  <>
                    <div className="flex-1 p-2 rounded bg-background border border-border">
                      <div className="flex items-center gap-1 text-destructive mb-1">
                        <Minus className="w-3 h-3" />
                        <span>Before</span>
                      </div>
                      <div className="text-foreground">
                        {JSON.stringify(change.before, null, 2)}
                      </div>
                    </div>
                    {change.type === "modified" && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </>
                ) : null}
                {change.type === "added" || change.type === "modified" ? (
                  <div className="flex-1 p-2 rounded bg-background border border-border">
                    <div className="flex items-center gap-1 text-success mb-1">
                      {change.type === "added" ? (
                        <Plus className="w-3 h-3" />
                      ) : (
                        <ArrowRight className="w-3 h-3" />
                      )}
                      <span>After</span>
                    </div>
                    <div className="text-foreground">
                      {JSON.stringify(change.after, null, 2)}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

