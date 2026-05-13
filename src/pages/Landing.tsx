import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Brain, Zap, Shield, Sparkles, Code, Globe, Rocket } from "lucide-react";
import { Button } from "../components/ui/Base";
import { GlowingOrb } from "../components/ui/Visuals";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505]">
      {/* Background Elements */}
      <GlowingOrb className="top-1/4 -left-20 w-96 h-96 bg-blue-600/30" />
      <GlowingOrb className="bottom-1/4 -right-20 w-96 h-96 bg-purple-600/30" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain className="text-white" size={32} />
          <span className="text-xl font-semibold tracking-tighter">Second Brain</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/auth" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Login</Link>
          <Link to="/auth">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8 uppercase tracking-widest animate-pulse">
            Introducing Version 2.0
          </span>
          <h1 className="text-7xl md:text-9xl font-medium tracking-tight mb-8 text-gradient">
            Think Clearly.
          </h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            An AI-powered decision intelligence system for ambitious people who want to optimize their life and career.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link to="/auth">
              <Button size="lg" className="group">
                Start Thinking Better
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-3xl overflow-hidden aspect-video max-w-5xl mx-auto shadow-2xl">
            <div className="bg-[#0a0a0a] rounded-2xl w-full h-full flex items-center justify-center text-white/5 font-mono text-8xl overflow-hidden select-none">
              <div className="grid grid-cols-6 gap-4 opacity-10">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-white/20 aspect-square rounded-lg" />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain size={120} className="text-white/20 blur-sm" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Decision Cards Section */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-medium mb-4">Hard Decisions, Solved.</h2>
          <p className="text-white/40 font-light">Structure your thoughts with elite reasoning frameworks.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Career Shift", q: "Should I learn AI or web development?", icon: Code },
            { title: "Entrepreneurship", q: "Should I quit my job to freelance?", icon: Rocket },
            { title: "Lifestyle", q: "Should I move abroad this year?", icon: Globe },
            { title: "Ventures", q: "Should I start a startup now?", icon: Zap }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 cursor-default"
            >
              <card.icon className="text-white/20 group-hover:text-white transition-colors mb-6" size={24} />
              <h3 className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">{card.title}</h3>
              <p className="text-lg font-medium leading-tight">{card.q}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-20 px-8 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="text-white/20" size={24} />
          <span className="text-sm font-medium text-white/20 tracking-tighter">Second Brain</span>
        </div>
        <p className="text-xs text-white/20 uppercase tracking-[0.2em]">Designed for the ambitious. Powered by Intelligence.</p>
      </footer>
    </div>
  );
}
