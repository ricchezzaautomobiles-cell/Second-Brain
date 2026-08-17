import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  spatial3d?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = false,
  spatial3d = true,
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values relative to card (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 25,
  });

  // Light glare reflection coordinates
  const lightX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const lightY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spatial3d) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: spatial3d ? rotateX : 0,
        rotateY: spatial3d ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={
        hoverEffect
          ? {
              y: -4,
              scale: 1.01,
              transition: { type: 'spring', stiffness: 400, damping: 25 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`
        relative rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl
        shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-colors duration-300 overflow-hidden
        ${glow ? 'shadow-[0_0_25px_rgba(255,255,255,0.14)] border-white/30' : ''}
        ${hoverEffect ? 'hover:border-white/30 hover:bg-white/[0.07] cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Top ambient glass light rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Dynamic Specular Reflection Flare on mouse hover */}
      {spatial3d && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${lightX.get()} ${lightY.get()}, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
