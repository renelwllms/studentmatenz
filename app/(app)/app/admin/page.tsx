import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const [arrivalsNextWeek, pendingChecklist, completedThisWeek, messagesThisWeek, upcoming] =
    await Promise.all([
      prisma.studentProfile.count({
        where: { arrivalDate: { gte: now, lte: nextWeek } },
      }),
      prisma.checklistItem.count({ where: { status: "PENDING" } }),
      prisma.checklistItem.count({
        where: { status: "COMPLETED", completedAt: { gte: weekAgo } },
      }),
      prisma.messageLog.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.studentProfile.findMany({
        where: { arrivalDate: { gte: now } },
        orderBy: { arrivalDate: "asc" },
        take: 5,
        include: { package: true },
      }),
    ]);

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Arrivals next 7 days", value: arrivalsNextWeek },
          { label: "Pending checklist items", value: pendingChecklist },
          { label: "Tasks completed this week", value: completedThisWeek },
          { label: "Messages sent", value: messagesThisWeek },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white">
            <p className="text-xs uppercase text-foreground/50">{kpi.label}</p>
            <p className="mt-4 text-2xl font-semibold text-foreground">{kpi.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold">Students arriving soon</h3>
          <div className="mt-4 space-y-3 text-sm text-foreground/70">
            {upcoming.length === 0 ? (
              <p>No upcoming arrivals in the next week.</p>
            ) : (
              upcoming.map((student) => (
                <div key={student.id} className="flex justify-between">
                  <span>
                    {student.fullName} — {student.arrivalDate.toDateString()}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                    {student.package.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Reminders</h3>
          <p className="mt-3 text-sm text-foreground/70">
            Review pending first-week tasks and send a weekly reminder if needed.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
