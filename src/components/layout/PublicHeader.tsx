import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Base";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { User } from "@supabase/supabase-js";

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Sync auth status
    const storedPreview = localStorage.getItem("beyond_preview_mode");
    if (!isSupabaseConfigured || storedPreview === "true") {
      if (storedPreview === "true") {
        setUser({ id: "guest", email: "guest@beyond.ai" } as any);
      }
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) setUser(session.user);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "AI", path: "/ai" },
    { label: "Think Clearly", path: "/think-clearly" },
    { label: "Focus", path: "/focus" },
    { label: "Clarity", path: "/mental-clarity" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform duration-300">
            <Brain className="text-black" size={20} />
          </div>
          <span className="text-xl font-semibold tracking-tighter text-white group-hover:text-white/80 transition-colors">
            Beyond
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-white/[0.02] border border-white/5 rounded-full px-2 py-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isActive
                    ? "text-black bg-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            {user ? "Console" : "Login"}
          </Link>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant="primary" size="sm" className="rounded-xl group gap-1.5">
              {user ? "Enter App" : "Initialize"}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-white/60 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drop-down */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-white/5 bg-[#050505] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm uppercase tracking-widest font-medium py-2 border-b border-white/[0.02] ${
                    location.pathname === link.path ? "text-white font-semibold" : "text-white/40 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 mt-2">
                <Link
                  to={user ? "/dashboard" : "/auth"}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white"
                >
                  {user ? "My Console" : "Sign In"}
                </Link>
                <Link to={user ? "/dashboard" : "/auth"} onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" className="rounded-xl">
                    {user ? "Enter System" : "Initialize"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
