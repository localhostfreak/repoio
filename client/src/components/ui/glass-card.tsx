
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "dark";
  hoverEffect?: boolean;
}

export function GlassCard({
  className,
  children,
  variant = "default",
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const variants = {
    default: "bg-background/30 backdrop-blur-lg border border-background/30",
    subtle: "bg-background/20 backdrop-blur-md border border-background/20",
    dark: "bg-background/60 backdrop-blur-xl border border-background/10",
  };

  return (
    <div
      className={cn(
        variants[variant],
        "rounded-lg shadow-md overflow-hidden transition-all duration-300",
        hoverEffect && "hover:shadow-lg hover:border-primary/20 hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
