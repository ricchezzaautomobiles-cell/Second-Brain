import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, CheckCircle2, ShieldAlert, Award, Compass, Eye } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function About() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Beyond AI",
    "description": "Learn about the mission, philosophy, and team behind Beyond, the elite cognitive enhancement and decision intelligence platform.",
    "publisher": {
      "@type": "Organization",
      "name": "Beyond",
      "logo": "https://beyond.openminded.vercel.app/logo.png"
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="Our Philosophy & Mission | Beyond" 
        description="Escape digital overstimulation. Beyond is a movement and futuristic AI platform engineered for cognitive optimization, strategic deep thinking, and total mental clarity."
        keywords="AI self improvement, mental optimization, cognitive enhancement, futuristic AI platform, deep thinking, strategic decision tool"
        canonical="https://beyond.openminded.vercel.app/about"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-white/30 block">The Manifesto</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-tight">
            Quiet the Noise.<br />Restore the Signal.
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Beyond was born from a singular realization: modern civilization has built the most sophisticated attention-extraction loops in human history, but zero tools to help us actually think.
          </p>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-light tracking-tighter">The Crisis of Continuous Response</h2>
            <p className="text-white/40 font-light leading-relaxed text-lg">
              Every day, we face hundreds of micro-decisions while experiencing massive visual and cognitive fatigue. Our brains, bombarded by dopamine loops and continuous reaction cycles, are pushed into sympathetic overdrive.
            </p>
            <p className="text-white/40 font-light leading-relaxed text-lg">
              In this high-frequency noise, deep strategic thinking vanishes. We mistake responsiveness for focus, and micro-stimulation for productivity. Beyond is a refusal to accept this state. We build technology designed for <strong>mental optimization</strong> and <strong>cognitive enhancement</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-white/80">First Principles Choice</h4>
                  <p className="text-xs text-white/40 leading-relaxed mt-1">Strip questions down to their physics-level absolute truths.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-white/80">Biological Respect</h4>
                  <p className="text-xs text-white/40 leading-relaxed mt-1">Zero invasive trackers, flashing alerts, or attention traps.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 glass-morphism flex items-center justify-center p-8 bg-black/40">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div className="text-center space-y-4">
              <Brain size={64} className="mx-auto text-blue-400 animate-pulse" />
              <div className="text-xs tracking-[0.3em] font-medium text-white/20 uppercase">Core Framework Integrity</div>
              <p className="text-xl font-light italic text-white/70 max-w-xs mx-auto">"You do not need more information. You need higher-quality thinking."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Beyond */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Scientific Methodology</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter">The Three Pillars of Beyond</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Compass,
              title: "Strategic Solitude",
              desc: "A clean visual canvas with generous negative space. Zero notification tickers, social feeds, or visual alerts. A quiet workspace designed to induce alpha brainwaves.",
              accent: "border-blue-500/20 hover:border-blue-500/40"
            },
            {
              icon: Eye,
              title: "Cognitive Offloading",
              desc: "Transfer critical anxiety, messy parameters, and fears into structured logic models. Freeing working memory instantly reduces systematic cognitive stress.",
              accent: "border-purple-500/20 hover:border-purple-500/40"
            },
            {
              icon: Award,
              title: "Analytical Integration",
              desc: "Interact with our AI focus tool designed around cognitive psychology. We analyze consequences, cognitive bias, and trade-offs to yield objective clarity.",
              accent: "border-green-500/20 hover:border-green-500/40"
            }
          ].map((pillar, i) => (
            <div key={i} className={`p-10 rounded-[2.5rem] border bg-white/[0.01] transition-all duration-500 ${pillar.accent} flex flex-col justify-between h-[380px]`}>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                <pillar.icon size={24} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white/90">{pillar.title}</h3>
                <p className="text-sm font-light text-white/40 leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center max-w-4xl mx-auto px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative space-y-10">
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter">Enter a new orbit of digital wellness.</h2>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto leading-relaxed">
            Reclaim your attention. Use systematic intelligence to clear overthinking and command your trajectory.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="rounded-2xl px-12 py-5 h-auto text-base">
                Try Beyond Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
