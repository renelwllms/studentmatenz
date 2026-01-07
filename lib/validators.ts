import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please add a short message"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const packageSchema = z.object({
  name: z.string().min(2),
  price: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
});

export type PackageInput = z.infer<typeof packageSchema>;

export const templateSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  body: z.string().min(5),
  variables: z.array(z.string()).optional().default([]),
});

export type TemplateInput = z.infer<typeof templateSchema>;

export const checklistItemSchema = z.object({
  studentId: z.string().min(1),
  category: z.enum(["PRE_ARRIVAL", "ARRIVAL_DAY", "FIRST_WEEK", "WORK_READINESS"]),
  title: z.string().min(2),
  notes: z.string().optional(),
});

export type ChecklistItemInput = z.infer<typeof checklistItemSchema>;

export const checklistUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  category: z.enum(["PRE_ARRIVAL", "ARRIVAL_DAY", "FIRST_WEEK", "WORK_READINESS"]).optional(),
  status: z.enum(["PENDING", "COMPLETED"]).optional(),
  notes: z.string().optional(),
});

export type ChecklistUpdateInput = z.infer<typeof checklistUpdateSchema>;

export const blogSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  excerpt: z.string().min(10),
  body: z.string().min(10),
  published: z.boolean().optional().default(true),
});

export type BlogInput = z.infer<typeof blogSchema>;
