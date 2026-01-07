import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validators";
import { pricingPackages } from "@/data/pricing-packages";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.package.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const allowedNames = new Set(pricingPackages.map((pkg) => pkg.name));
  if (!allowedNames.has(existing.name)) {
    return NextResponse.json({ error: "Package editing is restricted" }, { status: 400 });
  }

  if (parsed.data.name !== existing.name) {
    return NextResponse.json({ error: "Package name is fixed" }, { status: 400 });
  }

  const updated = await prisma.package.update({
    where: { id },
    data: {
      name: existing.name,
      price: parsed.data.price,
      featuresJson: parsed.data.features,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "UPDATE",
      entityType: "Package",
      entityId: updated.id,
      metaJson: { name: updated.name },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { error: "Package deletion is disabled." },
    { status: 405 }
  );
}
