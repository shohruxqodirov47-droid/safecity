"use client";

import { useState } from "react";
import { ShieldAlert, User, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3 || phone.length < 9) return;
    
    // Save to local storage
    localStorage.setItem("safecity_user", JSON.stringify({ name, phone }));
    onComplete();
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-slate-300/30 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-full" />
            <div className="relative bg-yellow-400 p-4 rounded-2xl text-black">
              <ShieldAlert className="w-8 h-8" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Safe<span className="text-yellow-500">City</span> ga Xush Kelibsiz
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Shahar xavfsizligiga hissa qo'shish uchun tizimga kiring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ism va Familiya
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none text-slate-900 placeholder-slate-400 font-medium text-sm"
                placeholder="Alisher Rustamov"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Telefon raqam
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none text-slate-900 placeholder-slate-400 font-medium text-sm"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-4 bg-yellow-400 text-black rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-yellow-500 active:scale-[0.98] transition-all shadow-md"
          >
            Tizimga kirish <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-[10px] text-center text-slate-400 mt-6 font-medium">
          Ma'lumotlaringiz shahar xavfsizligini ta'minlash maqsadida saqlanadi.
        </p>
      </motion.div>
    </div>
  );
}
