import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-section";
import { Card } from "@/components/ui/card";
import { getPublishedBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Student Guides",
  description:
    "Practical guides for international students settling into life in New Zealand.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <AnimatedSection>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Student Guides
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/70">
        Helpful, grounded advice for international students and their families.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.slug}>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="mt-3 text-sm text-foreground/70">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold">
              Read article →
            </Link>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}
