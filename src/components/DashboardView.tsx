"use client";

import { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import ReportForm from "@/components/ReportForm";
import { ShieldAlert, Activity, Crosshair, BarChart3, ThumbsUp, TrendingUp, Zap, Map as MapIcon, X, Menu, Send, LogOut, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { upvoteReport } from "@/actions/report.actions";
import { auth, signOut } from "@/lib/firebase";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

function UserProfileWidget() {
  const [user, setUser] = useState<{name: string, email: string, photo: string | null} | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("safecity_user");
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch (e) {}
    }
  }, []);

  if (!user) return null;

  return (
    <div className="absolute top-4 right-4 z-[1100] bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-2 shadow-xl flex items-center gap-3 pr-4">
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
        {user.photo ? (
          <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-5 h-5 text-slate-400" />
        )}
      </div>
      <div className="flex flex-col max-w-[120px] hidden sm:flex">
        <span className="text-xs font-bold text-slate-900 truncate">{user.name || "Foydalanuvchi"}</span>
        <span className="text-[9px] font-medium text-slate-500 truncate">{user.email || user.phone}</span>
      </div>
      <button 
        onClick={async () => {
          try {
            await signOut(auth);
            localStorage.removeItem("safecity_user");
            window.location.reload();
          } catch(e) {}
        }}
        className="ml-2 bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition-colors"
        title="Chiqish"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

function UpvoteButton({ reportId, initialVotes }: { reportId: string; initialVotes: number }) {
  const [isPending, startTransition] = useTransition();
  const [votes, setVotes] = useState(initialVotes || 0);
  const [voted, setVoted] = useState(false);

  useEffect(() => { setVotes(initialVotes || 0); }, [initialVotes]);

  const handleVote = () => {
    if (voted) return;
    setVotes((v) => v + 1);
    setVoted(true);
    startTransition(async () => {
      try {
        await upvoteReport(reportId);
      } catch (err) {
        setVotes(v => v - 1);
        setVoted(false);
      }
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
          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 active:scale-95"
      )}
    >
      <ThumbsUp size={12} className={voted ? "fill-current" : ""} />
      {votes} {voted ? "✓" : "Tasdiqlash"}
    </button>
  );
}

export default function DashboardView({ initialReports, onRefresh }: { initialReports: any[], onRefresh?: () => void }) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [focusLocation, setFocusLocation] = useState<[number, number] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const total = initialReports.length;
  const criticalCount = initialReports.filter((r) => r.severityLevel === "CRITICAL").length;
  const highCount = initialReports.filter((r) => r.severityLevel === "HIGH").length;
  const mediumCount = initialReports.filter((r) => r.severityLevel === "MEDIUM").length;
  const lowCount = initialReports.filter((r) => r.severityLevel === "LOW").length;
  const totalUpvotes = initialReports.reduce((sum: number, r: any) => sum + (r.upvotes || 0), 0);
  const getPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f8fafc]">
      
      {/* User Profile Floating Widget */}
      <UserProfileWidget />

      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          reports={initialReports}
          onLocationSelect={(loc: [number, number]) => { setSelectedLocation(loc); setSidebarOpen(true); }}
          selectedLocation={selectedLocation}
          focusLocation={focusLocation}
          onMarkerClick={(id: string, lat: number, lng: number) => {
            setSelectedLocation(null); // Formani yopish
            setFocusLocation([lat, lng]); // Xaritani shu markazga olib borish
            const el = document.getElementById(`report-${id}`);
            if (el) {
              setSidebarOpen(true);
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.classList.add("ring-2", "ring-yellow-400", "ring-offset-2");
              setTimeout(() => el.classList.remove("ring-2", "ring-yellow-400", "ring-offset-2"), 2000);
            }
          }}
        />
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[1100] bg-white/90 backdrop-blur-md text-yellow-600 p-3 rounded-2xl border border-slate-200 shadow-xl"
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
              "absolute z-[1000] bg-white/95 backdrop-blur-2xl border border-slate-200 flex flex-col overflow-hidden shadow-2xl",
              "md:top-3 md:left-3 md:w-[400px] md:h-[calc(100vh-24px)] md:rounded-3xl",
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
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Safe<span className="text-yellow-500">City</span> AI</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                      </span>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tizim faol</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-yellow-400 p-3 rounded-2xl flex flex-col overflow-hidden relative">
                  <Activity className="text-yellow-900/40 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-black leading-none">{total}</span>
                  <span className="text-[8px] font-bold text-yellow-900/60 uppercase tracking-wider mt-1">Hodisalar</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col">
                  <ThumbsUp className="text-yellow-500 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-slate-900 leading-none">{totalUpvotes}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1">Ovozlar</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col">
                  <TrendingUp className="text-red-500 w-4 h-4 mb-1" />
                  <span className="text-2xl font-black text-slate-900 leading-none">{criticalCount}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1">Kritik</span>
                </div>
              </div>
            </div>

            {/* Scroll */}
            <div className="flex-1 overflow-y-auto px-5 pb-20 md:pb-5 custom-scrollbar">
              {/* Analytics */}
              <div className="mb-5 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-yellow-500" /> Xavflilik Analitikasi
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                      <span className="text-red-500">Critical</span>
                      <span className="text-slate-500">{criticalCount} ({getPercent(criticalCount)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(criticalCount)}%` }} transition={{ duration: 1.2, delay: 0.1 }} className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                      <span className="text-orange-500">High</span>
                      <span className="text-slate-500">{highCount} ({getPercent(highCount)}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(highCount)}%` }} transition={{ duration: 1.2, delay: 0.2 }} className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                        <span className="text-yellow-500">Medium</span>
                        <span className="text-slate-500">{getPercent(mediumCount)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(mediumCount)}%` }} transition={{ duration: 1.2, delay: 0.3 }} className="h-full bg-yellow-400 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[9px] font-black mb-1 uppercase tracking-wider">
                        <span className="text-slate-400">Low</span>
                        <span className="text-slate-500">{getPercent(lowCount)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${getPercent(lowCount)}%` }} transition={{ duration: 1.2, delay: 0.4 }} className="h-full bg-slate-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ReportForm location={selectedLocation} onSuccess={() => {
                setSelectedLocation(null);
                if (onRefresh) onRefresh();
              }} />

              {/* Feed */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" /> Jonli Lenta
                  </h3>
                  <span className="text-[9px] text-slate-400 font-bold">{total} ta xabar</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {initialReports.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-slate-300 rounded-2xl">
                        <Crosshair className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">Hozircha hodisalar yo'q</p>
                        <p className="text-[10px] text-slate-300 mt-1">Xaritadan joy tanlab birinchi hodisani kiriting</p>
                      </div>
                    )}
                    {initialReports.map((report: any, i: number) => (
                      <motion.div
                        id={`report-${report.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={report.id}
                        onClick={() => setFocusLocation([report.latitude, report.longitude])}
                        className="bg-white border border-slate-200 p-3.5 rounded-2xl hover:bg-slate-50 hover:shadow-sm hover:border-yellow-400/30 transition-all duration-300 group relative cursor-pointer"
                      >
                        <div className={cn("absolute top-3 left-0 w-0.5 h-[calc(100%-24px)] rounded-full",
                          report.severityLevel === 'CRITICAL' ? 'bg-red-500' :
                          report.severityLevel === 'HIGH' ? 'bg-orange-500' :
                          report.severityLevel === 'MEDIUM' ? 'bg-yellow-400' : 'bg-slate-300'
                        )} />
                        <div className="flex justify-between items-start mb-1 pl-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight pr-2 group-hover:text-yellow-600 transition-colors">{report.title}</h4>
                          <span className={cn("text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 border",
                            report.severityLevel === 'CRITICAL' ? 'bg-red-500 text-white border-red-600 shadow-sm' :
                            report.severityLevel === 'HIGH' ? 'bg-orange-500 text-white border-orange-600 shadow-sm' :
                            report.severityLevel === 'MEDIUM' ? 'bg-yellow-400 text-black border-yellow-500 shadow-sm' :
                            'bg-slate-500 text-white border-slate-600 shadow-sm'
                          )}>
                            {report.severityLevel}
                          </span>
                        </div>
                        {report.imageUrl && (
                          <div className="ml-2 w-[calc(100%-8px)] h-28 mb-2 rounded-xl overflow-hidden border border-slate-100">
                            <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 line-clamp-2 pl-2 font-medium mb-2.5">{report.description}</p>
                        <div className="pl-2 flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                            {new Date(report.createdAt).toLocaleDateString("uz-UZ")}
                          </span>
                          <div className="flex gap-2">
                            <a
                              href={`https://t.me/share/url?url=https://safecityuz.vercel.app&text=Diqqat! ${encodeURIComponent(report.title)} - SafeCity AI tizimiga xabar berildi.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-300 bg-[#eff6ff] text-[#3b82f6] border border-[#bfdbfe] hover:bg-[#dbeafe] active:scale-95"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Send size={12} className="mr-0.5" /> Ulashish
                            </a>
                            <div onClick={(e) => e.stopPropagation()}>
                              <UpvoteButton reportId={report.id} initialVotes={report.upvotes} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex px-5 py-3 border-t border-slate-200 shrink-0 items-center justify-between bg-slate-50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">SafeCity v1.0</span>
              <button 
                onClick={async () => {
                  try {
                    await signOut(auth);
                    localStorage.removeItem("safecity_user");
                    window.location.reload();
                  } catch(e) {}
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-[10px] font-black transition-colors"
              >
                <LogOut size={12} /> Tizimdan chiqish
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!selectedLocation && !sidebarOpen && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[500]">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-20 h-20 border-2 border-yellow-400/40 rounded-full flex items-center justify-center relative shadow-lg"
          >
            <Crosshair className="text-yellow-500 w-7 h-7" />
            <div className="absolute w-full h-[1px] bg-yellow-400/30" />
            <div className="absolute h-full w-[1px] bg-yellow-400/30" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 bg-white/95 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-full shadow-xl text-xs font-bold border border-slate-200"
          >
            Xaritadan joyni belgilang
          </motion.div>
        </div>
      )}
    </div>
  );
}
