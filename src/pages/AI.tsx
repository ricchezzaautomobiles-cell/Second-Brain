import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, Cpu, Code2, Heart, Scale, Minimize2, CheckSquare } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function AI() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "name": "Beyond Strategic AI Paradigm",
    "description": "How Beyond transforms artificial intelligence into a zero-bias cognitive thinking partner utilizing Gemini API optimization.",
    "headline": "Collaborative Cold Logic for Strategic Humankind",
    "publisher": {
      "@type": "Organization",
      "name": "Beyond"
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="AI-Powered Decision Intelligence | Beyond" 
        description="Discover how Beyond integrates the Google Gemini API to serve as a deep AI thinking assistant, optimizing neural clarity, eliminating emotional bias, and structuring choice parameters."
        keywords="AI mental clarity, AI thinking assistant, thinking assistant, AI focus tool, cognitive clarity, cognitive enhancement"
        canonical="https://beyond.openminded.vercel.app/ai"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-500/5 blur-[160px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-purple-400 block pb-2">The Cold Logic Paradigm</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            An Unbiased Mirror.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Beyond has built a server-side AI architecture that doesn't larp as a friend. It operates as an elite logical auditor, helping you identify and escape emotional blind spots.
          </p>
        </motion.div>
      </section>

      {/* AI Philosophy Grid */}
      <section className="py-24 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-light tracking-tighter">AI Shared Intelligence: Not Automation, but Amplification</h2>
            <p className="text-white/40 text-base leading-relaxed font-light">
              Most productivity apps use AI to write faster drafts or summarize noise, which paradoxically adds to the digital deluge. Beyond is different. Our <strong>AI focus tool</strong> is custom optimized to help you filter, structure, and challenge ideas.
            </p>
            <p className="text-white/40 text-base leading-relaxed font-light">
              We leverage advanced Google Gemini models via secure, server-side APIs. On our system, your parameters undergo deep diagnostic loops looking for cognitive bias, overthinking patterns, opportunity cost negligence, and short-sighted trade-offs.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { title: "No Attention Arbitrage", desc: "No visual trackers or micro-loops designed to steal working memory." },
                { title: "Zero Data Scraping", desc: "Your analytical logs and inputs will never be used for ad-retargeting or public modeling." },
                { title: "Rigorous Mathematical Frameworks", desc: "Calculates strategic trade-offs objectively over complex decision trees." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckSquare size={18} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white/80">{item.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5 font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/10 blur-[100px] rounded-full" />
            <div className="relative glass-morphism p-12 rounded-[3.5rem] border border-white/10 p-8 h-[400px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2 items-center">
                  <Cpu size={18} className="text-purple-400" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Beyond Core CPU</span>
                </div>
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
              </div>
              
              <div className="space-y-4">
                <div className="text-xs text-white/30 tracking-[0.2em] font-mono">STATUS: OBJECTIVE_SIGNAL_FILTERED</div>
                <div className="h-0.5 bg-gradient-to-r from-purple-500 to-transparent w-full" />
                <p className="text-xl font-light tracking-tight text-white/80 leading-relaxed italic">
                  "Logical coherence checks completed. Strategic path probability verified. Emotional bias levels isolated."
                </p>
              </div>

              <div className="text-[10px] font-mono text-white/20 tracking-widest mt-4">
                SECURE END-TO-END SERVER PROCESS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-16">
        <h3 className="text-center text-4xl font-light tracking-tighter col-gradient">Uncompromising Intelligence Design</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            {
              icon: Scale,
              title: "Bias Deconstruction",
              desc: "By identifying panic responses, loss aversion, status quo trap, or confirmation loops, our algorithms offer logical relief."
            },
            {
              icon: Minimize2,
              title: "Noise Stripping",
              desc: "Automatically extracts unnecessary inputs, leaving only clean parameters that matter mathematically and strategically."
            },
            {
              icon: Code2,
              title: "Deterministic Integrity",
              desc: "No hallucinated suggestions. Results focus entirely on structured parameters, providing high strategic clarity."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto md:mx-0 text-purple-400">
                <item.icon size={20} />
              </div>
              <h4 className="text-lg font-medium text-white">{item.title}</h4>
              <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Immersive AI Tech CTA */}
      <section className="py-24 text-center border-t border-white/5 bg-[#030303] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-xl mx-auto space-y-8 px-6 relative z-10">
          <h2 className="text-4xl font-light tracking-tighter">Deploy elite intelligence to your life.</h2>
          <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm mx-auto">
            Experience a clean state of mind. Initialize your profile and begin deconstructing goals now.
          </p>
          <Link to="/auth">
            <Button variant="primary" className="rounded-xl px-12 py-4 text-xs font-bold uppercase tracking-widest">
              Access AI System
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
