"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BlogItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  updatedAt: string;
};

export function BlogManager() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogItem | null>(null);

  const load = async () => {
    const res = await fetch("/api/blogs");
    if (res.ok) {
      setPosts(await res.json());
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      slug: form.get("slug")?.toString() || "",
      title: form.get("title")?.toString() || "",
      excerpt: form.get("excerpt")?.toString() || "",
      body: form.get("body")?.toString() || "",
      published: form.get("published") === "on",
    };
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Create failed" }));
      setStatus(error.error ?? "Create failed");
      return;
    }
    event.currentTarget.reset();
    setStatus("Created");
    await load();
  };

  const onUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      slug: form.get("slug")?.toString() || "",
      title: form.get("title")?.toString() || "",
      excerpt: form.get("excerpt")?.toString() || "",
      body: form.get("body")?.toString() || "",
      published: form.get("published") === "on",
    };
    const res = await fetch(`/api/blogs/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Update failed" }));
      setStatus(error.error ?? "Update failed");
      return;
    }
    setEditing(null);
    setStatus("Updated");
    await load();
  };

  const onDelete = async (id: string) => {
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Delete failed" }));
      setStatus(error.error ?? "Delete failed");
      return;
    }
    setStatus("Deleted");
    await load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold">Create blog post</h2>
        <form className="mt-4 grid gap-4" onSubmit={onCreate}>
          <Input name="slug" placeholder="Slug (e.g. first-week-in-nz)" required />
          <Input name="title" placeholder="Title" required />
          <Textarea name="excerpt" placeholder="Short excerpt" required />
          <Textarea name="body" placeholder="Body (use blank lines for new paragraphs)" required />
          <label className="flex items-center gap-2 text-sm text-foreground/70">
            <input name="published" type="checkbox" defaultChecked className="h-4 w-4" />
            Published
          </label>
          <Button type="submit">Create post</Button>
        </form>
      </Card>

      {editing ? (
        <Card>
          <h2 className="text-lg font-semibold">Edit blog post</h2>
          <form className="mt-4 grid gap-4" onSubmit={onUpdate}>
            <Input name="slug" defaultValue={editing.slug} required />
            <Input name="title" defaultValue={editing.title} required />
            <Textarea name="excerpt" defaultValue={editing.excerpt} required />
            <Textarea name="body" defaultValue={editing.body} required />
            <label className="flex items-center gap-2 text-sm text-foreground/70">
              <input
                name="published"
                type="checkbox"
                defaultChecked={editing.published}
                className="h-4 w-4"
              />
              Published
            </label>
            <div className="flex gap-3">
              <Button type="submit">Save changes</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-lg font-semibold">Blog list</h2>
        <div className="mt-4 space-y-3 text-sm">
          {posts.length === 0 ? (
            <p className="text-foreground/60">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-muted bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{post.title}</div>
                    <div className="text-xs text-foreground/60">{post.slug}</div>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {post.published ? "Published" : "Draft"}
                  </div>
                </div>
                <div className="mt-2 text-xs text-foreground/60">{post.excerpt}</div>
                <div className="mt-3 flex gap-3">
                  <Button type="button" variant="soft" onClick={() => setEditing(post)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => onDelete(post.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {status ? <p className="mt-3 text-xs text-foreground/60">{status}</p> : null}
      </Card>
    </div>
  );
}
