"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TemplateItem = {
  id: string;
  key: string;
  title: string;
  body: string;
  variablesJson: string[];
};

function parseVariables(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState<TemplateItem | null>(null);

  const load = async () => {
    const res = await fetch("/api/templates");
    if (res.ok) {
      setTemplates(await res.json());
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      key: form.get("key")?.toString() || "",
      title: form.get("title")?.toString() || "",
      body: form.get("body")?.toString() || "",
      variables: parseVariables(form.get("variables")?.toString() || ""),
    };
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setStatus("Create failed");
      return;
    }
    event.currentTarget.reset();
    setStatus("Created");
    await load();
  };

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      key: editing.key,
      title: form.get("title")?.toString() || "",
      body: form.get("body")?.toString() || "",
      variables: parseVariables(form.get("variables")?.toString() || ""),
    };
    const res = await fetch(`/api/templates/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setStatus("Update failed");
      return;
    }
    setEditing(null);
    setStatus("Updated");
    await load();
  };

  const onDelete = async (id: string) => {
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setStatus("Delete failed");
      return;
    }
    setStatus("Deleted");
    await load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Create template</h2>
        <form className="mt-4 grid gap-4" onSubmit={onCreate}>
          <Input name="key" placeholder="Key (e.g. welcome)" required />
          <Input name="title" placeholder="Title" required />
          <Textarea name="body" placeholder="Template body" required />
          <Input name="variables" placeholder="Variables (comma or new line separated)" />
          <Button type="submit">Create template</Button>
        </form>
      </Card>

      {editing ? (
        <Card>
          <h2 className="text-lg font-semibold">Edit template</h2>
          <form className="mt-4 grid gap-4" onSubmit={onUpdate}>
            <Input name="title" defaultValue={editing.title} required />
            <Textarea name="body" defaultValue={editing.body} required />
            <Input
              name="variables"
              defaultValue={editing.variablesJson.join(", ")}
              placeholder="Variables"
            />
            <div className="flex gap-3">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-lg font-semibold">Template list</h2>
        <div className="mt-4 space-y-3 text-sm">
          {templates.length === 0 ? (
            <p className="text-foreground/60">No templates yet.</p>
          ) : (
            templates.map((tpl) => (
              <div key={tpl.id} className="rounded-2xl border border-muted bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{tpl.title}</div>
                    <div className="text-xs text-foreground/60">{tpl.key}</div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {tpl.variablesJson.join(", ")}
                  </div>
                </div>
                <div className="mt-2 text-xs text-foreground/60">{tpl.body}</div>
                <div className="mt-3 flex gap-3">
                  <Button type="button" variant="soft" onClick={() => setEditing(tpl)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => onDelete(tpl.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {status ? <p className="mt-3 text-xs text-foreground/60">{status}</p> : null}
      </Card>
    </div>
  );
}
