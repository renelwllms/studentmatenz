import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants = {
  solid: "bg-accent-strong text-white shadow-[0_12px_40px_rgba(47,111,229,0.35)] hover:bg-accent",
  ghost: "border-muted text-foreground/80 hover:border-accent hover:text-foreground",
  soft: "bg-white text-foreground shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)]",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
