"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Zap, Brain, Users, MapPin, ArrowRight, ChevronDown, Eye, Shield, Sparkles, Globe, BarChart3, Camera } from "lucide-react";

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative w-full min-h-screen bg-white text-black overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Yellow accent blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]" />

        {/* Nav */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-yellow-400 p-1.5 rounded-xl text-black shadow-lg shadow-yellow-400/20">
              <ShieldAlert className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-base font-black tracking-tight">Safe<span className="text-yellow-500">City</span></span>
          </div>
          <button
            onClick={onEnter}
            className="text-xs font-bold text-black bg-black/[0.04] hover:bg-yellow-400 hover:text-black transition-all px-5 py-2.5 rounded-full border border-black/10 hover:border-yellow-400"
          >
            Tizimga kirish →
          </button>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-10">
          {/* Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-600 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-8"
          >
            <Sparkles size={14} /> Gemini AI bilan ishlovchi
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6"
          >
            Shahringiz
            <br />
            <span className="text-yellow-500">Xavfsizligi</span>
            <br />
            <span className="text-black/70">Sizning Qo'lingizda</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-base md:text-lg text-black/40 font-medium max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Sun'iy intellekt yordamida shahar muammolarini aniqlang, xabar bering va jamoatchilik nazoratini amalga oshiring.
            <span className="text-yellow-600 font-bold"> Birgalikda xavfsiz shahar quramiz.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onEnter}
              className="group bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-yellow-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-xl shadow-yellow-400/20"
            >
              Xaritani ochish <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onEnter}
              className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-black/80 transition-all flex items-center gap-2 active:scale-95"
            >
              Demo ko'rish <Eye size={18} />
            </button>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 mt-16"
          >
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-500">AI</div>
              <div className="text-[9px] text-black/25 font-bold uppercase tracking-wider mt-1">Gemini Vision</div>
            </div>
            <div className="w-px h-8 bg-black/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-black text-black">24/7</div>
              <div className="text-[9px] text-black/25 font-bold uppercase tracking-wider mt-1">Jonli monitoring</div>
            </div>
            <div className="w-px h-8 bg-black/[0.08]" />
            <div className="text-center">
              <div className="text-2xl font-black text-black">0.5s</div>
              <div className="text-[9px] text-black/25 font-bold uppercase tracking-wider mt-1">AI javob vaqti</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 text-black/15"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-28 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[10px] font-bold text-yellow-400/60 uppercase tracking-[0.3em]">Qanday ishlaydi?</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-white">
              3 ta <span className="text-yellow-400">oddiy</span> qadam
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, step: "01", title: "Joyni belgilang", desc: "Xaritadan muammoli joyni bir marta bosib tanlang" },
              { icon: Camera, step: "02", title: "Rasm va ma'lumot", desc: "Muammo haqida yozing va dalil sifatida rasm yuklang" },
              { icon: Brain, step: "03", title: "AI tahlil qiladi", desc: "Gemini AI rasmni ko'rib, xavflilik darajasini aniqlaydi" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.08] hover:border-yellow-400/30 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-2xl text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-500">
                    <item.icon size={24} />
                  </div>
                  <span className="text-5xl font-black text-white/[0.04] group-hover:text-yellow-400/10 transition-colors">{item.step}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/30 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-[0.3em]">Xususiyatlar</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-black">
              Nega <span className="text-yellow-500">SafeCity</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Brain, title: "Gemini AI Vision", desc: "Yuklangan rasmni sun'iy intellekt ko'zi bilan tahlil qiladi va xavflilik darajasini avtomatik aniqlaydi", tag: "AI" },
              { icon: Globe, title: "Cloud Infrastructure", desc: "Supabase PostgreSQL bulutli bazasi. Ma'lumotlar 100% xavfsiz va butun dunyo bo'ylab tezkor ishlaydi", tag: "CLOUD" },
              { icon: Users, title: "Jamoatchilik Nazorati", desc: "Fuqarolar muammolarni tasdiqlaydi (Upvote). Eng ko'p ovoz olgan muammo avtomatik prioritetga chiqadi", tag: "SOCIAL" },
              { icon: BarChart3, title: "Real-time Analitika", desc: "Barcha hodisalar real vaqtda statistik tahlil qilinadi. CRITICAL, HIGH, MEDIUM, LOW darajalari ko'rsatiladi", tag: "DATA" },
              { icon: Eye, title: "PWA Texnologiyasi", desc: "Sayt telefon ekraniga ilova sifatida o'rnatiladi. Internet yo'q bo'lganda ham ishlaydi", tag: "MOBILE" },
              { icon: Zap, title: "Tezkor Javob", desc: "Hodisa kiritilishi bilan 0.5 soniya ichida AI javob qaytaradi. Hech qanday kutish yo'q", tag: "FAST" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-black/[0.02] border border-black/[0.06] rounded-3xl p-6 hover:bg-yellow-400/5 hover:border-yellow-400/30 transition-all duration-500 group flex gap-5"
              >
                <div className="shrink-0 bg-yellow-400 p-3 rounded-2xl text-black h-fit shadow-lg shadow-yellow-400/20 group-hover:shadow-yellow-400/40 transition-all duration-500">
                  <item.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-black text-black">{item.title}</h3>
                    <span className="text-[8px] font-black text-yellow-600 bg-yellow-400/20 px-2 py-0.5 rounded-full">{item.tag}</span>
                  </div>
                  <p className="text-sm text-black/35 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-28 px-6 bg-yellow-400">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-black p-4 rounded-3xl text-yellow-400 w-fit mx-auto mb-6 shadow-2xl">
              <ShieldAlert size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-black">
              Shahringizni xavfsiz qiling
            </h2>
            <p className="text-black/50 font-semibold mb-8 max-w-md mx-auto text-lg">
              Har bir fuqaro o'z mahallasini xavfsizroq qilish uchun hissasini qo'shishi mumkin.
            </p>
            <button
              onClick={onEnter}
              className="group bg-black text-yellow-400 px-10 py-4 rounded-2xl font-black text-base hover:bg-black/80 transition-all duration-300 flex items-center gap-3 mx-auto active:scale-95 shadow-2xl"
            >
              Hoziroq boshlash <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1 rounded-lg text-black">
              <ShieldAlert size={14} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-white/40">Safe<span className="text-yellow-400/60">City</span> AI</span>
          </div>
          <p className="text-[10px] text-white/20 font-medium text-center">
            © 2026 SafeCity AI. Barcha huquqlar himoyalangan. Gemini AI texnologiyasi asosida.
          </p>
          <span className="text-[10px] text-white/15 font-bold uppercase tracking-widest">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
