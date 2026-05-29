import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Brain, Zap, Shield, Sparkles, Code, Globe, Rocket, Target, Heart, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Base";
import { GlowingOrb } from "../components/ui/Visuals";
import { Link } from "react-router-dom";
import { Typewriter } from "../components/ui/Typewriter";
import { AIDemo } from "../components/landing/AIDemo";

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505]">
      {/* Cinematic Ambient Gradients */}
      <div className="fixed inset-0 z-0">
        <GlowingOrb className="top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px]" />
        <GlowingOrb className="bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[2px]" />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Brain className="text-black" size={20} />
          </div>
          <span className="text-xl font-semibold tracking-tighter text-white">Beyond</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/auth" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Login</Link>
          <Link to="/auth">
            <Button variant="primary" size="sm" className="rounded-xl">Initialize</Button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Compressed Hero */}
        <section className="pt-20 pb-12 px-8 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-white/10" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Strategic Peace of Mind</span>
              <span className="h-[1px] w-8 bg-white/10" />
            </div>
            
            <h1 className="text-7xl md:text-[8rem] leading-[0.9] font-medium tracking-tighter mb-6 text-gradient scale-y-110">
              Think Clearly.
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Quiet the mental noise. Beyond uses structural logic to deconstruct your complexity and restore clarity.
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="max-w-xl mx-auto"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as any).elements.decision.value;
                  window.location.href = `/auth?q=${encodeURIComponent(input)}`;
                }}
                className="relative group h-20"
              >
                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl group-focus-within:bg-blue-500/10 transition-all duration-500" />
                <div className="relative flex h-full p-2 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl items-center gap-4 group-focus-within:border-white/30 transition-all duration-500">
                  <input
                    name="decision"
                    placeholder="Should I leave my job? Should I move?"
                    className="flex-1 bg-transparent border-none outline-none px-6 text-lg font-light text-white placeholder:text-white/20"
                  />
                  <Button type="submit" size="md" className="h-full rounded-[1.25rem] px-8 bg-white text-black hover:bg-white/90">
                    Analyze
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
              <p className="mt-6 text-[10px] text-white/20 uppercase tracking-[0.3em] font-black italic">
                Strategic clarity is the beginning of mental relief.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Live System Demo */}
        <section className="py-12 px-8 relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <AIDemo />
          </motion.div>
        </section>

        {/* Human Outcome / Stats */}
        <section className="py-24 px-8 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Decisions Clarified", value: "142,000+" },
              { label: "Anxiety Reduction", value: "84%" },
              { label: "Active Strategists", value: "12,400" },
              { label: "Hours of Overthinking Saved", value: "2M+" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl md:text-5xl font-light tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why It Works (Credibility Section) */}
        <section className="py-32 px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-4 block">The Methodology</span>
                <h2 className="text-5xl font-medium tracking-tighter leading-tight">Elite Reasoning as a Service.</h2>
              </div>
              <p className="text-white/40 text-lg font-light leading-relaxed">
                Beyond doesn't just "chat." It employs rigorous logical frameworks used by world-class strategists and engineers to deconstruct complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {[
                  { title: "First Principles", desc: "Break down problems to their basic truths.", icon: Target },
                  { title: "Opportunity Cost", desc: "Quantify the value of the paths not taken.", icon: Zap },
                  { title: "Bias Detection", desc: "Isolate emotional noise from logical signal.", icon: Brain },
                  { title: "Strategic Depth", desc: "Analyze 2nd and 3rd order consequences.", icon: Shield },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 text-white">
                      <item.icon size={16} className="text-blue-500" />
                      <h4 className="font-medium text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-white/30 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="relative glass-morphism p-1 rounded-[3rem] border border-white/10">
                <div className="bg-[#0a0a0a] rounded-[2.8rem] p-12 aspect-[4/5] flex flex-col justify-between border border-white/5">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Check size={16} className="text-green-500" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">System Ready</span>
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center px-4 gap-4"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white/20"
                              initial={{ width: 0 }}
                              whileInView={{ width: "80%" }}
                              transition={{ duration: 1.5, delay: i * 0.2 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-light tracking-tighter italic">"A paradigm shift in mental clarity."</h3>
                    <p className="text-sm font-medium text-white/40 uppercase tracking-[0.2em]">Alpha User Collective</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Hubs */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Operational Focus</span>
              <h2 className="text-5xl font-medium tracking-tighter">Navigate high-stakes choices.</h2>
            </div>
            <p className="text-white/40 max-w-md text-lg font-light">Bring structure to the most complex areas of your life with specialized thinking frameworks.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Career Shift", q: "Is the timing right for a change?", icon: Code, color: "hover:border-blue-500/50" },
              { title: "Ventures", q: "Am I calculating the real risk?", icon: Rocket, color: "hover:border-purple-500/50" },
              { title: "Capital", q: "Where is the asymmetric upside?", icon: Globe, color: "hover:border-green-500/50" },
              { title: "Life Strategy", q: "Does this align with my long-term vision?", icon: Zap, color: "hover:border-yellow-500/50" }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01] transition-all duration-700 cursor-default flex flex-col justify-between aspect-[4/5] ${card.color}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <card.icon className="text-white/20 group-hover:text-white transition-colors" size={28} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">{card.title}</h3>
                  <p className="text-2xl font-light leading-tight tracking-tight text-white/60 group-hover:text-white transition-colors">
                    {card.q}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-white/0 group-hover:text-white/40 transition-all duration-500">
                    <span className="text-[10px] uppercase font-bold tracking-widest">Explore Framework</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 blur-[150px] rounded-full" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-2xl mx-auto space-y-10"
          >
            <h2 className="text-6xl md:text-8xl font-medium tracking-tighter">Ready to evolve?</h2>
            <p className="text-white/40 text-xl font-light leading-relaxed">
              Join the ranks of high-leverage individuals optimizing their future with Beyond.
            </p>
            <Link to="/auth" className="inline-block">
              <Button size="lg" className="h-20 px-16 text-xl rounded-[2rem]">
                Start Your First Analysis
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 py-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2.5">
          <Brain className="text-white/20" size={24} />
          <span className="text-sm font-bold tracking-tighter text-white/20 uppercase tracking-[0.2em]">Beyond</span>
        </div>
        <p className="text-[10px] text-white/10 uppercase tracking-[0.3em] font-black">
          © 2026 OpenMinded Intelligence. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

