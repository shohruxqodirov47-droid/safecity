import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("./DashboardClient"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#f8fafc] overflow-hidden">
      <DashboardClient initialReports={[]} />
    </main>
  );
}
