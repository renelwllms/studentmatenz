import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { checklistItemSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = checklistItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await prisma.checklistItem.create({
    data: {
      studentId: parsed.data.studentId,
      category: parsed.data.category,
      title: parsed.data.title,
      notes: parsed.data.notes,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "CREATE",
      entityType: "ChecklistItem",
      entityId: created.id,
      metaJson: { title: created.title },
    },
  });

  return NextResponse.json(created, { status: 201 });
}
