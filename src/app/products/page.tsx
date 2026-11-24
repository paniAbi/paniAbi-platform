import { redirect } from "next/navigation";

// Old address of the products admin, before the login (#23).
export default function OldProductsPage() {
  redirect("/admin/productos");
}
