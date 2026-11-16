"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { LOGIN_PATH, createSession, endSession } from "@/lib/auth/session";
import { loginFormSchema, type LoginFormValues } from "@/lib/login-schema";
import { prisma } from "@/lib/prisma";

export type LoginResult = { success: false; message: string };

const WRONG_CREDENTIALS = "El usuario o la contraseña no son correctos.";

// Checked when the user does not exist, so that answer takes as long as a
// wrong password and does not reveal which usernames exist.
let dummyHash: Promise<string> | undefined;

export async function login(values: LoginFormValues): Promise<LoginResult> {
  const parsed = loginFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    select: { id: true, passwordHash: true },
  });
  dummyHash ??= hashPassword("not a real password");
  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? (await dummyHash),
  );
  if (!user || !passwordMatches) {
    return { success: false, message: WRONG_CREDENTIALS };
  }

  await createSession(user.id);
  redirect("/admin/productos");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect(LOGIN_PATH);
}
