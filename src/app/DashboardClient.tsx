"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LandingPage from "@/components/LandingPage";
import SplashScreen from "@/components/SplashScreen";
import DashboardView from "@/components/DashboardView";

export default function DashboardClient({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");

  useEffect(() => {
    // Fetch real reports on the client side to bypass Vercel build hanging
    const fetchReports = async () => {
      try {
        const { getReports } = await import('@/actions/report.actions');
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to load reports:", error);
      }
    };
    fetchReports();
  }, []);

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
        <DashboardView initialReports={reports} />
      )}
    </div>
  );
}
