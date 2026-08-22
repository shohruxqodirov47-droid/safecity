"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Tizim yuklanmoqda...");

  useEffect(() => {
    const steps = [
      { at: 20, text: "Xarita modulini yuklash..." },
      { at: 45, text: "AI analizatorini tayyorlash..." },
      { at: 70, text: "Cloud bazaga ulanish..." },
      { at: 90, text: "Interfeysni sozlash..." },
      { at: 100, text: "Tayyor!" },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setProgress(current);

      const step = steps.find((s) => s.at === current);
      if (step) setStatusText(step.text);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => onFinish(), 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      {/* Background glow */}
      <div className="absolute w-64 h-64 bg-yellow-400/10 rounded-full blur-[100px]" />
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 rounded-full scale-150" />
        <div className="relative bg-yellow-400 p-5 rounded-3xl text-black shadow-[0_0_60px_rgba(234,179,8,0.3)]">
          <ShieldAlert className="w-12 h-12" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-black text-white tracking-tight mb-1"
      >
        Safe<span className="text-yellow-400">City</span> AI
      </motion.h1>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs text-white/25 font-bold uppercase tracking-[0.3em] mb-10"
      >
        Aqlli shahar xavfsizlik tizimi
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 240, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="w-60 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] text-white/20 font-medium">{statusText}</span>
          <span className="text-[10px] text-yellow-400/50 font-black">{progress}%</span>
        </div>
      </motion.div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 flex items-center gap-2"
      >
        <span className="text-[9px] text-white/10 font-bold uppercase tracking-[0.2em]">Powered by</span>
        <span className="text-[9px] text-yellow-400/30 font-black uppercase tracking-[0.2em]">Gemini AI</span>
      </motion.div>
    </motion.div>
  );
}
