import React, { useState } from "react";
import { motion } from "motion/react";
import { Brain, Lock, Mail, Loader2, ArrowRight, Activity } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { Button } from "../components/ui/Base";
import { GlowingOrb, GlassPanel } from "../components/ui/Visuals";
import { AlertCircle } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterPreviewMode = () => {
    localStorage.setItem("beyond_preview_mode", "true");
    window.location.reload();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Secrets.");
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
            }
          }
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#050505]">
      <GlowingOrb className="top-0 right-0 w-[500px] h-[500px] bg-blue-600/20" />
      <GlowingOrb className="bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-2xl ring-1 ring-black/5">
            <Brain className="text-black" size={32} />
          </div>
          <h1 className="text-3xl font-medium tracking-tight mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/40 font-light">Enter your credentials to continue</p>
        </div>

        <GlassPanel className="p-8 shadow-2xl">
          {!isSupabaseConfigured ? (
            <div className="space-y-8 py-4">
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto text-blue-400">
                  <Activity size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Database Offline</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Cloud sync is not configured. Use <strong>Preview Mode</strong> to start thinking now. Data will be saved to your device.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white border-none py-4"
                  onClick={enterPreviewMode}
                >
                  Enter Preview Mode
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-white/20 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">External Deployment detected</p>
                    <p className="text-[10px] text-white/30 leading-relaxed italic">
                      If you are on Vercel or Netlify, you must add VITE_SUPABASE_URL to your Project Environment Variables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm px-1 text-center">{error}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 rounded-xl"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <div className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Sign Up"}
                    <ArrowRight size={18} />
                  </div>
                )}
              </Button>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
                >
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          )}
        </GlassPanel>
      </motion.div>
    </div>
  );
}
