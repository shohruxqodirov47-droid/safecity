import dynamic from "next/dynamic";
import { getReports } from "@/actions/report.actions";

// Fix Map SSR issue completely by making the entire Dashboard client-side where needed, 
// but keeping data fetching on the Server (Next.js 14 Best Practice)
const DashboardClient = dynamic(() => import("./DashboardClient"), { ssr: false });

export const revalidate = 0; // Disable caching for MVP real-time feel

export default async function Home() {
  const reports = await getReports();

  return (
    <main className="h-screen w-full bg-[#f8fafc] overflow-hidden">
      <DashboardClient initialReports={reports} />
    </main>
  );
}
