// Abril's login session: a random token in an httpOnly cookie, and its hash
// in the Session table (see "Data Access Layer" in the Next.js 16
// authentication guide). Every page and server action that changes data
// asks this file who is logged in; redirecting to the login screen is not
// enough on its own.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  hashSessionToken,
  isSessionExpired,
  newSessionToken,
  sessionExpiresAt,
} from "@/lib/auth/session-token";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "paniabi_session";
export const LOGIN_PATH = "/admin/entrar";

export type CurrentUser = { id: string; username: string };

export async function createSession(userId: string): Promise<void> {
  const token = newSessionToken();
  const expiresAt = sessionExpiresAt();

  await prisma.session.create({
    data: { tokenHash: hashSessionToken(token), userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Plain http on localhost; https everywhere else.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Memoised per request, so a page and its actions query the session once.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    select: { expiresAt: true, user: { select: { id: true, username: true } } },
  });
  if (!session) return null;

  if (isSessionExpired(session.expiresAt)) {
    await prisma.session.deleteMany({ where: { tokenHash } });
    return null;
  }
  return session.user;
});

// For admin pages: sends anyone who is not logged in to the login screen.
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}
