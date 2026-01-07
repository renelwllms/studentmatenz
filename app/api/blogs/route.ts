import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validators";
import { blogPosts } from "@/data/blog";

export async function GET(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  if (posts.length === 0 && blogPosts.length > 0) {
    await prisma.blogPost.createMany({
      data: blogPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        published: true,
      })),
      skipDuplicates: true,
    });
    const seeded = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(seeded);
  }
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  let created;
  try {
    created = await prisma.blogPost.create({
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
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: token.sub ?? null,
      action: "CREATE",
      entityType: "BlogPost",
      entityId: created.id,
      metaJson: { slug: created.slug },
    },
  });

  return NextResponse.json(created, { status: 201 });
}
