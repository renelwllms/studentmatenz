import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validators";

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
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let updated;
  try {
    updated = await prisma.blogPost.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        body: parsed.data.body,
        published: parsed.data.published,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "UPDATE",
      entityType: "BlogPost",
      entityId: updated.id,
      metaJson: { slug: updated.slug },
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

  await prisma.blogPost.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "DELETE",
      entityType: "BlogPost",
      entityId: id,
      metaJson: {},
    },
  });

  return NextResponse.json({ ok: true });
}
