import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-yellow text-brand-black hover:bg-yellow-400 hover:shadow-[0_0_24px_-4px_rgba(253,185,46,0.6)]",
        red: "bg-brand-red text-white hover:brightness-110 hover:shadow-[0_0_24px_-4px_rgba(197,47,51,0.6)]",
        whatsapp:
          "bg-[#25D366] text-white hover:brightness-105 hover:shadow-[0_0_24px_-4px_rgba(37,211,102,0.6)]",
        outline:
          "border border-white/20 text-white hover:border-brand-yellow hover:text-brand-yellow",
        ghost: "text-white hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
