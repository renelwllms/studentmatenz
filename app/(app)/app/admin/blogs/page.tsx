import { AppShell } from "@/components/app-shell";
import { BlogManager } from "@/components/blog-manager";

export default function BlogsPage() {
  return (
    <AppShell title="Blogs">
      <BlogManager />
    </AppShell>
  );
}
