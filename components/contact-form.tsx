"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Full name" {...register("name")} />
        {errors.name ? (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <Input placeholder="Email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <Input placeholder="Phone (optional)" {...register("phone")} />
      </div>
      <div>
        <Textarea placeholder="Tell us about the student" {...register("message")} />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </Button>
      {status === "sent" ? (
        <p className="text-sm text-foreground/70">Thanks! We'll reply within 24 hours.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      ) : null}
    </form>
  );
}
