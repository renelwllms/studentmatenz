import { prisma } from "@/lib/prisma";
import { blogPosts } from "@/data/blog";

type BlogFallback = (typeof blogPosts)[number];

export type BlogPostRecord = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

function mapFallback(post: BlogFallback): BlogPostRecord {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    published: true,
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    if (posts.length > 0) {
      return posts;
    }
  } catch {
    // Fallback to static posts until the blog table exists.
  }
  return blogPosts.map(mapFallback);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
    });
    if (post) {
      return post;
    }
  } catch {
    // Fallback to static posts until the blog table exists.
  }
  const fallback = blogPosts.find((item) => item.slug === slug);
  return fallback ? mapFallback(fallback) : null;
}
