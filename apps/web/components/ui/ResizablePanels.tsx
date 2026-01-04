"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, Fragment } from "react";

interface ResizablePanelsProps {
  children: React.ReactNode[];
  storageKey?: string;
  direction?: "horizontal" | "vertical";
  defaultSizes?: number[];
}

export function ResizablePanels({
  children,
  storageKey,
  direction = "horizontal",
  defaultSizes,
}: ResizablePanelsProps) {
  useEffect(() => {
    // Load saved sizes from localStorage if available
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const sizes = JSON.parse(saved);
          // Apply saved sizes if they exist
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [storageKey]);

  const handleResize = (sizes: number[]) => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(sizes));
    }
  };

  return (
    <PanelGroup
      direction={direction}
      onLayout={(sizes) => handleResize(sizes)}
      className="h-full w-full"
    >
      {children.map((child, index) => (
        <Fragment key={index}>
          <Panel
            defaultSize={defaultSizes?.[index] || 100 / children.length}
            minSize={15}
            maxSize={70}
          >
            <div className="h-full w-full">{child}</div>
          </Panel>
          {index < children.length - 1 && (
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors duration-fast relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-8 bg-muted-foreground/30 group-hover:bg-primary rounded-full transition-colors duration-fast" />
              </div>
            </PanelResizeHandle>
          )}
        </Fragment>
      ))}
    </PanelGroup>
  );
}
