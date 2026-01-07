"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ChecklistItem = {
  id: string;
  title: string;
  category: "PRE_ARRIVAL" | "ARRIVAL_DAY" | "FIRST_WEEK" | "WORK_READINESS";
  status: "PENDING" | "COMPLETED";
  notes: string | null;
};

const categories = [
  { value: "PRE_ARRIVAL", label: "Pre-arrival" },
  { value: "ARRIVAL_DAY", label: "Arrival day" },
  { value: "FIRST_WEEK", label: "First week" },
  { value: "WORK_READINESS", label: "Work readiness" },
] as const;

export function ChecklistManager({
  studentId,
  initialItems,
}: {
  studentId: string;
  initialItems: ChecklistItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
      const key = item.category.replaceAll("_", " ");
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {});
  }, [items]);

  const reload = async () => {
    const res = await fetch(`/api/students/${studentId}`);
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.checklist);
    router.refresh();
  };

  const onCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      studentId,
      title: form.get("title")?.toString() || "",
      category: form.get("category")?.toString() || "PRE_ARRIVAL",
      notes: form.get("notes")?.toString() || undefined,
    };
    const res = await fetch("/api/checklist", {
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
    await reload();
  };

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title")?.toString() || "",
      category: form.get("category")?.toString() || "PRE_ARRIVAL",
      notes: form.get("notes")?.toString() || undefined,
    };
    const res = await fetch(`/api/checklist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setStatus("Update failed");
      return;
    }
    setEditingId(null);
    setStatus("Updated");
    await reload();
  };

  const toggleStatus = async (item: ChecklistItem) => {
    const nextStatus = item.status === "PENDING" ? "COMPLETED" : "PENDING";
    setItems((prev) =>
      prev.map((current) =>
        current.id === item.id ? { ...current, status: nextStatus } : current
      )
    );
    const res = await fetch(`/api/checklist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!res.ok) {
      setStatus("Status update failed");
      setItems((prev) =>
        prev.map((current) =>
          current.id === item.id ? { ...current, status: item.status } : current
        )
      );
      return;
    }
    await reload();
  };

  const onDelete = async (id: string) => {
    const res = await fetch(`/api/checklist/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setStatus("Delete failed");
      return;
    }
    setStatus("Deleted");
    await reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold">Add checklist item</h3>
        <form className="mt-4 grid gap-4" onSubmit={onCreate}>
          <Input name="title" placeholder="Checklist title" required />
          <select
            name="category"
            className="h-12 rounded-2xl border border-muted bg-white px-4 text-sm"
            defaultValue="PRE_ARRIVAL"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <Textarea name="notes" placeholder="Notes (optional)" />
          <Button type="submit">Add item</Button>
        </form>
      </Card>

      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <Card>
            <p className="text-foreground/60">No checklist items yet.</p>
          </Card>
        ) : (
          Object.entries(grouped).map(([category, list]) => (
            <Card key={category}>
              <h3 className="text-xs font-semibold uppercase text-foreground/60">{category}</h3>
              <div className="mt-4 space-y-3 text-sm">
                {list.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border px-4 py-3 ${
                      item.status === "COMPLETED"
                        ? "border-emerald-200 bg-emerald-50/60"
                        : "border-muted bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <Button
                        type="button"
                        variant="soft"
                        className={
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : undefined
                        }
                        onClick={() => toggleStatus(item)}
                      >
                        {item.status === "PENDING" ? "Mark complete" : "Completed"}
                      </Button>
                    </div>
                    {item.notes ? (
                      <p className="mt-2 text-xs text-foreground/60">{item.notes}</p>
                    ) : null}
                    <div className="mt-3 flex gap-3">
                      <Button type="button" variant="soft" onClick={() => setEditingId(item.id)}>
                        Edit
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => onDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                    {editingId === item.id ? (
                      <form className="mt-4 grid gap-3" onSubmit={(event) => onUpdate(event, item.id)}>
                        <Input name="title" defaultValue={item.title} required />
                        <select
                          name="category"
                          className="h-12 rounded-2xl border border-muted bg-white px-4 text-sm"
                          defaultValue={item.category}
                        >
                          {categories.map((categoryOption) => (
                            <option key={categoryOption.value} value={categoryOption.value}>
                              {categoryOption.label}
                            </option>
                          ))}
                        </select>
                        <Textarea name="notes" defaultValue={item.notes ?? ""} />
                        <div className="flex gap-3">
                          <Button type="submit">Save</Button>
                          <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
      {status ? <p className="text-xs text-foreground/60">{status}</p> : null}
    </div>
  );
}
