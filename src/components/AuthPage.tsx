"use client";

import { useState } from "react";
import { ShieldAlert, User, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

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
            className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group mt-2"
          >
            Davom etish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Yoki</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: '/' })}
            className="w-full bg-white text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google orqali kirish
          </button>
        </form>
        
        <p className="text-[10px] text-center text-slate-400 mt-6 font-medium">
          Ma'lumotlaringiz shahar xavfsizligini ta'minlash maqsadida saqlanadi.
        </p>
      </motion.div>
    </div>
  );
}
