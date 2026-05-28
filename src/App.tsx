import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "./lib/supabase";
import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NewDecision from "./pages/NewDecision";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import DecisionDetails from "./pages/DecisionDetails";

// Import newly designed indexable public pages
import About from "./pages/About";
import Features from "./pages/Features";
import AI from "./pages/AI";
import ThinkClearly from "./pages/ThinkClearly";
import Focus from "./pages/Focus";
import MentalClarity from "./pages/MentalClarity";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

import { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./lib/supabase";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("beyond_theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    // Check local storage for preview mode
    const storedPreview = localStorage.getItem("beyond_preview_mode");
    if (!isSupabaseConfigured || storedPreview === "true") {
      if (storedPreview === "true") {
        setIsPreviewMode(true);
        setUser({ id: "guest", email: "guest@beyond.ai" } as any);
      }
      
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error("Auth error:", err);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050505] gap-8">
        <div className="relative">
          <div className="w-16 h-16 border-b-2 border-white rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-white/5 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-[0.3em] font-medium text-white/40 animate-pulse">Initializing System</p>
          <div className="w-32 h-[1px] bg-white/10 overflow-hidden rounded-full">
            <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: "100%" }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="w-full h-full bg-white/60"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Indexable SEO Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/think-clearly" element={<ThinkClearly />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/mental-clarity" element={<MentalClarity />} />
          
          {/* Multi-route Blog Chronicles System */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          
          {/* Contact and Agreement Outlets */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Authenticated Decision Console Routing */}
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/new-decision" 
            element={user ? <NewDecision user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/history" 
            element={user ? <History user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/insights" 
            element={user ? <Insights user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/settings" 
            element={user ? <Settings user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/decision/:id" 
            element={user ? <DecisionDetails user={user} /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </AppLayout>
    </Router>
  );
}
