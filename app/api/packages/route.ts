import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { pricingPackages } from "@/data/pricing-packages";

export async function GET(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const names = pricingPackages.map((pkg) => pkg.name);
  const packages = await prisma.package.findMany({
    where: { name: { in: names } },
    orderBy: { createdAt: "asc" },
  });
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]));
  const missing = pricingPackages.filter((pkg) => !byName.has(pkg.name));

  if (missing.length > 0) {
    const created = await prisma.$transaction(
      missing.map((pkg) =>
        prisma.package.create({
          data: {
            name: pkg.name,
            price: pkg.price,
            featuresJson: pkg.features,
          },
        })
      )
    );
    created.forEach((pkg) => byName.set(pkg.name, pkg));
  }

  const ordered = pricingPackages
    .map((pkg) => byName.get(pkg.name))
    .filter((pkg): pkg is NonNullable<typeof pkg> => Boolean(pkg));
  return NextResponse.json(ordered);
}

export async function POST(request: Request) {
  return NextResponse.json(
    { error: "Package creation is disabled." },
    { status: 405 }
  );
}
