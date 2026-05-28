import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, CheckSquare, Sunset, Activity, ShieldCheck, Battery } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function ThinkClearly() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Think Clearly - Escape Dopamine Loops",
    "description": "Scientific frameworks and minimalist environments designed to eliminate mental noise and restore deep logical focus."
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="Think Clearly — Escape Overthought | Beyond" 
        description="Escape visual overstimulation. Beyond is an AI-powered thinking assistant and cognitive clarity tool, structuring your parameters to yield strategic peace of mind."
        keywords="Think Clearly AI, Think Clearly app, beyond thinking assistant, Beyond OpenMinded, Beyond mental clarity, Beyond AI assistant, mental clarity, AI mental clarity, improve focus, deep thinking, cognitive clarity, reduce mental noise, dopamine overload, overthinking solution, clear thinking, mental performance, AI for thinking, AI cognitive assistant"
        canonical="https://beyond.openminded.vercel.app/think-clearly"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-emerald-400 block pb-2">Cognitive Preservation</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            Deconstruct Complexity.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Overthinking is not a proof of intelligence; it's a symptom of unstructured parameters. When details run loose, the mind runs in anxious loops. We build the antidote.
          </p>
        </motion.div>
      </section>

      {/* Interactive Core Breakdown */}
      <section className="py-24 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-light tracking-tighter text-white">How to Stop Running in Loops</h2>
            <p className="text-white/40 text-base leading-relaxed font-light">
              When we are forced to decide in chaotic settings, our threat detection centers hijack logic. We seek short-term escape or catastrophize minor issues.
            </p>
            <p className="text-white/40 text-base leading-relaxed font-light">
              To think clearly is to <strong>isolate parameters</strong>. By mapping goals, fears, alternative options, and emotional markers, we create a secure sandbox. The logical conclusion emerges naturally from First Principles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {[
                { title: "Defuse the Amygdala", desc: "Naming current mental states lowers cortisol levels instantly." },
                { title: "Trace Consequences", desc: "Structure outcomes over multiple timeline horizons." },
                { title: "Weigh Sacrifices", desc: "Discover hidden opportunities and costs mathematically." },
                { title: "Synthesize Signal", desc: "Separate external pressure from core internal mission." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-bold font-mono text-emerald-400 mt-1">0{i+1}.</span>
                  <div>
                    <h4 className="text-sm font-medium text-white/80">{item.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] border border-white/10 glass-morphism flex items-center justify-center p-8 bg-black/40">
            <div className="text-center space-y-4">
              <Sunset size={56} className="mx-auto text-emerald-400 animate-pulse" />
              <div className="text-[10px] tracking-[0.3em] font-medium text-white/30 uppercase">Quiet State Inductor</div>
              <p className="text-xl font-light italic text-white/60">"Simplify to the point where choice becomes clean math."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Metrics */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-16">
        <h3 className="text-center text-4xl font-light tracking-tighter">Restoring Sustainable Concentration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Battery,
              title: "Energy Economics",
              desc: "Deep focus burns heavy neural energy. By automating decision parameters, we preserve cognitive reserve for actual creative labor."
            },
            {
              icon: Activity,
              title: "Calibrated Urgency",
              desc: "Separate high-stakes strategic forks from minor operational noise. Protect your focus window from modern continuous interruption."
            },
            {
              icon: ShieldCheck,
              title: "Integrity Checks",
              desc: "Isolate external biases, peer-pressure trends, and rapid dopamine feedback loops. Think clearly without social noise."
            }
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                <feat.icon size={20} />
              </div>
              <h4 className="text-lg font-medium text-white">{feat.title}</h4>
              <p className="text-xs text-white/40 font-light leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech CTA */}
      <section className="py-24 text-center border-t border-white/5 bg-[#030303]">
        <div className="max-w-xl mx-auto space-y-8 px-6">
          <h2 className="text-4xl font-light tracking-tighter col-gradient">Your cognitive sanctuaries await.</h2>
          <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm mx-auto">
            Escape continuous feeds. Engage dedicated modeling interfaces designed to restore true cognitive mastery.
          </p>
          <Link to="/auth">
            <Button variant="primary" className="rounded-xl px-12 py-4 text-xs font-bold uppercase tracking-widest bg-white text-black">
              Try Beyond App
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
