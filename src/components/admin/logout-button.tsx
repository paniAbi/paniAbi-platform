import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/entrar/actions";
import { Button } from "@/components/ui/button";

// A plain form posting to the server action: works without JavaScript.
export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" size="sm" className="text-subtle">
        <LogOut aria-hidden="true" />
        Salir
      </Button>
    </form>
  );
}
