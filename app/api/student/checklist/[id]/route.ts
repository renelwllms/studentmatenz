import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = await prisma.checklistItem.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: token.sub ?? "" },
  });
  if (!profile || item.studentId !== profile.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await prisma.checklistItem.update({
    where: { id: item.id },
    data: {
      status: parsed.data.status,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
      updatedByUserId: token.sub ?? null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "STUDENT_CHECKLIST_UPDATE",
      entityType: "ChecklistItem",
      entityId: updated.id,
      metaJson: { status: updated.status },
    },
  });

  return NextResponse.json(updated);
}
