import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validators";

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
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.messageTemplate.update({
    where: { id },
    data: {
      key: parsed.data.key,
      title: parsed.data.title,
      body: parsed.data.body,
      variablesJson: parsed.data.variables,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "UPDATE",
      entityType: "MessageTemplate",
      entityId: updated.id,
      metaJson: { key: updated.key },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.messageTemplate.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "DELETE",
      entityType: "MessageTemplate",
      entityId: id,
      metaJson: {},
    },
  });

  return NextResponse.json({ ok: true });
}
