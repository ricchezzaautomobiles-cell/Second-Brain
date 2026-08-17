import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactionType } from '../../types';

interface ReactionButtonProps {
  type: ReactionType;
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  label,
  count,
  isActive,
  onClick,
  size = 'sm',
}) => {
  const [isPopping, setIsPopping] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 600);
    onClick();
  };

  const isSmall = size === 'sm';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        scale: isPopping ? 1.06 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
        mass: 0.6,
      }}
      className={`
        relative overflow-hidden font-mono uppercase tracking-wider transition-colors border select-none focus:outline-none flex items-center gap-1.5
        ${isSmall ? 'text-[11px] px-3 py-1.5' : 'text-xs px-4 py-2'}
        ${
          isActive
            ? 'bg-white text-black border-white font-bold shadow-md shadow-white/10'
            : 'bg-transparent text-zinc-400 border-zinc-800/90 hover:border-zinc-500 hover:text-white'
        }
      `}
    >
      {/* Spring Pop Icon */}
      <motion.span
        key={isActive ? 'active-icon' : 'inactive-icon'}
        initial={{ scale: 0.85 }}
        animate={{
          scale: isActive ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 12,
        }}
        className={`inline-block transition-transform ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'}`}
      >
        {isActive ? '♥' : '♡'}
      </motion.span>

      <span>{label}</span>

      {/* Animated Count Badge */}
      <span className="opacity-80 font-mono">
        (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={count}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 20,
            }}
            className="inline-block"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        )
      </span>

      {/* Subtle background pop ring on active burst */}
      {isActive && isPopping && (
        <motion.span
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute inset-0 bg-white pointer-events-none rounded-none"
        />
      )}
    </motion.button>
  );
};
