import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: { checklist: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ checklist: student.checklist });
}

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

  const pkg = await prisma.package.findUnique({ where: { name: packageName } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: student.userId },
      data: {
        phone,
        email: email || null,
      },
    }),
    prisma.studentProfile.update({
      where: { id },
      data: {
        fullName,
        country,
        city,
        arrivalDate: new Date(arrivalDate),
        institution,
        packageId: pkg.id,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: token.sub ?? null,
        action: "UPDATE",
        entityType: "StudentProfile",
        entityId: id,
        metaJson: { fullName, packageName },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
