import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-section";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Settlement support packages, arrival coordination, and ongoing student care in New Zealand.",
};

const services = [
  {
    title: "Arrival Essentials",
    description:
      "Airport pickup coordination, SIM setup guidance, transport tips, and orientation support.",
  },
  {
    title: "Housing & Local Setup",
    description:
      "Shortlist accommodation options, understand tenancy basics, and get settled in the neighborhood.",
  },
  {
    title: "Study & Work Readiness",
    description:
      "Campus onboarding, study routines, part-time work preparation, and wellbeing check-ins.",
  },
  {
    title: "Parent Updates",
    description:
      "Optional view-only portal link with milestone updates for parents and guardians.",
  },
  {
    title: "First Car Purchase Assistance",
    description: "Guidance on buying your first car and avoiding common pitfalls.",
  },
  {
    title: "NZ Emergency Services Orientation",
    description: "Know who to call and how to access urgent help in New Zealand.",
  },
  {
    title: "Public Transport Orientation",
    description: "Learn routes, cards, and everyday travel tips for your city.",
  },
  {
    title: "Help With Bank Accounts",
    description: "Support opening accounts, understanding fees, and setting up cards.",
  },
  {
    title: "Assistance With CV Formatting (NZ Style)",
    description: "Polish your resume to match New Zealand expectations.",
  },
  {
    title: "Assistance With Part-Time Job Guidance",
    description: "Plan your search, applications, and interview preparation.",
  },
  {
    title: "Assistance With NZ Work Culture Orientation",
    description: "Understand workplace norms, communication, and expectations.",
  },
];

export default function ServicesPage() {
  return (
    <AnimatedSection>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Services built for smooth arrivals
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/70">
        Every service is designed to remove friction and help students feel confident from day one.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.title}>
            <CardTitle>{service.title}</CardTitle>
            <CardDescription className="mt-3">{service.description}</CardDescription>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
