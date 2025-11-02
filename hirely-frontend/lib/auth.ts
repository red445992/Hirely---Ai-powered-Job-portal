// src/lib/auth.ts
export type AuthResponse =
  | { ok: true; message: string; redirect?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function login({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: "candidate" | "employer";
}): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 900));
  if (!email.includes("@") || password.length < 6) {
    return { ok: false, message: "Invalid credentials", fieldErrors: { email: "Check email", password: "Min 6 chars" } };
  }
  return { ok: true, message: `Welcome back, ${role === "candidate" ? "Candidate" : "Employer"}!`, redirect: role === "candidate" ? "/jobs" : "/dashboard/employer" };
}

export async function register({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
}): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 1100));
  if (password.length < 6) {
    return { ok: false, message: "Password too short", fieldErrors: { password: "Min 6 chars" } };
  }
  return { ok: true, message: `Account created for ${name}`, redirect: role === "candidate" ? "/jobs" : "/dashboard/employer" };
}
