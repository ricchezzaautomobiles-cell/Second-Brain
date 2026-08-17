import React from 'react';
import { Profile, ActiveTab } from '../../types';
import { AppUser } from '../../hooks/useAuth';
import { motion } from 'motion/react';

interface HeaderProps {
  user: AppUser | null;
  profile: Profile | null;
  isConfigured: boolean;
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  profile,
  isConfigured,
  activeTab,
  onNavigate,
  onOpenAuth,
}) => {
  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'write', label: 'WRITE' },
    { id: 'discover', label: 'DISCOVER' },
    { id: 'capsules', label: 'CAPSULES' },
    { id: 'about', label: 'ABOUT' },
    { id: 'privacy', label: 'PRIVACY' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Minimal Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="group text-left focus:outline-none flex items-center gap-3"
        >
          <img
            src="/favicon.png"
            alt="UNSENT"
            className="h-8 w-8 object-contain rounded-md filter brightness-110 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-[0.35em] text-white font-mono block group-hover:text-zinc-200 transition-colors leading-none">
              UNSENT
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.25em] block font-mono font-medium mt-1">
              UNSPOKEN VAULT
            </span>
          </div>
        </a>

        {/* Minimal Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`
                  relative text-xs tracking-[0.25em] font-mono transition-colors py-2 focus:outline-none
                  ${isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}
                `}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="header-active-line"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account State */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white transition-colors group focus:outline-none"
            >
              <div className="h-7 w-7 rounded-full bg-zinc-900 border border-zinc-700 group-hover:border-white flex items-center justify-center text-white text-[10px] font-mono font-bold transition-colors shrink-0">
                {profile?.display_name?.[0]?.toUpperCase() || user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                {profile?.display_name || user.displayName || user.email?.split('@')[0] || 'Guest'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-mono tracking-[0.2em] uppercase text-white hover:text-zinc-300 transition-colors relative py-1 group"
            >
              <span>SIGN IN</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-600 group-hover:bg-white transition-colors" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
