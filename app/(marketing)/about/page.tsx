import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudentMate NZ is a specialist support team helping international students settle with confidence.",
};

export default function AboutPage() {
  return (
    <AnimatedSection>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        We combine local expertise with modern care
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/70">
        StudentMate is built by people who understand the international student journey. We bridge cultural gaps,
        reduce admin workload, and keep families reassured with clear updates.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold">Our promise</h3>
          <p className="mt-3 text-sm text-foreground/70">
            Practical, clear support. No jargon, no confusion. We guide students through the essentials and always
            advocate for wellbeing.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold">Local by design</h3>
          <p className="mt-3 text-sm text-foreground/70">
            Based in New Zealand with a network of trusted partners for housing, transport, and campus services.
          </p>
        </Card>
      </div>
    </AnimatedSection>
  );
}
