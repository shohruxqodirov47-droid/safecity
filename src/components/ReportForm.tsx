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

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAiScanning(false);

    const res = await createReport(null, formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      formRef.current?.reset();
      setImagePreview(null);
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] p-5 rounded-2xl relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-transparent" />

      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
          <AlertTriangle className="text-yellow-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-white tracking-tight">Yangi Hodisa</h2>
          <p className="text-[10px] font-medium text-white/25 flex items-center gap-1">
            <Sparkles size={10} className="text-yellow-400" /> AI vizual analizator
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} ref={formRef} className="space-y-3">
        <input
          type="text"
          name="title"
          required
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all outline-none text-white placeholder-white/20 font-medium text-sm"
          placeholder="Nima sodir bo'ldi?"
        />

        <textarea
          name="description"
          required
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all outline-none h-20 resize-none text-white placeholder-white/20 font-medium text-sm"
          placeholder="Batafsil yozing..."
        />

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
                ? "border-yellow-400/30 bg-yellow-400/5"
                : "border-white/[0.08] bg-white/[0.02] group-hover:border-yellow-400/20 group-hover:bg-yellow-400/5"
            )}
          >
            {imagePreview ? (
              <span className="text-yellow-400 font-bold flex items-center gap-2 text-xs">
                <ImageIcon size={16} /> Rasm biriktirildi ✓
              </span>
            ) : (
              <span className="text-white/20 font-medium flex items-center gap-2 text-xs">
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
              ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-400 font-bold"
              : "bg-white/[0.02] border-white/[0.06] text-white/20 font-medium"
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
          <div className="p-3 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 font-bold">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !location}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden",
            loading || !location
              ? "bg-white/[0.04] text-white/15 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-[0.98]"
          )}
        >
          {loading ? (
            aiScanning ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-2 text-yellow-400 font-bold"
              >
                <Loader2 className="animate-spin" size={16} /> AI Analiz qilmoqda...
              </motion.div>
            ) : (
              <span className="animate-pulse text-white/30">Saqlanmoqda...</span>
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
