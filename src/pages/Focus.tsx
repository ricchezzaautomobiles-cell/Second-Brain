import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, Sliders, PlayCircle, EyeOff, Lock, Clock, Zap } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function Focus() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Focus Track - Attention Safeguards",
    "description": "Minimal design structures built to eliminate visual disruption and enable sustained flow state."
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="Uninterrupted Strategic Focus | Beyond" 
        description="Escape the reaction treadmill. Beyond uses minimalist, structured workspaces to preserve working memory, improve concentration, and optimize overall cognitive energy."
        keywords="focus AI, focus improvement, improve concentration, cognitive clarity, digital overstimulation, mental optimization"
        canonical="https://beyond.openminded.vercel.app/focus"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 blur-[150px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-sky-400 block pb-2">Cognitive Shielding</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            Uninterrupted Flow.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            In an economy optimized to capture and monetize your eyes, holding sustained focus is your ultimate tactical edge. Beyond acts as an active shield for your prefrontal cortex.
          </p>
        </motion.div>
      </section>

      {/* Grid: Attention Deficits */}
      <section className="py-24 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-light tracking-tighter text-white">The Chemistry of Attention Hijacking</h2>
            <p className="text-white/40 text-base leading-relaxed font-light">
              High-rate notification loops trigger small, constant cortisol spikes, keeping your brain in a perpetual low-grade stress cycle. This stress makes slow, methodical, long-term focus feel biologically impossible.
            </p>
            <p className="text-white/40 text-base leading-relaxed font-light">
              By replacing variable visual rewards with physical, dark aesthetics and structured choice interfaces, Beyond lowers your adrenaline levels, returning you to logical baseline focus.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                { icon: EyeOff, title: "Visual Clean Slates", desc: "No flashing components, ads, or high-contrast icons to fight for attention." },
                { icon: Lock, title: "Total Data Privacy", desc: "No cookies, profiling trackers, or notifications designed to pull you back in." },
                { icon: Clock, title: "Threaded Focus Hubs", desc: "Guide your brain to resolve one strategic question at a time, completely." },
                { icon: Zap, title: "Objective Feedback", desc: "Clear, unbiased, clean logic outputs with zero distracting fluff." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <item.icon size={16} className="text-sky-400" />
                    <h4 className="font-medium text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] border border-white/10 glass-morphism flex flex-col justify-between p-12 bg-black/40">
            <div className="flex justify-between items-center text-xs tracking-widest text-sky-400/80 font-mono">
              <span>SHIELD_ON</span>
              <span>FILTER_RATIO: 99.8%</span>
            </div>
            
            <div className="space-y-4 py-8">
              <div className="text-4xl md:text-5xl font-light italic leading-tight text-white/70">
                "Work on what matters, in pure isolation."
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping" />
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Active attention defense loop</div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus CTA */}
      <section className="py-24 text-center bg-[#030303]">
        <div className="max-w-xl mx-auto space-y-8 px-6">
          <h2 className="text-4xl font-light tracking-tighter col-gradient">Safeguard your cognitive capital.</h2>
          <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm mx-auto">
            Build unyielding focus. Transition to the quietest workspace ever created to make high-value career and life decisions.
          </p>
          <Link to="/auth">
            <Button variant="primary" className="rounded-xl px-12 py-4 text-xs font-bold uppercase tracking-widest bg-white text-black">
              Enter Focused State
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
