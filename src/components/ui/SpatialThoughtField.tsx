import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const THOUGHT_FRAGMENTS = [
  { text: "I should have said goodbye.", layer: 1, top: '15%', left: '10%' },
  { text: "I miss you.", layer: 3, top: '22%', left: '72%' },
  { text: "Maybe tomorrow.", layer: 2, top: '35%', left: '80%' },
  { text: "Don't send this.", layer: 1, top: '65%', left: '8%' },
  { text: "I never told you.", layer: 3, top: '78%', left: '18%' },
  { text: "Are you okay?", layer: 2, top: '12%', left: '48%' },
  { text: "One more message.", layer: 1, top: '85%', left: '75%' },
  { text: "I forgive you.", layer: 2, top: '55%', left: '85%' },
  { text: "Come back.", layer: 3, top: '68%', left: '60%' },
  { text: "Forget me.", layer: 1, top: '42%', left: '5%' },
  { text: "I still think of that night.", layer: 2, top: '28%', left: '18%' },
  { text: "You'll never read this.", layer: 3, top: '88%', left: '40%' },
];

export const SpatialThoughtField: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax offsets for the 3 depth layers
  const l1X = useTransform(smoothX, [-1, 1], [-8, 8]);
  const l1Y = useTransform(smoothY, [-1, 1], [-8, 8]);

  const l2X = useTransform(smoothX, [-1, 1], [-20, 20]);
  const l2Y = useTransform(smoothY, [-1, 1], [-20, 20]);

  const l3X = useTransform(smoothX, [-1, 1], [-45, 45]);
  const l3Y = useTransform(smoothY, [-1, 1], [-45, 45]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const getLayerStyle = (layer: number) => {
    switch (layer) {
      case 1:
        // Background layer: opacity 0.04–0.08, blur 3–8px
        return {
          opacity: 0.06,
          filter: 'blur(5px)',
          scale: 0.85,
          fontWeight: 300,
        };
      case 2:
        // Midground layer: opacity 0.08–0.16, blur 0–3px
        return {
          opacity: 0.12,
          filter: 'blur(1.5px)',
          scale: 1,
          fontWeight: 400,
        };
      case 3:
      default:
        // Foreground layer: opacity 0.18–0.30, sharp
        return {
          opacity: 0.24,
          filter: 'none',
          scale: 1.15,
          fontWeight: 500,
        };
    }
  };

  const getLayerMotion = (layer: number) => {
    switch (layer) {
      case 1:
        return { x: l1X, y: l1Y };
      case 2:
        return { x: l2X, y: l2Y };
      case 3:
      default:
        return { x: l3X, y: l3Y };
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {THOUGHT_FRAGMENTS.map((frag, idx) => {
        const layerStyle = getLayerStyle(frag.layer);
        const motionVal = getLayerMotion(frag.layer);

        return (
          <motion.div
            key={idx}
            style={{
              position: 'absolute',
              top: frag.top,
              left: frag.left,
              x: motionVal.x,
              y: motionVal.y,
              opacity: layerStyle.opacity,
              filter: layerStyle.filter,
              scale: layerStyle.scale,
              fontWeight: layerStyle.fontWeight,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8 + (idx % 5) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.4,
            }}
            className="text-white font-serif tracking-wide text-xs sm:text-sm md:text-base whitespace-nowrap"
          >
            “{frag.text}”
          </motion.div>
        );
      })}
    </div>
  );
};
