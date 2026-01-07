import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getPublishedBlogPosts } from "@/lib/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const routes = [
    "",
    "/services",
    "/pricing",
    "/about",
    "/blog",
    "/contact",
  ];

  const posts = await getPublishedBlogPosts();

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? new Date(),
    })),
  ];
}
