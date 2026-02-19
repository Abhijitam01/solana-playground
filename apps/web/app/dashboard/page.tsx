"use client";

import { useMemo } from "react";
import { BookOpen, Clock, Code2, Star, Trash2, Activity, Layers } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { trpc } from "@/lib/trpc-client";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/hooks/use-toast";
import { useProgramStore } from "@/stores/programs";

function formatRelativeTime(value: string | Date): string {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const utils = trpc.useContext();
  const removeProgram = useProgramStore((state) => state.removeProgramBySavedId);

  const { data: userCode = [], isLoading } = trpc.code.getMyCode.useQuery(undefined, {
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    staleTime: 0,
  });
  const deleteMutation = trpc.code.delete.useMutation();

  const stats = useMemo(() => {
    const today = new Date();
    const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const favorites = userCode.filter((entry) => entry.isFavorite).length;
    const updatedToday = userCode.filter((entry) => new Date(entry.updatedAt) >= dayStart).length;
    const templatesUsed = new Set(userCode.map((entry) => entry.templateId).filter(Boolean)).size;
    const lastUpdated = userCode[0]?.updatedAt ?? null;
    return {
      total: userCode.length,
      favorites,
      updatedToday,
      templatesUsed,
      lastUpdated,
    };
  }, [userCode]);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this code permanently?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          utils.code.getMyCode.invalidate();
          removeProgram(id);
          showSuccess("Program deleted");
        },
        onError: (err) => showError(err.message),
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <AppHeader />
      <section className="pt-24 pb-10 px-4 sm:px-6 border-b border-[#262626]">
        <div className="max-w-[1200px] mx-auto">
          <span className="px-3 py-1 text-xs font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider inline-block">
            Dashboard
          </span>
          <h1 className="text-[34px] sm:text-[52px] font-bold tracking-tight mt-4 text-white">Workspace Overview</h1>
          <p className="text-sm sm:text-base text-[#A3A3A3] mt-2 max-w-[720px]">
            Live status of your saved programs, activity, and recent edits.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#262626] border border-[#262626] rounded-xl overflow-hidden">
          {[
            { icon: BookOpen, label: "Saved Programs", value: stats.total },
            { icon: Star, label: "Favorites", value: stats.favorites },
            { icon: Activity, label: "Updated Today", value: stats.updatedToday },
            { icon: Layers, label: "Templates Used", value: stats.templatesUsed },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-[#0A0A0A] p-5 hover:bg-[#111111] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-[#FAFAFA]" />
                </div>
              </div>
              <div className="text-3xl font-bold">{isLoading ? "..." : item.value}</div>
              <div className="text-xs text-[#737373] mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-8 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto rounded-xl border border-[#262626] bg-[#0D0D0D] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#14F195]" />
                Recent Programs
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Last sync: {stats.lastUpdated ? formatRelativeTime(stats.lastUpdated) : "no activity yet"}
              </p>
            </div>
            <Link href="/my-code" className="text-xs uppercase tracking-wide text-[#14F195] font-semibold">
              Manage all →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-sm text-white/50 py-8 text-center">Loading programs...</div>
          ) : userCode.length === 0 ? (
            <div className="text-sm text-white/50 py-8 text-center">You have not saved any programs yet.</div>
          ) : (
            <div className="space-y-3">
              {userCode.slice(0, 8).map((code) => (
                <div
                  key={code.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(code.updatedAt)}
                    </div>
                    <h3 className="text-base font-semibold text-white mt-1 truncate">{code.title}</h3>
                    <p className="text-xs text-white/50 mt-1 truncate">
                      {code.code
                        ? `${code.code.split("\n")[0]}...`
                        : code.gistId
                          ? "Stored in GitHub Gist"
                          : "No preview available"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/playground/${code.templateId}?code=${code.id}`}
                      className="px-3 py-2 text-xs font-semibold uppercase tracking-wide rounded-md border border-[#14F195]/50 text-[#14F195] hover:bg-[#14F195]/10 transition-colors"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => handleDelete(code.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50"
                      aria-label="Delete program"
                    >
                      <Trash2 className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
