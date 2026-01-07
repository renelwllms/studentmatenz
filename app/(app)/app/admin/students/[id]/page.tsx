import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChecklistManager } from "@/components/checklist-manager";
import { SendMessageForm } from "@/components/send-message-form";
import { StudentEditForm } from "@/components/student-edit-form";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { pricingPackages } from "@/data/pricing-packages";
import { prisma } from "@/lib/prisma";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: { package: true, user: true },
  });

  if (!student) return notFound();

  const [checklistItems, templates, messageLogs, packages] = await Promise.all([
    prisma.checklistItem.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.messageTemplate.findMany({
      orderBy: { createdAt: "asc" },
      select: { key: true, title: true },
    }),
    prisma.messageLog.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.package.findMany({
      where: { name: { in: pricingPackages.map((pkg) => pkg.name) } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const checklistData = checklistItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    status: item.status,
    notes: item.notes,
  }));

  const completedCount = checklistItems.filter((item) => item.status === "COMPLETED").length;
  const totalCount = checklistItems.length;
  const percentComplete = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const categoryProgress = checklistItems.reduce<
    Record<string, { total: number; completed: number }>
  >((acc, item) => {
    const key = item.category.replaceAll("_", " ");
    if (!acc[key]) acc[key] = { total: 0, completed: 0 };
    acc[key].total += 1;
    if (item.status === "COMPLETED") acc[key].completed += 1;
    return acc;
  }, {});

  return (
    <AppShell title="Student profile">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="mt-4 space-y-2 text-sm text-foreground/70">
            <div>Name: {student.fullName}</div>
            <div>Arrival: {student.arrivalDate.toDateString()}</div>
            <div>City: {student.city}</div>
            <div>Institution: {student.institution}</div>
            <div>Package: {student.package?.name ?? "Unassigned"}</div>
            <div>Portal code: {student.portalCode}</div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Edit student</h3>
            <div className="mt-3">
              <StudentEditForm
                studentId={student.id}
                packages={packages}
                initial={{
                  fullName: student.fullName,
                  phone: student.user.phone ?? null,
                  email: student.user.email ?? null,
                  country: student.country,
                  city: student.city,
                  arrivalDate: student.arrivalDate.toISOString().slice(0, 10),
                  institution: student.institution,
                  packageName: student.package?.name ?? null,
                }}
              />
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Messaging</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Send a WhatsApp update using a saved template.
          </p>
          <div className="mt-4">
            <SendMessageForm studentId={student.id} templates={templates} />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Checklist</h2>
            <p className="text-sm text-foreground/70">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <Progress value={percentComplete} />
            <div className="mt-2 text-xs text-foreground/60">{percentComplete}% complete</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Object.entries(categoryProgress).map(([category, counts]) => {
            const pct =
              counts.total === 0 ? 0 : Math.round((counts.completed / counts.total) * 100);
            return (
              <div key={category} className="rounded-2xl border border-muted bg-white px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{category}</span>
                  <span className="text-foreground/60">
                    {counts.completed}/{counts.total}
                  </span>
                </div>
                <div className="mt-3">
                  <Progress value={pct} />
                  <div className="mt-2 text-xs text-foreground/60">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <ChecklistManager studentId={student.id} initialItems={checklistData} />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Recent messages</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70">
          {messageLogs.length === 0 ? (
            <p>No messages sent yet.</p>
          ) : (
            messageLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-muted bg-white px-4 py-3">
                <div className="text-xs uppercase text-foreground/50">
                  {log.status} · {log.createdAt.toDateString()}
                </div>
                <div className="mt-2 text-sm">{log.bodyRendered}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </AppShell>
  );
}
