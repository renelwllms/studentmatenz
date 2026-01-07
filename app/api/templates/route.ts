import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { templateSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await prisma.messageTemplate.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await prisma.messageTemplate.create({
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
      action: "CREATE",
      entityType: "MessageTemplate",
      entityId: created.id,
      metaJson: { key: created.key },
    },
  });

  return NextResponse.json(created, { status: 201 });
}
