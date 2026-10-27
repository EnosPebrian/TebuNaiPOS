import { redirect } from "next/navigation";
import { adminConfigured, currentAdmin } from "@/lib/server/admin";
import AdminLogin from "@/components/admin/AdminLogin";
export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return <main id="main-content" tabIndex={-1}><AdminLogin configured={adminConfigured()} /></main>;
}
