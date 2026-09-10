import { getReports } from "@/actions/report.actions";
import AdminClient from "./AdminClient";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const reports = await getReports();
  
  return <AdminClient initialReports={reports} />;
}
