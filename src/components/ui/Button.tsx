import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'emotional';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.25)] border border-white hover:bg-zinc-100',
    secondary: 'bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-lg hover:bg-white/15',
    outline: 'bg-transparent border border-white/25 text-zinc-100 hover:border-white hover:bg-white/10',
    emotional: 'bg-zinc-100 text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/80 hover:bg-white',
    danger: 'bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-md hover:bg-zinc-800',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.96 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </motion.button>
  );
};
