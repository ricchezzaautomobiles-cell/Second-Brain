import React from 'react';
import { Home, PenTool, Compass, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'write', label: 'Write', icon: <PenTool className="h-4 w-4" /> },
    { id: 'discover', label: 'Feed', icon: <Compass className="h-4 w-4" /> },
    { id: 'capsules', label: 'Vault', icon: <Clock className="h-4 w-4" /> },
    { id: 'profile', label: 'Me', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 inset-x-0 z-40 px-6 pointer-events-none">
      <div className="max-w-xs mx-auto pointer-events-auto">
        <div className="bg-black/90 border border-white/20 rounded-full px-4 py-2 backdrop-blur-xl flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  relative flex flex-col items-center justify-center p-1.5 transition-colors
                  ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                {item.icon}
                <span className="text-[9px] tracking-tight mt-0.5 font-mono">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-white"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
