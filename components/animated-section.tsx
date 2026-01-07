"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedSection({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      className={cn("mx-auto w-full max-w-6xl px-6 py-16", className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}
