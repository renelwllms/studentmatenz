import { StudentChecklistManager } from "@/components/student-checklist-manager";
import { StudentShell } from "@/components/student-shell";

export default function StudentChecklistPage() {
  return (
    <StudentShell title="Checklist">
      <StudentChecklistManager />
    </StudentShell>
  );
}
