import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "yellow" | "red" | "dark";
}

export function Badge({ className, tone = "yellow", ...props }: BadgeProps) {
  const tones = {
    yellow: "bg-brand-yellow text-brand-black",
    red: "bg-brand-red text-white",
    dark: "bg-ink-900/80 text-white border border-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
