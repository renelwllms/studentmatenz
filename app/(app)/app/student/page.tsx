import { StudentProgress } from "@/components/student-progress";
import { StudentShell } from "@/components/student-shell";
import { Card } from "@/components/ui/card";

export default function StudentDashboardPage() {
  return (
    <StudentShell title="Welcome back">
      <div className="grid gap-4 md:grid-cols-2">
        <StudentProgress />
        <Card>
          <h2 className="text-lg font-semibold">Your next steps</h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground/70">
            <li>Confirm your arrival details.</li>
            <li>Review the pre-arrival checklist.</li>
            <li>Message StudentMate with any questions.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Latest message</h2>
          <p className="mt-3 text-sm text-foreground/70">
            Hi Priya, your arrival-day checklist is ready. Let us know if you need pickup details.
          </p>
        </Card>
      </div>
    </StudentShell>
  );
}
