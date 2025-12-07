import { redirect } from "next/dist/client/components/navigation";

export default function SellerDashboard() {
  redirect("/seller/login");
}
