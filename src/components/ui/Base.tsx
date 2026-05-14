import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isGlass?: boolean;
  isHoverable?: boolean;
}

export function Card({ children, className, isGlass = true, isHoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2rem] overflow-hidden border border-white/10 transition-all duration-500",
        isGlass && "glass-morphism",
        isHoverable && "hover:bg-white/[0.04] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_4px_24px_rgba(255,255,255,0.15)] active:scale-[0.98] btn-shine-effect",
    secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 active:scale-[0.98] btn-shine-effect",
    ghost: "bg-transparent text-white/50 hover:text-white hover:bg-white/5 active:scale-[0.98]",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-7 py-3.5 text-sm",
    lg: "px-10 py-5 text-base",
  };

  return (
    <button
      className={cn(
        "rounded-2xl font-medium transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-tight",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
