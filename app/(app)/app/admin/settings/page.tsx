import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <Card>
        <h2 className="text-lg font-semibold">WhatsApp provider</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Configure provider keys via environment variables. Current: Mock provider.
        </p>
        <div className="mt-4 rounded-2xl border border-muted bg-white px-4 py-3 text-sm text-foreground/70">
          WHATSAPP_PROVIDER=mock | twilio | meta
        </div>
      </Card>
    </AppShell>
  );
}
