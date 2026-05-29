import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Brain } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/auth";

  if (isAuthPage) {
    return (
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="min-h-screen bg-[var(--bg-system)]"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-system)]">
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg-system)]/95 border-b border-[var(--glass-border)] z-50 flex items-center px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shadow-sm ring-1 ring-black/5">
            <Brain size={18} />
          </div>
          <span className="font-semibold text-base tracking-tight text-[var(--text-main)]">Beyond</span>
        </div>
      </header>

      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-24 overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
