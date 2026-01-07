import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import { getBlogPostBySlug } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return notFound();
  const paragraphs = post.body
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <AnimatedSection>
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-foreground/70">{post.excerpt}</p>
        <div className="mt-10 space-y-4 text-sm text-foreground/70">
          {paragraphs.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </AnimatedSection>
  );
}
