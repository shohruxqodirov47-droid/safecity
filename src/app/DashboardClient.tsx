"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import SplashScreen from "@/components/SplashScreen";
import DashboardView from "@/components/DashboardView";
import AuthPage from "@/components/AuthPage";

export default function DashboardClient({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [showSplash, setShowSplash] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard">("landing");

  const fetchReports = useCallback(async () => {
    try {
      const { getReports } = await import("@/actions/report.actions");
      const data = await getReports(Date.now());
      setReports(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleLandingEnter = useCallback(async () => {
    try {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      if (session?.user) {
        localStorage.setItem("safecity_user", JSON.stringify({ name: session.user.name, phone: session.user.email }));
        setShowSplash(true);
        return;
      }
    } catch (e) {}

    const user = localStorage.getItem("safecity_user");
    if (user) {
      setShowSplash(true);
    } else {
      setCurrentView("auth");
    }
  }, []);

  const handleAuthComplete = useCallback(() => {
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

      {currentView === "landing" && !showSplash && (
        <LandingPage onEnter={handleLandingEnter} />
      )}
      
      {currentView === "auth" && !showSplash && (
        <AuthPage onComplete={handleAuthComplete} />
      )}
      
      {currentView === "dashboard" && (
        <DashboardView initialReports={reports} onRefresh={fetchReports} />
      )}
    </div>
  );
}
