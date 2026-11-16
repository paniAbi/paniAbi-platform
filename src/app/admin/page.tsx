import { redirect } from "next/navigation";

// The admin has one section for now: the products.
export default function AdminPage() {
  redirect("/admin/productos");
}
