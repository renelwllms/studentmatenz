import { Card } from "@/components/ui/card";

export default function ParentViewPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold">Parent update</h1>
      <p className="mt-4 text-lg text-foreground/70">
        View-only updates for families. This link expires automatically.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Student status</h2>
          <p className="mt-2 text-sm text-foreground/70">Arrival confirmed · Checklist 60% complete</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Latest check-in</h2>
          <p className="mt-2 text-sm text-foreground/70">StudentMate checked in on 4 Feb.</p>
        </Card>
      </div>
    </div>
  );
}
