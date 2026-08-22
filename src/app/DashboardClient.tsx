"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import SplashScreen from "@/components/SplashScreen";
import DashboardView from "@/components/DashboardView";

export default function DashboardClient({ initialReports }: { initialReports: any[] }) {
  const [showSplash, setShowSplash] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");

  const handleEnter = useCallback(() => {
    setShowSplash(true);
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    setCurrentView("dashboard");
  }, []);

  return (
    <div className={currentView === "landing" ? "relative w-full min-h-screen bg-white" : "relative w-full h-screen overflow-hidden bg-black"}>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      </AnimatePresence>

      {currentView === "landing" ? (
        <LandingPage onEnter={handleEnter} />
      ) : (
        <DashboardView initialReports={initialReports} />
      )}
    </div>
  );
}
