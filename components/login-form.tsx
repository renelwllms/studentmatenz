"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [role, setRole] = useState<"ADMIN" | "STUDENT">("ADMIN");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const portalCode = form.get("portalCode")?.toString() || "";
    const phone = form.get("phone")?.toString() || "";

    const result = await signIn("credentials", {
      redirect: false,
      role,
      email,
      password,
      portalCode,
      phone,
      callbackUrl: role === "ADMIN" ? "/app/admin" : "/app/student",
    });

    if (result?.error) {
      setError("Login failed. Please check your details.");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="rounded-[28px] border border-muted bg-white p-6 shadow">
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className={`rounded-full px-4 py-2 ${role === "ADMIN" ? "bg-foreground text-white" : "bg-slate-100"}`}
          onClick={() => setRole("ADMIN")}
        >
          Admin
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 ${role === "STUDENT" ? "bg-foreground text-white" : "bg-slate-100"}`}
          onClick={() => setRole("STUDENT")}
        >
          Student
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {role === "ADMIN" ? (
          <>
            <Input name="email" placeholder="Admin email" type="email" required />
            <Input name="password" placeholder="Password" type="password" required />
          </>
        ) : (
          <>
            <Input name="portalCode" placeholder="Portal code" required />
            <Input name="phone" placeholder="Phone number" required />
          </>
        )}
        <Button type="submit">Sign in</Button>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </form>
    </div>
  );
}
