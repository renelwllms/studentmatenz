import { AppShell } from "@/components/app-shell";
import { TemplateManager } from "@/components/template-manager";

export default function TemplatesPage() {
  return (
    <AppShell title="WhatsApp Templates">
      <TemplateManager />
    </AppShell>
  );
}
