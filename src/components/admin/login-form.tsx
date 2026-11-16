"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { login } from "@/app/admin/entrar/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFormSchema, type LoginFormValues } from "@/lib/login-schema";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setMessage("");
    // On success the action redirects, so a result means it failed.
    const result = await login(values);
    if (result) setMessage(result.message);
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="login-username">Usuario</Label>
        <Input
          id="login-username"
          autoComplete="username"
          autoCapitalize="none"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={
            errors.username ? "login-username-error" : undefined
          }
          {...register("username")}
        />
        {errors.username && (
          <p id="login-username-error" className="text-destructive text-sm">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Contraseña</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          {...register("password")}
        />
        {errors.password && (
          <p id="login-password-error" className="text-destructive text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand hover:bg-brand-hover h-10 w-full rounded-md text-white"
      >
        {isSubmitting && (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        )}
        Entrar
      </Button>
      <p aria-live="polite" className="text-destructive min-h-5 text-sm">
        {message}
      </p>
    </form>
  );
}
