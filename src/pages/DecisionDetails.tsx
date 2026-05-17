import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { ArrowLeft, Brain, Calendar, Target, AlertTriangle, ShieldCheck, TrendingUp, Compass, Activity, Play } from "lucide-react";
import { Card, Button } from "../components/ui/Base";
import { GlassPanel, GlowingOrb } from "../components/ui/Visuals";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Decision } from "../types";
import { formatDate } from "../lib/utils";
import { storage } from "../lib/storage";

export default function DecisionDetails({ user }: { user: User }) {
  const { id } = useParams<{ id: string }>();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecision() {
      if (!id) return;
      setLoading(true);

      if (user.id === "guest") {
        const localDecisions = storage.getDecisions();
        const found = localDecisions.find(d => d.id === id);
        setDecision(found || null);
        setLoading(false);
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("decisions")
          .select("*")
          .eq("id", id)
          .single();
        
        if (!error && data) setDecision(data);
      }
      setLoading(false);
    }
    fetchDecision();
  }, [id, user.id]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-b-2 border-[var(--text-main)] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] animate-pulse">Relieving cognitive state...</p>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto text-white/20">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">Archive Not Found</h2>
          <p className="text-[var(--text-muted)]">This decision index does not exist in your cognitive archive.</p>
        </div>
        <Link to="/history">
          <Button variant="secondary" size="sm">Back to History</Button>
        </Link>
      </div>
    );
  }

  const analysis = decision.analysis;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <Link to="/history" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Strategy Archive
      </Link>

      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-muted)]">
              <Calendar size={14} />
              <span>{formatDate(decision.created_at)}</span>
              <span>•</span>
              <span>Case ID: {decision.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-5xl font-medium tracking-tighter leading-[0.9]">{decision.title}</h1>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <div className="text-4xl font-light leading-none">{analysis?.clarityScore || 0}%</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1">Clarity Score</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light leading-none">{analysis?.confidenceLevel || 0}%</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1">Confidence</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassPanel className="p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Brain size={120} />
             </div>
             <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[var(--text-muted)] italic">Input Context</h3>
             
             <div className="space-y-4 relative z-10">
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Description</h4>
                  <p className="text-sm text-[var(--text-main)]/80 leading-relaxed font-light">{decision.description}</p>
               </div>
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Options Under Review</h4>
                  <p className="text-sm text-[var(--text-main)]/80 leading-relaxed font-light italic">{decision.options}</p>
               </div>
               <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Primary Objective</h4>
                  <p className="text-sm text-[var(--text-main)]/80 leading-relaxed font-light">{decision.goal}</p>
               </div>
               <div className="pt-4 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <TrendingUp size={14} />
                    <span>Importance Level: <strong>{decision.importance}/10</strong></span>
                  </div>
               </div>
             </div>
          </GlassPanel>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
             <div className="flex items-center gap-3">
               <Compass className="text-blue-400" size={24} />
               <h2 className="text-2xl font-medium tracking-tight">Strategic Architecture</h2>
             </div>
             
             <div className="grid grid-cols-1 gap-6">
               <GlassPanel className="p-8 border-l-2 border-l-blue-500/50">
                 <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-400 mb-4">Executive Analysis</h4>
                 <p className="text-lg font-light leading-relaxed text-[var(--text-main)]/90 italic">"{analysis?.strategicAnalysis}"</p>
               </GlassPanel>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                      <Target size={16} />
                      <span>Core Tradeoffs</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">{analysis?.coreTradeoffs}</p>
                  </Card>
                  
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
                      <ShieldCheck size={16} />
                      <span>Threat Index</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">{analysis?.riskAnalysis}</p>
                  </Card>
               </div>
             </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-3">
               <Activity className="text-purple-400" size={24} />
               <h2 className="text-2xl font-medium tracking-tight">System Recommendation</h2>
             </div>

             <GlassPanel className="p-10 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
               <div className="space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-purple-400 italic">Recommended Path</h4>
                    <p className="text-3xl font-medium tracking-tight text-[var(--text-main)]">{analysis?.recommendedPath}</p>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-purple-500/20">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Immediate Tactical Operations</h4>
                    <ul className="space-y-3">
                      {analysis?.nextBestActions.split("\n").filter(a => a.trim()).map((action, i) => (
                        <li key={i} className="flex gap-4 items-start text-sm text-[var(--text-main)]/80 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                          {action.replace(/^[0-9.-]+\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
             </GlassPanel>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] px-1">Long-Term Horizon</h3>
                <Card className="p-6">
                   <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light italic">
                     {analysis?.longTermOutlook}
                   </p>
                </Card>
             </div>
             <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] px-1">Cognitive Bias Alert</h3>
                <Card className="p-6 border-red-500/10">
                   <p className="text-sm text-red-400/80 leading-relaxed font-light">
                     {analysis?.emotionalBiasDetection}
                   </p>
                </Card>
             </div>
          </section>
        </div>
      </div>
      
      <div className="flex justify-center pt-10 border-t border-[var(--glass-border)]">
        <Link to="/new-decision">
          <Button variant="primary" className="px-12 group">
            <Play size={18} className="mr-2 group-hover:scale-110 transition-transform" />
            Initiate New Analysis
          </Button>
        </Link>
      </div>
    </div>
  );
}
