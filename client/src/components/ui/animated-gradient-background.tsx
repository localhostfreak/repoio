import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export function AnimatedGradientBackground({
  className,
  children,
}: AnimatedGradientBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-background opacity-90 z-0" />
      <div className="absolute inset-0 z-0">
        <div className="absolute -inset-[100px] opacity-50">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3/4 aspect-square rounded-full bg-primary/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/4 right-1/4 -translate-y-1/2 w-1/2 aspect-square rounded-full bg-purple-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-1/2 aspect-square rounded-full bg-pink-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}