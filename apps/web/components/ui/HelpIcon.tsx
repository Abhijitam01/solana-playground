"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip } from "./Tooltip";

interface HelpIconProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function HelpIcon({
  content,
  side = "top",
  className,
}: HelpIconProps) {
  return (
    <Tooltip content={content} side={side}>
      <button
        type="button"
        className={`inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-fast ${className}`}
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </Tooltip>
  );
}

