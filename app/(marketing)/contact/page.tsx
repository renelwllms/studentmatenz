import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { ContactForm } from "@/components/contact-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to StudentMate about onboarding international students and managing arrivals.",
};

export default function ContactPage() {
  return (
    <AnimatedSection>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Let's plan the student journey
          </h1>
          <p className="mt-4 max-w-xl text-lg text-foreground/70">
            Share a few details and we will map the right package, timeline, and onboarding flow.
          </p>
          <Card className="mt-8">
            <ContactForm />
          </Card>
        </div>
        <Card>
          <h3 className="text-xl font-semibold">Contact details</h3>
          <p className="mt-3 text-sm text-foreground/70">WhatsApp: +64 21 841 446</p>
          <p className="mt-2 text-sm text-foreground/70">Email: studentmate@edgepoint.co.nz</p>
          <div className="mt-6 rounded-2xl border border-muted bg-white px-4 py-3 text-sm text-foreground/70">
            We respond within 24 hours on business days.
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}
