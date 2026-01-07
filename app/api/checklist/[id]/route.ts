import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { checklistUpdateSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = checklistUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.checklistItem.update({
    where: { id },
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      status: parsed.data.status,
      notes: parsed.data.notes,
      completedAt:
        parsed.data.status === "COMPLETED" ? new Date() : parsed.data.status ? null : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "UPDATE",
      entityType: "ChecklistItem",
      entityId: updated.id,
      metaJson: { status: updated.status },
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

  await prisma.checklistItem.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "DELETE",
      entityType: "ChecklistItem",
      entityId: id,
      metaJson: {},
    },
  });

  return NextResponse.json({ ok: true });
}
