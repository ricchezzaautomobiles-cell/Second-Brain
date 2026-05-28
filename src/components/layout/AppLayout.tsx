import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const publicRoutes = [
    "/",
    "/about",
    "/features",
    "/ai",
    "/think-clearly",
    "/focus",
    "/mental-clarity",
    "/blog",
    "/privacy",
    "/terms",
    "/contact"
  ];

  const isPublicPage = publicRoutes.includes(location.pathname) || location.pathname.startsWith("/blog/");
  const isAuthPage = location.pathname === "/auth";

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

  if (isPublicPage) {
    return (
      <div className="flex flex-col min-h-screen bg-[#050505] text-[#f5f5f7]">
        <PublicHeader />
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 pt-20"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <PublicFooter />
      </div>
    );
  }

  // Dashboard / private sections with standard Sidebar layout
  return (
    <div className="flex min-h-screen bg-[var(--bg-system)]">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 p-8 pb-24 overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
