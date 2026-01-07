import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { pricingPackages } from "@/data/pricing-packages";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flexible service packages for international students and their families.",
};

const fallbackByName = Object.fromEntries(
  pricingPackages.map((pkg) => [pkg.name, pkg])
);

function normalizeFeatures(value: unknown): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value as string[];
  }
  return [];
}

export default async function PricingPage() {
  const names = pricingPackages.map((pkg) => pkg.name);
  const dbPackages = await prisma.package.findMany({
    where: { name: { in: names } },
    orderBy: { createdAt: "asc" },
  });
  const dbByName = Object.fromEntries(dbPackages.map((pkg) => [pkg.name, pkg]));
  const packages = pricingPackages.map((fallback) => {
    const db = dbByName[fallback.name];
    const features = db ? normalizeFeatures(db.featuresJson) : [];
    return {
      name: fallback.name,
      price: db?.price ?? fallback.price,
      description: fallback.description,
      features: features.length > 0 ? features : fallback.features,
      addOn: fallback.addOn ?? null,
      featured: fallback.featured,
    };
  });

  return (
    <AnimatedSection>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Pricing that stays flexible
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/70">
        Choose a service level that fits the student journey. Upgrade anytime.
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.name}
            className={pkg.featured ? "border-accent shadow-[0_30px_80px_rgba(47,111,229,0.2)]" : ""}
          >
            {pkg.featured ? <Badge className="bg-white">Most Popular</Badge> : null}
            <h3 className="mt-4 text-2xl font-semibold text-foreground">{pkg.name}</h3>
            <div className="mt-2 text-3xl font-semibold text-foreground">{pkg.price}</div>
            <p className="mt-3 text-sm text-foreground/70">{pkg.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-foreground/70">
              {pkg.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            {pkg.addOn ? (
              <p className="mt-3 text-xs italic text-foreground/60">{pkg.addOn}</p>
            ) : null}
            <Link href="/contact" className="mt-6 inline-flex">
              <Button variant={pkg.featured ? "solid" : "soft"}>Get Started</Button>
            </Link>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
