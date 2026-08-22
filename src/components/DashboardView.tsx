"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import ReportForm from "@/components/ReportForm";
import { ShieldAlert, Activity, Crosshair, BarChart3, ThumbsUp, TrendingUp, Zap, Map as MapIcon, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { upvoteReport } from "@/actions/report.actions";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

function UpvoteButton({ reportId, initialVotes }: { reportId: string; initialVotes: number }) {
  const [isPending, startTransition] = useTransition();
  const [votes, setVotes] = useState(initialVotes || 0);
  const [voted, setVoted] = useState(false);

  const handleVote = () => {
    if (voted) return;
    setVotes((v) => v + 1);
    setVoted(true);
    startTransition(async () => {
      await upvoteReport(reportId);
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted || isPending}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-300",
        voted
          ? "bg-yellow-400 text-black border border-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.4)]"
          : "bg-white/5 text-white/50 border border-white/10 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/30 active:scale-95"
      )}
    >
      <ThumbsUp size={12} className={voted ? "fill-current" : ""} />
      {votes} {voted ? "✓" : "Tasdiqlash"}
    </button>
  );
}

export default function DashboardView({ initialReports }: { initialReports: any[] }) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const total = initialReports.length;
  const criticalCount = initialReports.filter((r) => r.severityLevel === "CRITICAL").length;
  const highCount = initialReports.filter((r) => r.severityLevel === "HIGH").length;
  const mediumCount = initialReports.filter((r) => r.severityLevel === "MEDIUM").length;
  const lowCount = initialReports.filter((r) => r.severityLevel === "LOW").length;
  const totalUpvotes = initialReports.reduce((sum: number, r: any) => sum + (r.upvotes || 0), 0);
  const getPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          reports={initialReports}
          onLocationSelect={(loc: [number, number]) => { setSelectedLocation(loc); setSidebarOpen(true); }}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1100] bg-black/80 backdrop-blur-md text-yellow-400 p-3 rounded-2xl border border-white/10 shadow-xl"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] bg-yellow-400 text-black px-6 py-3 rounded-full font-black text-sm shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center gap-2"
        >
          <MapIcon size={16} /> Xaritani ko'rish
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -500, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={cn(
              "absolute z-[1000] bg-black/90 backdrop-blur-2xl border border-white/[0.08] flex flex-col overflow-hidden",
              "md:top-3 md:left-3 md:w-[400px] md:h-[calc(100vh-24px)] md:rounded-3xl md:shadow-[0_0_60px_rgba(0,0,0,0.8)]",
              "top-0 left-0 w-full h-full rounded-none md:rounded-3xl"
            )}
          >
            {/* Header */}
            <div className="p-5 pb-0 pt-16 md:pt-5 shrink-0">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-full" />
                    <div className="relative bg-yellow-400 p-2.5 rounded-2xl text-black">
                      <ShieldAlert className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white tracking-tight">Safe<span className="text-yellow-400">City</span> AI</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400"></span>
                      </span>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Tizim faol</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-yellow-400 p-3 rounded-2xl flex flex-col overflow-hidden relative">
                  <Activity className="text-black/30 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-black leading-none">{total}</span>
                  <span className="text-[8px] font-bold text-black/60 uppercase tracking-wider mt-1">Hodisalar</span>
                </div>
                <div className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-2xl flex flex-col">
                  <ThumbsUp className="text-yellow-400/50 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-white leading-none">{totalUpvotes}</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider mt-1">Ovozlar</span>
                </div>
                <div className="bg-white/[0.04] border border-white/[0.06] p-3 rounded-2xl flex flex-col">
                  <TrendingUp className="text-yellow-400/50 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-white leading-none">{criticalCount}</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider mt-1">Kritik</span>
                </div>
              </div>
            </div>

            {/* Scroll */}
            <div className="flex-1 overflow-y-auto px-5 pb-20 md:pb-5 custom-scrollbar">
              {/* Analytics */}
              <div className="mb-5 bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-yellow-400" /> Xavflilik Analitikasi
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                      <span className="text-red-400">Critical</span>
                      <span className="text-white/40">{criticalCount} ({getPercent(criticalCount)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(criticalCount)}%` }} transition={{ duration: 1.2, delay: 0.1 }} className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                      <span className="text-orange-400">High</span>
                      <span className="text-white/40">{highCount} ({getPercent(highCount)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(highCount)}%` }} transition={{ duration: 1.2, delay: 0.2 }} className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                        <span className="text-yellow-400">Medium</span>
                        <span className="text-white/40">{getPercent(mediumCount)}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(mediumCount)}%` }} transition={{ duration: 1.2, delay: 0.3 }} className="h-full bg-yellow-400 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                        <span className="text-white/30">Low</span>
                        <span className="text-white/40">{getPercent(lowCount)}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(lowCount)}%` }} transition={{ duration: 1.2, delay: 0.4 }} className="h-full bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ReportForm location={selectedLocation} onSuccess={() => setSelectedLocation(null)} />

              {/* Feed */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" /> Jonli Lenta
                  </h3>
                  <span className="text-[9px] text-white/20 font-bold">{total} ta xabar</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {initialReports.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                        <Crosshair className="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <p className="text-xs text-white/20 font-medium">Hozircha hodisalar yo'q</p>
                        <p className="text-[10px] text-white/10 mt-1">Xaritadan joy tanlab birinchi hodisani kiriting</p>
                      </div>
                    )}
                    {initialReports.map((report: any, i: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={report.id}
                        className="bg-white/[0.03] border border-white/[0.06] p-3.5 rounded-2xl hover:bg-white/[0.06] hover:border-yellow-400/20 transition-all duration-300 group relative"
                      >
                        <div className={cn("absolute top-3 left-0 w-0.5 h-[calc(100%-24px)] rounded-full",
                          report.severityLevel === 'CRITICAL' ? 'bg-red-500' :
                          report.severityLevel === 'HIGH' ? 'bg-orange-500' :
                          report.severityLevel === 'MEDIUM' ? 'bg-yellow-400' : 'bg-white/10'
                        )} />
                        <div className="flex justify-between items-start mb-1 pl-2">
                          <h4 className="font-bold text-white text-sm leading-tight pr-2 group-hover:text-yellow-400 transition-colors">{report.title}</h4>
                          <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                            report.severityLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            report.severityLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                            report.severityLevel === 'MEDIUM' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-white/10 text-white/40'
                          )}>
                            {report.severityLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/30 line-clamp-2 pl-2 font-medium mb-2.5">{report.description}</p>
                        <div className="pl-2 flex justify-between items-center pt-2 border-t border-white/[0.04]">
                          <span className="text-[8px] text-white/15 font-bold uppercase tracking-widest">
                            {new Date(report.createdAt).toLocaleDateString("uz-UZ")}
                          </span>
                          <UpvoteButton reportId={report.id} initialVotes={report.upvotes} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="hidden md:flex px-5 py-3 border-t border-white/[0.04] shrink-0 items-center justify-between">
              <span className="text-[8px] text-white/15 font-bold uppercase tracking-[0.2em]">SafeCity AI v1.0</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-white/15 font-bold">Powered by</span>
                <span className="text-[8px] text-yellow-400/60 font-black">Gemini AI</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!selectedLocation && !sidebarOpen && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[500]">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-20 h-20 border-2 border-yellow-400/30 rounded-full flex items-center justify-center relative"
          >
            <Crosshair className="text-yellow-400 w-7 h-7 opacity-60" />
            <div className="absolute w-full h-[1px] bg-yellow-400/20" />
            <div className="absolute h-full w-[1px] bg-yellow-400/20" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 bg-black/80 backdrop-blur-md text-yellow-400 px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold border border-yellow-400/20"
          >
            Xaritadan joyni belgilang
          </motion.div>
        </div>
      )}
    </div>
  );
}
