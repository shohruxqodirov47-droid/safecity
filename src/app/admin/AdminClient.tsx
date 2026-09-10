"use client";

import { useState, useTransition } from "react";
import { ShieldAlert, LayoutDashboard, Zap, Droplets, Car, Trash2, Shield, Lock, Search, Filter, CheckCircle2, AlertCircle, Clock, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateReportStatus, makeAdmin } from "@/actions/report.actions";
import { motion } from "framer-motion";

const DEPARTMENTS = [
  { id: "ALL", name: "Shahar Hokimiyati (Umumiy)", icon: LayoutDashboard, color: "bg-slate-800 text-white" },
  { id: "CHIROQ", name: "Elektr Tarmoqlari", icon: Zap, color: "bg-yellow-500 text-black" },
  { id: "QUVUR", name: "Suv-Oqova xizmati", icon: Droplets, color: "bg-blue-500 text-white" },
  { id: "YOL", name: "Yo'l Qurilish", icon: Car, color: "bg-slate-600 text-white" },
  { id: "IFLOSLIK", name: "Obodonlashtirish", icon: Trash2, color: "bg-green-500 text-white" },
  { id: "XAVFSIZLIK", name: "Ichki Ishlar (IIB)", icon: Shield, color: "bg-red-500 text-white" },
];

export default function AdminClient({ initialReports }: { initialReports: any[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminMsg, setAdminMsg] = useState("");
  
  const [activeDept, setActiveDept] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode !== "admin444") {
      setAdminMsg("Noto'g'ri kod!");
      return;
    }
    const userStr = localStorage.getItem("safecity_user");
    if (!userStr) {
      setAdminMsg("Tizimga kirmagansiz!");
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (!user.email) {
        setAdminMsg("Google orqali kirmagansiz!");
        return;
      }
      const res = await makeAdmin(user.email);
      if (res.error) setAdminMsg(res.error);
      else setAdminMsg("Tabriklaymiz! Siz Super Adminsiz.");
    } catch {
      setAdminMsg("Xatolik yuz berdi");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      setError("Parol noto'g'ri. (Maslahat: admin123)");
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      await updateReportStatus(id, newStatus);
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl border border-slate-700">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-slate-700 p-4 rounded-full text-yellow-400 mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black text-white">Boshqaruv Paneli</h1>
            <p className="text-slate-400 text-sm mt-2">Mas'ul xodimlar uchun</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Parolni kiriting..."
                className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-yellow-400 transition-colors"
              />
              {error && <p className="text-red-400 text-xs font-bold mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-black font-black py-3 rounded-xl hover:bg-yellow-300 transition-colors">
              Tizimga kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredReports = activeDept === "ALL" 
    ? initialReports 
    : initialReports.filter(r => r.category === activeDept);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-lg text-black">
            <ShieldAlert size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-black text-lg">SafeCity Admin</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">B2G Dashboard</p>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-2">Departamentlar</p>
          {DEPARTMENTS.map(dept => {
            const count = dept.id === "ALL" ? initialReports.length : initialReports.filter(r => r.category === dept.id).length;
            const isActive = activeDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                  isActive ? dept.color : "hover:bg-slate-800 text-slate-400"
                )}
              >
                <div className="flex items-center gap-3">
                  <dept.icon size={18} />
                  <span className="font-bold text-sm">{dept.name}</span>
                </div>
                {count > 0 && (
                  <span className={cn("text-xs font-black px-2 py-0.5 rounded-full", isActive ? "bg-black/20" : "bg-slate-800 text-slate-300")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <form onSubmit={handleMakeAdmin} className="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Super Admin Huquqi</p>
            <div className="flex gap-2">
              <input 
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Kod..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-400"
              />
              <button type="submit" className="bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-xs font-black hover:bg-yellow-300">
                <Key size={14} />
              </button>
            </div>
            {adminMsg && (
              <p className={cn("text-[10px] font-bold mt-2", adminMsg.includes("Tabrik") ? "text-green-400" : "text-red-400")}>
                {adminMsg}
              </p>
            )}
          </form>

          <button onClick={() => setIsAuthenticated(false)} className="w-full py-2.5 text-sm font-bold text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            Chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{DEPARTMENTS.find(d => d.id === activeDept)?.name}</h2>
            <p className="text-slate-500 text-sm mt-1">Kelib tushgan murojaatlar va ularning holati</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-4 border-r border-slate-200">
              <AlertCircle className="text-red-500 w-4 h-4" />
              <span className="text-sm font-bold">{filteredReports.filter(r => r.status === 'PENDING').length} Yangi</span>
            </div>
            <div className="flex items-center gap-2 px-4 border-r border-slate-200">
              <Clock className="text-blue-500 w-4 h-4" />
              <span className="text-sm font-bold">{filteredReports.filter(r => r.status === 'IN_PROGRESS').length} Jarayonda</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <CheckCircle2 className="text-green-500 w-4 h-4" />
              <span className="text-sm font-bold">{filteredReports.filter(r => r.status === 'RESOLVED').length} Hal qilingan</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Rasm</th>
                  <th className="p-4">Sarlavha / Manzil</th>
                  <th className="p-4">Kategoriya / Xavf</th>
                  <th className="p-4">Ovoz</th>
                  <th className="p-4 text-right">Holatni o'zgartirish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                      Bu bo'limda hozircha murojaatlar yo'q
                    </td>
                  </tr>
                )}
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 align-top">
                      {report.imageUrl ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                          <img src={report.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <span className="text-xs text-slate-400">Rasmsiz</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <p className="font-bold text-slate-900 text-sm mb-1">{report.title}</p>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{report.description}</p>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Sana: {new Date(report.createdAt).toLocaleString("uz-UZ")}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2 items-start">
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-md uppercase border border-slate-200 text-slate-700">
                          {report.category}
                        </span>
                        <span className={cn("text-[10px] font-black px-2 py-1 rounded-md uppercase border",
                          report.severityLevel === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' :
                          report.severityLevel === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          report.severityLevel === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        )}>
                          {report.severityLevel}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-top text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-black text-sm">
                        {report.upvotes}
                      </span>
                    </td>
                    <td className="p-4 align-top text-right">
                      <select
                        value={report.status}
                        disabled={isPending}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className={cn(
                          "px-3 py-2 text-xs font-black rounded-xl border outline-none cursor-pointer transition-all shadow-sm appearance-none text-center disabled:opacity-50",
                          report.status === 'PENDING' ? 'bg-orange-50 border-orange-300 text-orange-700 focus:ring-orange-200' :
                          report.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-300 text-blue-700 focus:ring-blue-200' :
                          'bg-green-50 border-green-300 text-green-700 focus:ring-green-200'
                        )}
                      >
                        <option value="PENDING">Kutilmoqda</option>
                        <option value="IN_PROGRESS">Jarayonda (Ishlanmoqda)</option>
                        <option value="RESOLVED">✓ Hal qilindi</option>
                      </select>
                      <div className="mt-2">
                        <a href={`/?lat=${report.latitude}&lng=${report.longitude}`} target="_blank" className="text-[10px] text-blue-500 font-bold hover:underline">
                          Xaritada ko'rish ↗
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
