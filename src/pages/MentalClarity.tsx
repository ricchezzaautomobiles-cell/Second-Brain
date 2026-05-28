import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, Shield, Heart, HelpCircle, Compass, Zap } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function MentalClarity() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mental Clarity App - Strategic Relief",
    "description": "Discover cognitive modeling frameworks to process fear, map alternatives, and relieve decision anxiety completely."
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="Escaping Overthinking & Anxieties | Beyond" 
        description="Escape visual fatigue. The Beyond mental clarity app uses first principles thinking and cognitive logic to separate signal from daily static noise."
        keywords="mental clarity app, AI mental clarity, overthinking solution, cognitive clarity, dopamine overload, digital overstimulation"
        canonical="https://beyond.openminded.vercel.app/mental-clarity"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-rose-400 block pb-2">The Pure Signal</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            Escape Decision Fatigue.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            When you carry unsorted options in your brain, they rub together, generating friction known as anxiety. Beyond parses this complexity, organizing parameters into clean strategic columns.
          </p>
        </motion.div>
      </section>

      {/* Grid: Clarity Breakdown */}
      <section className="py-24 border-t border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-light tracking-tighter text-white">Neural Hygiene for Critical Thinkers</h2>
            <p className="text-white/40 text-base leading-relaxed font-light">
              Decision anxiety is not solved by more thinking. It is solved by structured dumping. By externalizing your situation into our analytical models, you relieve the brain's short-term working memory. Learn to look at your issues from the outside.
            </p>
            <p className="text-white/40 text-base leading-relaxed font-light">
              Once written, our advanced AI assistant processes inputs through logical constraints. Our frameworks separate subjective projection from underlying objective truths.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                { icon: Shield, title: "Anxiety Demolition", desc: "Translates abstract, terrifying worries into concrete variables to examine rationally." },
                { icon: Compass, title: "Intuition Calibrator", desc: "Test whether your sudden gut feelings are authentic signals or reaction flags." },
                { icon: HelpCircle, title: "Socratic Inquiries", desc: "Quiet prompts challenge cognitive biases, preventing short-sighted escapes." },
                { icon: Zap, title: "Dynamic Clarity Metric", desc: "Receive immediate statistical scores representing logical completeness and plan confidence." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <item.icon size={16} className="text-rose-400" />
                    <h4 className="font-medium text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] border border-white/10 glass-morphism flex flex-col justify-between p-12 bg-black/40">
            <div className="flex justify-between items-center text-xs tracking-widest text-rose-400/80 font-mono">
              <span>METRIC_ACTIVE</span>
              <span>CALM_STABILITY: 100%</span>
            </div>
            
            <div className="space-y-4 py-8">
              <div className="text-4xl md:text-5xl font-light italic leading-tight text-white/70">
                "Logic replaces overthought."
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
              <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold">Cognitive hygiene enabled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Clarity CTA */}
      <section className="py-24 text-center bg-[#030303]">
        <div className="max-w-xl mx-auto space-y-8 px-6">
          <h2 className="text-4xl font-light tracking-tighter col-gradient">A pristine mental canvas is waiting.</h2>
          <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm mx-auto">
            Try the premier mental clarity app constructed to help you analyze, decide, and move on.
          </p>
          <Link to="/auth">
            <Button variant="primary" className="rounded-xl px-12 py-4 text-xs font-bold uppercase tracking-widest bg-white text-black">
              Start Free Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
