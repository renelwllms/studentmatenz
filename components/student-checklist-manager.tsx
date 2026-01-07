"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ChecklistItem = {
  id: string;
  title: string;
  category: "PRE_ARRIVAL" | "ARRIVAL_DAY" | "FIRST_WEEK" | "WORK_READINESS";
  status: "PENDING" | "COMPLETED";
};

const categoryLabel = (value: ChecklistItem["category"]) =>
  value.replaceAll("_", " ");

export function StudentChecklistManager() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/student/checklist");
    if (res.ok) {
      const data = await res.json();
      setItems(data.checklist || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (item: ChecklistItem) => {
    const nextStatus = item.status === "PENDING" ? "COMPLETED" : "PENDING";
    const res = await fetch(`/api/student/checklist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!res.ok) {
      setStatus("Update failed");
      return;
    }
    setStatus("Updated");
    setItems((prev) =>
      prev.map((existing) =>
        existing.id === item.id ? { ...existing, status: nextStatus } : existing
      )
    );
  };

  const grouped = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    const key = categoryLabel(item.category);
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {});

  if (loading) {
    return <Card>Loading checklist...</Card>;
  }

  return (
    <div className="space-y-6">
      {Object.keys(grouped).length === 0 ? (
        <Card>No checklist items yet.</Card>
      ) : (
        Object.entries(grouped).map(([category, list]) => (
          <Card key={category}>
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="mt-4 space-y-3 text-sm">
              {list.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <Button type="button" variant="soft" onClick={() => toggle(item)}>
                    {item.status === "PENDING" ? "Mark complete" : "Mark pending"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
      {status ? <p className="text-xs text-foreground/60">{status}</p> : null}
    </div>
  );
}
