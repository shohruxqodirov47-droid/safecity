"use client";

import { useRef, useState } from "react";
import { createReport } from "@/actions/report.actions";
import { AlertTriangle, Send, MapPin, Camera, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ReportForm({ location, onSuccess }: { location: [number, number] | null; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Rasm hajmi 2MB dan oshmasligi kerak!");
        e.target.value = '';
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location) return;

    setLoading(true);
    setAiScanning(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("latitude", location[0].toString());
    formData.append("longitude", location[1].toString());
    if (imagePreview) formData.append("image", imagePreview);

    const userStr = localStorage.getItem("safecity_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const oldDesc = formData.get("description") as string;
        formData.set("description", `${oldDesc}\n\n👤 Yuboruvchi: ${user.name} (${user.phone})`);
      } catch (err) {
        // continue without user info
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await createReport(null, formData);

      if (res.error) {
        setError(res.error);
      } else {
        formRef.current?.reset();
        setImagePreview(null);
        onSuccess();
      }
    } catch (err) {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
    } finally {
      setLoading(false);
      setAiScanning(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative overflow-hidden shadow-sm">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent" />

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-yellow-100 rounded-xl border border-yellow-200">
          <AlertTriangle className="text-yellow-600 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-black tracking-tight">Yangi Hodisa</h2>
          <p className="text-[10px] font-bold text-black flex items-center gap-1">
            Xavflilikni o'zingiz belgilang
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} ref={formRef} className="space-y-3">
        <input
          type="text"
          name="title"
          required
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all outline-none text-black placeholder-black font-bold text-sm shadow-sm"
          placeholder="Nima sodir bo'ldi?"
        />

        <textarea
          name="description"
          required
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all outline-none h-20 resize-none text-black placeholder-black font-bold text-sm shadow-sm"
          placeholder="Batafsil yozing..."
        />

        <div>
          <label className="block text-xs font-black text-red-500 uppercase tracking-wider mb-1.5 ml-1">
            ⚠️ Xavf darajasini tanlang:
          </label>
          <select
            name="severityLevel"
            required
            className="w-full px-4 py-3.5 bg-red-50 border-2 border-red-400 rounded-xl focus:ring-4 focus:ring-red-400/30 focus:border-red-500 transition-all outline-none text-red-900 font-black text-sm shadow-md cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23DC2626%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="LOW" className="font-bold text-slate-700 bg-white">🟢 LOW (Past) - Chiroq, mayda muammo</option>
            <option value="MEDIUM" className="font-bold text-slate-700 bg-white">🟡 MEDIUM (O'rta) - Ochiq quduq, xavf</option>
            <option value="HIGH" className="font-bold text-slate-700 bg-white">🟠 HIGH (Yuqori) - Janjal, ochiq sim</option>
            <option value="CRITICAL" className="font-bold text-slate-700 bg-white">🔴 CRITICAL (Kritik) - Yong'in, avariya</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className={cn(
              "w-full h-14 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300",
              imagePreview
                ? "border-yellow-400 bg-yellow-50"
                : "border-slate-400 bg-white group-hover:border-yellow-400/50 group-hover:bg-yellow-50/50"
            )}
          >
            {imagePreview ? (
              <span className="text-black font-bold flex items-center gap-2 text-xs">
                <ImageIcon size={16} /> Rasm biriktirildi ✓
              </span>
            ) : (
              <span className="text-black font-bold flex items-center gap-2 text-xs">
                <Camera size={16} /> Rasm yuklash (Ixtiyoriy)
              </span>
            )}
          </div>
        </div>

        {/* Location Indicator */}
        <div
          className={cn(
            "flex items-center gap-2 text-xs p-3 rounded-xl border transition-all duration-300",
            location
              ? "bg-yellow-50 border-yellow-400 text-black font-bold"
              : "bg-slate-100 border-slate-300 text-black font-bold"
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          {location ? (
            <span>
              {location[0].toFixed(4)}, {location[1].toFixed(4)}
            </span>
          ) : (
            <span>Xaritadan joyni tanlang</span>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200 font-bold">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !location}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-sm",
            loading || !location
              ? "bg-slate-200 text-slate-700 cursor-not-allowed border border-slate-300"
              : "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-md active:scale-[0.98]"
          )}
        >
          {loading ? (
            aiScanning ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-2 text-yellow-700 font-bold"
              >
                <Loader2 className="animate-spin" size={16} /> AI Analiz qilmoqda...
              </motion.div>
            ) : (
              <span className="animate-pulse text-slate-600">Saqlanmoqda...</span>
            )
          ) : (
            <>
              <Send size={16} /> Yuborish
            </>
          )}
        </button>
      </form>
    </div>
  );
}
