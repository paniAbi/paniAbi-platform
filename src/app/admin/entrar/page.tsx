import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = { title: "Entrar | paniAbi" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin/productos");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="border-line shadow-card w-full max-w-sm bg-white/80">
        <CardHeader className="border-line-soft border-b px-5 pb-4">
          <p className="font-display text-ink text-lg">paniAbi</p>
          <CardTitle className="font-display text-ink text-xl">
            Entrar a la administración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pt-5">
          <LoginForm />
          <p className="text-subtle text-sm">
            ¿Te olvidaste la contraseña? Pedile a Juan que te la cambie.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
