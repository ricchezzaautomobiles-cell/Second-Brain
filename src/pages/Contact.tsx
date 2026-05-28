import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Shield, Send, CheckCircle2, MessageSquare, Compass } from "lucide-react";
import { SEO } from "../components/SEO";
import { Button } from "../components/ui/Base";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", topic: "general", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Beyond Support & Research Foundation",
    "description": "Reach the team behind Beyond for system feedback, premium license enquiries, or developer research programs.",
    "url": "https://beyond.openminded.vercel.app/contact"
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] pb-32">
      <SEO 
        title="Contact Beyond Strategic Operations" 
        description="Connect with our founders, cognitive research collective, or system support team. Explore corporate clarity packages or strategic partnerships."
        keywords="contact beyond, support team, AI partnership, cognitive intelligence contact"
        canonical="https://beyond.openminded.vercel.app/contact"
        schema={schema}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-12 px-6 max-w-5xl mx-auto text-center z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-blue-400 block pb-2">Cognitive Hub Communications</span>
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-gradient leading-none">
            Inquire Silence.
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-lg mx-auto font-light leading-relaxed pt-2">
            Submit strategic design inquiries, developer partnership pitches, or premium licensing questions. Let's make thinking clear.
          </p>
        </motion.div>
      </section>

      {/* Grid: Form and Info */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-12">
        {/* Info Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-light tracking-tighter text-white">Direct Channels</h2>
            <p className="text-sm font-light text-white/40 leading-relaxed max-w-sm">
              We operate asynchronous, zero-interruption communication models. We review and reply within 48 systemic hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/80">Electronic Inquiry</h4>
                <p className="text-xs text-white/40 mt-0.5">intelligence@beyond-clarity.ai</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400 shrink-0">
                <Compass size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/80">Corporate Hub</h4>
                <p className="text-xs text-white/40 mt-0.5">San Francisco, California — USA</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/80">Information Security</h4>
                <p className="text-xs text-white/40 mt-0.5">Full TLS E2E processing standard enabled.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full" />
          <div className="relative glass-morphism p-8 md:p-12 rounded-[2.5rem] border border-white/5 bg-black/40">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-white">Signal Received</h3>
                  <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                    Your parameters have been logged and routed to our research analyst desks. Expect cold reply under 48 hours.
                  </p>
                </div>
                <Button 
                  onClick={() => setSubmitted(false)}
                  variant="primary" 
                  size="sm"
                  className="rounded-xl px-6 bg-white/10 text-white hover:bg-white/20 border-none"
                >
                  Send another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-sm text-white transition-all"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-sm text-white transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Focus Vector</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-sm text-white/60 transition-all [&>option]:bg-[#0c0c0c]"
                  >
                    <option value="general">Analytical General Inquiry</option>
                    <option value="corporate">Corporate Clarity Subscriptions</option>
                    <option value="research">Developer / Research Collective</option>
                    <option value="security">Information Protocol Advisory</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Message Content</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-white/20 focus:bg-white/[0.04] text-sm text-white transition-all resize-none"
                    placeholder="Please frame your question clearly..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 rounded-xl group gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  Encrypt & Send
                  <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
