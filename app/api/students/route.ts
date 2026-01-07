import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { checklistDefaults } from "@/lib/checklist-defaults";
import { prisma } from "@/lib/prisma";
import { pricingPackages } from "@/data/pricing-packages";

function generatePortalCode() {
  const code = Math.floor(1000 + Math.random() * 9000);
  return `SM-${code}`;
}

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    fullName,
    phone,
    email,
    country,
    city,
    arrivalDate,
    institution,
    packageName,
  } = body;

  if (!fullName || !phone || !country || !city || !arrivalDate || !institution || !packageName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let pkg = await prisma.package.findUnique({ where: { name: packageName } });
  if (!pkg) {
    const fallback = pricingPackages.find((item) => item.name === packageName);
    if (fallback) {
      try {
        pkg = await prisma.package.create({
          data: {
            name: fallback.name,
            price: fallback.price,
            featuresJson: fallback.features,
          },
        });
      } catch {
        pkg = await prisma.package.findUnique({ where: { name: packageName } });
      }
    }
  }

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const portalCode = generatePortalCode();
  const user = await prisma.user.create({
    data: {
      role: "STUDENT",
      phone,
      email,
      codeHash: portalCode,
    },
  });

  const profile = await prisma.studentProfile.create({
    data: {
      userId: user.id,
      fullName,
      country,
      city,
      arrivalDate: new Date(arrivalDate),
      institution,
      packageId: pkg.id,
      portalCode,
    },
  });

  await prisma.checklistItem.createMany({
    data: checklistDefaults.map((item) => ({
      studentId: profile.id,
      category: item.category,
      title: item.title,
    })),
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "CREATE",
      entityType: "StudentProfile",
      entityId: profile.id,
      metaJson: { fullName, packageName },
    },
  });

  return NextResponse.json({ ok: true, portalCode });
}
