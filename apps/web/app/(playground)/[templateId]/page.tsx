"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTemplate, useTemplates } from "@/hooks/use-templates";
import { usePlaygroundStore } from "@/stores/playground";
import { CodePanel } from "@/components/panels/CodePanel";
import { MapPanel } from "@/components/panels/MapPanel";
import { StatePanel } from "@/components/panels/StatePanel";
import { TemplateHeader } from "@/components/TemplateHeader";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useToast, ToastContainer } from "@/hooks/use-toast";
import { ResizablePanels } from "@/components/ui/ResizablePanels";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { AITutor } from "@/components/ai/AITutor";
import { ContextualHints } from "@/components/ai/ContextualHints";

export default function PlaygroundPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const { data: template, isLoading } = useTemplate(templateId);
  const { setTemplate, selectedLine } = usePlaygroundStore();
  const toast = useToast();

  useEffect(() => {
    if (template) {
      setTemplate(template.id, template.code);
    }
  }, [template, setTemplate]);

  // Get template list for navigation
  const { data: templates } = useTemplates();

  // Keyboard shortcuts (command palette handles its own shortcuts)
  useKeyboardShortcuts([
    {
      key: "ArrowRight",
      meta: true,
      handler: () => {
        if (templates) {
          const currentIndex = templates.findIndex((t) => t.id === templateId);
          if (currentIndex < templates.length - 1) {
            router.push(`/playground/${templates[currentIndex + 1].id}`);
          }
        }
      },
    },
    {
      key: "ArrowLeft",
      meta: true,
      handler: () => {
        if (templates) {
          const currentIndex = templates.findIndex((t) => t.id === templateId);
          if (currentIndex > 0) {
            router.push(`/playground/${templates[currentIndex - 1].id}`);
          }
        }
      },
    },
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Template not found
          </h1>
          <p className="text-muted-foreground">
            The template you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        <TemplateHeader template={template} />
        <div className="flex-1 overflow-hidden p-4">
          <ResizablePanels
            storageKey="playground-panel-sizes"
            defaultSizes={[40, 30, 30]}
          >
            <CodePanel />
            <MapPanel />
            <StatePanel />
          </ResizablePanels>
        </div>
      </div>
      <CommandPalette />
      <AITutor templateId={templateId} currentLine={selectedLine} />
      <ContextualHints />
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />
    </>
  );
}

