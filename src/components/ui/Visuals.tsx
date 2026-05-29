import React from "react";
import { cn } from "../../lib/utils";

export function GlowingOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-[120px] opacity-20 animate-pulse",
        className
      )}
    />
  );
}

export function GlassPanel({ 
  children, 
  className,
  intensity = "md" 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: "sm" | "md" | "lg";
}) {
  const blurs = {
    sm: "backdrop-blur-md",
    md: "backdrop-blur-xl",
    lg: "backdrop-blur-3xl",
  };

  return (
    <div className={cn(
      "bg-[var(--glass-layer)] border border-[var(--glass-border)] rounded-3xl",
      blurs[intensity],
      className
    )}>
      {children}
    </div>
  );
}
