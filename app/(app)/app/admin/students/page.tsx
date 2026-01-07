import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { StudentCreateForm } from "@/components/student-create-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await prisma.studentProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { package: true },
  });

  return (
    <AppShell title="Students">
      <Card>
        <h2 className="text-lg font-semibold">Create student</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Add a student, generate a portal code, and begin onboarding.
        </p>
        <div className="mt-4">
          <StudentCreateForm />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Student list</h2>
        <div className="mt-4 space-y-3 text-sm">
          {students.length === 0 ? (
            <p className="text-foreground/60">No students yet.</p>
          ) : (
            students.map((student) => (
              <Link
                key={student.id}
                href={`/app/admin/students/${student.id}`}
                className="flex items-center justify-between rounded-2xl border border-muted bg-white px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-foreground">{student.fullName}</div>
                  <div className="text-xs text-foreground/60">
                    {student.city} · Portal: {student.portalCode}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-foreground/70">
                  {student.package?.name ?? "Unassigned"}
                </span>
              </Link>
            ))
          )}
        </div>
      </Card>
    </AppShell>
  );
}
