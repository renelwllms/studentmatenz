"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ChecklistItem = {
  id: string;
  status: "PENDING" | "COMPLETED";
};

export function StudentProgress() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/student/checklist");
      if (res.ok) {
        const data = await res.json();
        setItems(data.checklist || []);
      }
      setLoading(false);
    };
    void load();
  }, []);

  const completed = items.filter((item) => item.status === "COMPLETED").length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Checklist progress</h2>
      <p className="mt-2 text-sm text-foreground/70">
        {loading ? "Loading checklist..." : `${completed} of ${total} tasks completed`}
      </p>
      <div className="mt-4">
        <Progress value={percent} />
        <div className="mt-2 text-xs text-foreground/60">{percent}% complete</div>
      </div>
    </Card>
  );
}
