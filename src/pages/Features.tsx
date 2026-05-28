import React from "react";
import { motion } from "motion/react";
import { Brain, Sparkles, CheckCircle, Eye, ShieldCheck, Zap, Layers, RefreshCw } from "lucide-react";
import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Base";

export default function Features() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Cognitive Focus and Decision Analyzer Application",
    "provider": {
      "@type": "Organization",
      "name": "Beyond AI"
    },
    "description": "Premium analytical tools built to combat dopamine loops and restore supreme clarity.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Beyond Features Catalogue"
    }
  };

  const featureCards = [
    {
      icon: Layers,
      category: "Decision Modeling",
      title: "First Principles Deconstructor",
      desc: "Strip a sticky situation down to its fundamental, undeniable parameters. Remove emotional projections and examine underlying realities."
    },
    {
      icon: RefreshCw,
      category: "Logic Engine",
      title: "Interactive Opportunity Cost Matrix",
      desc: "What are you truly sacrificing? Quantify and compare the invisible path alternative so you can make asymmetric choices with absolute peace of mind."
    },
    {
      icon: Eye,
      category: "Neuro-Psychology",
      title: "Neural Fear & Constraint Isolation",
      desc: "Isolate immediate survival fears and time bottlenecks from logical parameters. By addressing current emotional states, we defuse cognitive paralysis."
    },
    {
      icon: Zap,
      category: "AI Optimization",
      title: "Analytical Consequence Projection",
      desc: "Model 2nd and 3rd order impacts across 1-year, 5-year, and 10-year timelines. Predict cascading events before drafting capital or career shifts."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7]">
      <SEO 
        title="Intelligence Features Index | Beyond" 
        description="Explore the features of Beyond: First Principles Analysis, Expected Value Matrix, Bias Detection, cognitive clarity modules, and real-time strategic assistance."
        keywords="Beyond AI, Beyond OpenMinded, Beyond productivity AI, Beyond thinking assistant, Beyond focus AI, Think Clearly AI, mental clarity, mental clarity app, AI mental clarity, improve focus, deep thinking, cognitive clarity, reduce mental noise, overthinking solution, AI productivity, AI assistant, AI focus tool, AI thinking tool, smart productivity AI"
        canonical="https://beyond.openminded.vercel.app/features"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-blue-400 block pb-2">The Architecture of Clarity</span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-gradient leading-none">
            Built for Elite Decisions.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Every feature in Beyond is engineered around cognitive science, designed specifically to reduce attention friction and filter out structural bias.
          </p>
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-12 rounded-[2.5rem] border border-white/5 bg-black/40 hover:border-white/10 transition-all duration-500 flex flex-col justify-between aspect-[4/3]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 mb-8">
                <feat.icon size={22} />
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">{feat.category}</div>
                <h3 className="text-2xl font-light text-white tracking-tight">{feat.title}</h3>
                <p className="text-sm font-light text-white/40 leading-relaxed pt-2">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Immersive Walkthrough Column */}
      <section className="py-32 max-w-5xl mx-auto px-6 space-y-32">
        <h2 className="text-center text-4xl font-light tracking-tighter">Inside the Beyond Operating System</h2>

        {/* Highlight 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block">Method 01</span>
            <h3 className="text-3xl font-light tracking-tight text-white">Visual Silence</h3>
            <p className="text-sm font-light text-white/40 leading-relaxed">
              When software uses heavy animations, flashing lights, and multiple color-coded notification badges, your nervous system remains under alert. Beyond uses physical, sterile design elements to let you breathe, helping you focus on logic.
            </p>
          </div>
          <div className="glass-morphism h-64 border border-white/10 rounded-3xl flex items-center justify-center bg-white/[0.01]">
            <div className="w-48 h-32 border border-white/5 bg-[#0a0a0a] rounded-2xl flex flex-col justify-between p-4 shadow-xl">
              <div className="h-2 w-12 bg-white/10 rounded-full" />
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/5 rounded-full" />
                <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
              </div>
              <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Highlight 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-12">
          <div className="lg:order-2 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block">Method 02</span>
            <h3 className="text-3xl font-light tracking-tight text-white">Continuous Memory Archive</h3>
            <p className="text-sm font-light text-white/40 leading-relaxed">
              Your previous choices represent a critical database of decisions. By holding structured parameters and outcomes in a safe, quiet archive, you can re-trace paths and trace predictive precision over months or years.
            </p>
          </div>
          <div className="glass-morphism h-64 border border-white/10 rounded-3xl flex items-center justify-center bg-white/[0.01]">
            <div className="grid grid-cols-3 gap-2 px-10 w-full">
              {[60, 85, 45].map((val, i) => (
                <div key={i} className="bg-white/5 h-32 rounded-xl p-3 flex flex-col justify-between border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-white/30">Score</span>
                  <span className="text-2xl font-light">{val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-2xl mx-auto space-y-8 px-6">
          <h2 className="text-4xl font-light tracking-tighter">Ready to experience complete clarity?</h2>
          <p className="text-sm font-light text-white/40 leading-relaxed max-w-md mx-auto">
            Initialize your profile and explore strategic frameworks used by elite thinkers world-wide.
          </p>
          <Link to="/auth">
            <Button variant="primary" className="rounded-xl px-10 py-4 text-xs font-bold uppercase tracking-widest mt-4">
              Access the App
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
