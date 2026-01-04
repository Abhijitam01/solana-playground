"use client";

import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";
import { Badge } from "./Badge";

export interface TimelineStep {
  id: string;
  label: string;
  timestamp: number;
  state: any;
  completed: boolean;
}

interface StateTimelineProps {
  steps: TimelineStep[];
  currentStep?: number;
  onStepClick?: (step: TimelineStep) => void;
}

export function StateTimeline({ steps, currentStep, onStepClick }: StateTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCurrent = currentStep === index;
          const isPast = currentStep !== undefined && index < currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStepClick?.(step)}
              className={`relative flex items-start gap-4 cursor-pointer transition-all duration-fast ${
                isCurrent ? "scale-105" : "hover:scale-102"
              }`}
            >
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                {step.completed || isPast ? (
                  <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <Circle className="w-5 h-5 text-primary-foreground fill-current" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 p-3 rounded-lg border transition-all duration-fast ${
                  isCurrent
                    ? "bg-primary-light/50 border-primary shadow-md"
                    : step.completed || isPast
                    ? "bg-muted/30 border-border"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">
                    {step.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {isCurrent && <Badge variant="info" size="sm">Current</Badge>}
                    {step.completed && <Badge variant="success" size="sm">Done</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {Object.keys(step.state).length} accounts
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

