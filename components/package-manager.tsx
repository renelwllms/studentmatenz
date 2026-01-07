"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PackageItem = {
  id: string;
  name: string;
  price: string;
  featuresJson: string[];
};

function parseFeatures(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PackageManager() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState<PackageItem | null>(null);

  const load = async () => {
    const res = await fetch("/api/packages");
    if (res.ok) {
      setPackages(await res.json());
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name")?.toString() || "",
      price: form.get("price")?.toString() || "",
      features: parseFeatures(form.get("features")?.toString() || ""),
    };
    const res = await fetch(`/api/packages/${editing.id}`, {
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

  return (
    <div className="space-y-6">
      {editing ? (
        <Card>
          <h2 className="text-lg font-semibold">Edit package</h2>
          <form className="mt-4 grid gap-4" onSubmit={onUpdate}>
            <Input name="name" defaultValue={editing.name} readOnly required />
            <Input name="price" defaultValue={editing.price} required />
            <Textarea
              name="features"
              defaultValue={editing.featuresJson.join("\n")}
              required
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
        <h2 className="text-lg font-semibold">Package list</h2>
        <div className="mt-4 space-y-3 text-sm">
          {packages.length === 0 ? (
            <p className="text-foreground/60">No packages yet.</p>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="rounded-2xl border border-muted bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-foreground">{pkg.name}</div>
                  <div className="text-foreground/70">{pkg.price}</div>
                </div>
                <div className="mt-1 text-xs text-foreground/60">
                  {pkg.featuresJson.join(" · ")}
                </div>
                <div className="mt-3 flex gap-3">
                  <Button type="button" variant="soft" onClick={() => setEditing(pkg)}>
                    Edit
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
