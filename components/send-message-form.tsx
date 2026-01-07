"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SendMessageForm({
  studentId,
  templates,
}: {
  studentId: string;
  templates: { key: string; title: string }[];
}) {
  const [templateKey, setTemplateKey] = useState(templates[0]?.key ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, templateKey }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase text-foreground/60">Template</label>
        <select
          value={templateKey}
          onChange={(event) => setTemplateKey(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border border-muted bg-white px-4 text-sm"
        >
          {templates.map((template) => (
            <option key={template.key} value={template.key}>
              {template.title}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={status === "sending" || !templateKey}>
        {status === "sending" ? "Sending..." : "Send message"}
      </Button>
      {status === "sent" ? (
        <p className="text-sm text-foreground/70">Message queued.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500">Send failed. Try again.</p>
      ) : null}
    </form>
  );
}
