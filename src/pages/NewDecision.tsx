import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, ArrowRight, Loader2, Target, Shield, Clock, Heart, Sparkles, ChevronRight, Check, Zap } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Button, Card } from "../components/ui/Base";
import { GlassPanel } from "../components/ui/Visuals";
import { analyzeDecision } from "../services/aiService";
import { supabase } from "../lib/supabase";
import { DecisionAnalysis } from "../types";
import confetti from "canvas-confetti";

export default function NewDecision({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: "",
    goal: "",
    fear: "",
    constraints: "",
    emotion: "",
    importance: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await analyzeDecision(formData);
      setAnalysis(result);
      
      // Store in Supabase if configured
      if (supabase) {
        const { error } = await supabase.from("decisions").insert([{
          user_id: user.id,
          ...formData,
          analysis: result,
        }]);
        
        if (error) console.error("Database save error:", error);
      }
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#3b82f6', '#8b5cf6']
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const AnalysisSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
          <Icon size={16} className="text-white/60" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-white/60 font-light leading-relaxed text-sm md:text-base bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        {content}
      </p>
    </motion.div>
  );

  if (analysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-medium tracking-tight mb-2">Strategy Map</h1>
            <p className="text-white/40 font-light">Comprehensive analysis for: <span className="text-white/80">{formData.title}</span></p>
          </div>
          <Button variant="secondary" onClick={() => setAnalysis(null)}>
            New Analysis
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-500/10 to-transparent">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">Clarity Score</span>
            <span className="text-7xl font-light">{analysis.clarityScore}%</span>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${analysis.clarityScore}%` }}
                className="h-full bg-blue-500" 
              />
            </div>
          </Card>
          <Card className="p-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-500/10 to-transparent">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">Confidence Level</span>
            <span className="text-7xl font-light">{analysis.confidenceLevel}%</span>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${analysis.confidenceLevel}%` }}
                className="h-full bg-purple-500" 
              />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-12 pt-8">
          <AnalysisSection title="Strategic Analysis" content={analysis.strategicAnalysis} icon={Brain} />
          <AnalysisSection title="Core Tradeoffs" content={analysis.coreTradeoffs} icon={Heart} />
          <AnalysisSection title="Risk Analysis" content={analysis.riskAnalysis} icon={Shield} />
          <AnalysisSection title="Opportunity Cost" content={analysis.opportunityCost} icon={Target} />
          <AnalysisSection title="Recommended Path" content={analysis.recommendedPath} icon={Zap} />
          <AnalysisSection title="Next Best Actions" content={analysis.nextBestActions} icon={ChevronRight} />
          <AnalysisSection title="Long-Term Outlook" content={analysis.longTermOutlook} icon={Sparkles} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight mb-4">Structure Your Thought.</h1>
        <p className="text-white/40 font-light">Fill out the variables below for a comprehensive AI strategic analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Decision Subject</label>
            <input
              type="text"
              required
              className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-light outline-none focus:border-white transition-colors"
              placeholder="e.g. Relocating to Singapore"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Situation Context</label>
            <textarea
              required
              rows={4}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all resize-none font-light leading-relaxed"
              placeholder="Describe the current context, what triggered this decision, and any relevant background..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Primary Goal</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
                  placeholder="The main outcome you want"
                  value={formData.goal}
                  onChange={e => setFormData({...formData, goal: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Options Considered</label>
              <div className="relative">
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
                  placeholder="Option A, B, or C..."
                  value={formData.options}
                  onChange={e => setFormData({...formData, options: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Biggest Fear</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
                  placeholder="What happens if it goes wrong?"
                  value={formData.fear}
                  onChange={e => setFormData({...formData, fear: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Time Constraints</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
                  placeholder="Deadlines or urgency..."
                  value={formData.constraints}
                  onChange={e => setFormData({...formData, constraints: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Emotional State</label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                required
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
                placeholder="How are you feeling about this decision?"
                value={formData.emotion}
                onChange={e => setFormData({...formData, emotion: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">Importance Level</label>
              <span className="text-2xl font-light">{formData.importance}<span className="text-white/20 text-sm">/10</span></span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
              value={formData.importance}
              onChange={e => setFormData({...formData, importance: parseInt(e.target.value)})}
            />
          </div>
        </section>

        <div className="pt-10 flex border-t border-white/5">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full md:w-auto min-w-[240px] py-5 h-auto text-lg tracking-normal group"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing with AI...
              </>
            ) : (
              <>
                Analyze Decision
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
