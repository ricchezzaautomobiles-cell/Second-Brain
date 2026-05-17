import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { Brain, Sparkles, TrendingUp, Target, Clock, MessageSquare, ChevronRight, Zap, Crown, AlertTriangle } from "lucide-react";
import { Card, Button } from "../components/ui/Base";
import { supabase } from "../lib/supabase";
import { Decision } from "../types";
import { formatDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { usePlanUsage } from "../hooks/usePlanUsage";
import { storage } from "../lib/storage";

export default function Dashboard({ user }: { user: User }) {
  const { plan, decisionsToday, limit, remaining, isOverLimit } = usePlanUsage(user);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      window.location.href = `/new-decision?title=${encodeURIComponent(q)}`;
      return;
    }

    async function fetchDecisions() {
      if (user.id === "guest") {
        setDecisions(storage.getDecisions().slice(0, 3));
        setLoading(false);
        return;
      }

      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (!error && data) {
        setDecisions(data);
      }
      setLoading(false);
    }

    fetchDecisions();
  }, []);

  const stats = [
    { label: "Decisions Analyzed", value: decisions.length || 0, icon: Target, color: "text-blue-500" },
    { label: "Average Clarity", value: "72%", icon: Zap, color: "text-yellow-500" },
    { label: "Confidence Trend", value: "+12%", icon: TrendingUp, color: "text-green-500" },
    { label: "Pending Actions", value: 4, icon: Clock, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-12 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-medium tracking-tight">
          System Active, <span className="text-white/40">{user.email?.split('@')[0]}</span>
        </h1>
        <p className="text-white/40 font-light italic">"Better inputs lead to better outcomes."</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-light">{stat.value}</span>
              <p className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Decisions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-medium">Recent Architecture</h2>
            <Link to="/history" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
              ))
            ) : decisions.length > 0 ? (
              decisions.map((decision) => (
                <Link key={decision.id} to={`/decision/${decision.id}`}>
                  <Card isHoverable className="p-6 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/5 px-2 py-0.5 rounded-full">
                          {formatDate(decision.created_at)}
                        </span>
                        <h3 className="text-xl font-medium tracking-tight">{decision.title}</h3>
                        <p className="text-sm text-white/40 line-clamp-1 max-w-lg">{decision.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-2xl font-light">{decision.analysis?.clarityScore || 0}%</span>
                        <span className="text-[10px] uppercase tracking-widest text-white/20">Clarity</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                  <Brain size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-white/60">No decisions stored yet.</p>
                  <p className="text-sm text-white/20">Start your first analysis to see data here.</p>
                </div>
                <Link to="/new-decision" className="mt-4">
                  <Button variant="secondary" size="sm">Create First Decision</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar Widget */}
        <div className="space-y-8">
          <Card className={`p-8 border-2 ${isOverLimit ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOverLimit ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white/40'}`}>
                {plan === 'free' ? <Zap size={20} /> : <Crown size={20} />}
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20">{plan} tier</span>
            </div>
            <h3 className="text-lg font-medium mb-1">Plan Limit Status</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-light">{decisionsToday}</span>
              <span className="text-white/20 text-sm">/ {limit} today</span>
            </div>
            
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-6">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(decisionsToday / limit) * 100}%` }}
                className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-white/40'}`} 
              />
            </div>

            {isOverLimit ? (
              <div className="space-y-4">
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Critical: Daily analysis limit reached. System requires upgrade to process further inputs.
                </p>
                <Link to="/settings" className="block">
                  <Button variant="primary" size="sm" className="w-full">Upgrade Now</Button>
                </Link>
              </div>
            ) : (
              <p className="text-[10px] text-white/20 uppercase tracking-widest text-center">
                {remaining} analyses remaining today
              </p>
            )}
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Insight of the Day</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              "Ambitious leaders don't just pick the best option; they eliminate the worst ones first. Focus on reducing variance before chasing returns."
            </p>
            <div className="text-[10px] uppercase tracking-widest text-white/20 font-medium">Strategic Principle #14</div>
          </Card>

          <Card className="p-8">
             <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Core Pattern</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
              Your most recurring fear across recent sessions is <strong>"Market Obsolescence"</strong>. 
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-white/40 uppercase tracking-widest">Career</span>
              <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-white/40 uppercase tracking-widest">Tech</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
