"use client";

import { Clock, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

export interface PathProgress {
  pathId: string;
  pathTitle: string;
  totalSteps: number;
  completedSteps: number;
  currentStep: number;
  timeSpent: number; // in minutes
  conceptsMastered: string[];
  lastActivity: Date;
}

interface PathProgressProps {
  progress: PathProgress;
}

export function PathProgressComponent({ progress }: PathProgressProps) {
  const progressPercentage = (progress.completedSteps / progress.totalSteps) * 100;
  const timeSpentHours = Math.floor(progress.timeSpent / 60);
  const timeSpentMinutes = progress.timeSpent % 60;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
            {progress.pathTitle}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#737373]">
            <Clock className="w-4 h-4" />
            <span>
              {timeSpentHours > 0
                ? `${timeSpentHours}h ${timeSpentMinutes}m`
                : `${timeSpentMinutes}m`}{" "}
              spent
            </span>
          </div>
        </div>
        <span className="px-3 py-1 text-xs font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider">
          {progress.completedSteps} / {progress.totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#737373]">Progress</span>
          <span className="text-[#FAFAFA] font-semibold">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#1A1A1A] border border-[#262626] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#14F195] rounded-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#262626]">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-[#14F195]" />
            <span className="text-xs font-semibold text-[#FAFAFA]">Current Step</span>
          </div>
          <div className="text-lg font-bold text-[#FAFAFA]">
            {progress.currentStep} / {progress.totalSteps}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-[#1A1A1A] border border-[#262626]">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-[#14F195]" />
            <span className="text-xs font-semibold text-[#FAFAFA]">Concepts</span>
          </div>
          <div className="text-lg font-bold text-[#FAFAFA]">
            {progress.conceptsMastered.length}
          </div>
        </div>
      </div>

      {/* Concepts Mastered */}
      {progress.conceptsMastered.length > 0 && (
        <div className="pt-6 border-t border-[#262626]">
          <div className="text-xs font-semibold text-[#737373] mb-3 uppercase tracking-wider">
            Concepts Mastered
          </div>
          <div className="flex flex-wrap gap-2">
            {progress.conceptsMastered.map((concept) => (
              <span
                key={concept}
                className="px-3 py-1 text-xs font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider"
              >
                {concept.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

