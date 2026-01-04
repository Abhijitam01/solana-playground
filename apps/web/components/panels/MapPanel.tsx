"use client";

import { usePlaygroundStore } from "@/stores/playground";
import { useTemplate } from "@/hooks/use-templates";
import { useParams } from "next/navigation";
import { Map, HelpCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { HelpIcon } from "@/components/ui/HelpIcon";
import { Tooltip } from "@/components/ui/Tooltip";

export function MapPanel() {
  const params = useParams();
  const templateId = params.templateId as string;
  const { data: template } = useTemplate(templateId);
  const { selectedInstruction, setSelectedInstruction, setSelectedLine } =
    usePlaygroundStore();

  if (!template?.programMap) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Program Map</h2>
        </div>
        <div className="flex-1 p-4 text-sm text-muted-foreground flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </motion.div>
    );
  }

  const { instructions, accounts, cpiCalls } = template.programMap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Program Map</h2>
        </div>
        <HelpIcon
          content="Explore the program structure. Click instructions to jump to code."
          side="left"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
            Instructions
          </h3>
          <div className="space-y-2">
            {instructions.map((instruction, idx) => (
              <motion.button
                key={instruction.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedInstruction(instruction.name);
                  setSelectedLine(instruction.lineStart);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-fast ${
                  selectedInstruction === instruction.name
                    ? "bg-primary-light/50 border-primary shadow-md"
                    : "bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm text-foreground font-mono">
                    {instruction.name}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-fast ${
                      selectedInstruction === instruction.name
                        ? "text-primary translate-x-0"
                        : "text-muted-foreground -translate-x-1 group-hover:translate-x-0"
                    }`}
                  />
                </div>
                <div className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {instruction.description}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {instruction.accounts.map((account) => (
                    <Tooltip
                      key={account.name}
                      content={
                        <div className="space-y-1">
                          <div className="font-mono text-xs">{account.name}</div>
                          <div className="text-xs space-y-0.5">
                            {account.isMut && <div>• Mutable</div>}
                            {account.isSigner && <div>• Signer</div>}
                            {account.isPda && <div>• Program Derived Address</div>}
                          </div>
                        </div>
                      }
                    >
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border text-xs">
                        <span className="font-mono text-foreground">
                          {account.name}
                        </span>
                        <div className="flex gap-1">
                          {account.isMut && (
                            <Badge variant="warning" size="sm">mut</Badge>
                          )}
                          {account.isSigner && (
                            <Badge variant="success" size="sm">signer</Badge>
                          )}
                          {account.isPda && (
                            <Badge variant="info" size="sm">PDA</Badge>
                          )}
                        </div>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {accounts.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
              Account Types
            </h3>
            <div className="space-y-2">
              {accounts.map((account, idx) => (
                <motion.div
                  key={account.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg border bg-muted/30 border-border"
                >
                  <div className="font-semibold text-sm text-foreground font-mono mb-2">
                    {account.name}
                  </div>
                  <div className="space-y-1.5">
                    {account.fields.map((field) => (
                      <div
                        key={field.name}
                        className="text-xs text-muted-foreground font-mono"
                      >
                        <span className="text-foreground">{field.name}</span>
                        <span className="mx-2 text-muted-foreground">:</span>
                        <span className="text-info">{field.type}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {cpiCalls && cpiCalls.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 tracking-wider">
              CPI Calls
            </h3>
            <div className="space-y-2">
              {cpiCalls.map((cpi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg border bg-muted/30 border-border"
                >
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="font-mono text-foreground">{cpi.program}</span>
                    <ChevronRight className="w-3 h-3 text-primary" />
                    <span className="font-mono text-foreground">{cpi.instruction}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

