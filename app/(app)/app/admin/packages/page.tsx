import { AppShell } from "@/components/app-shell";
import { PackageManager } from "@/components/package-manager";

export default function PackagesPage() {
  return (
    <AppShell title="Packages">
      <PackageManager />
    </AppShell>
  );
}
