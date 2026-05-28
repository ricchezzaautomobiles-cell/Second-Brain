import React from "react";
import { motion } from "motion/react";
import { Shield, Eye, Lock, FileText } from "lucide-react";
import { SEO } from "../components/SEO";

export default function PrivacyPolicy() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Beyond Privacy Policy",
    "description": "Examine the privacy policy of Beyond, outlining zero-tracking, localized databases, and absolute user cognitive ownership."
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] pb-32">
      <SEO 
        title="Privacy Protocol & Legal Rights" 
        description="Review Beyond's privacy protocol. We enforce clinical zero-tracking and absolute user cognitive ownership. Your decisions are completely private."
        keywords="privacy policy, data ownership, secure decision tracker, zero tracking"
        canonical="https://beyond.openminded.vercel.app/privacy"
        schema={schema}
      />

      <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 text-blue-400">
          <Shield size={20} />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Safe Workspace Guarantee</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Privacy Policy</h1>
        <p className="text-sm font-light text-white/40 uppercase tracking-widest">Effective Date: May 28, 2026</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-12 font-light text-white/60 text-sm md:text-base leading-relaxed border-t border-white/5 pt-12">
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">1. Cognitive Privacy Core</h2>
          <p>
            Standard software seeks constant engagement, harvesting user clicks, dwell-times, and reading streams to construct commercial profiles. Beyond refuses this system entirely. Your inputs, decision logs, fear mappings, and strategic options represent your sacred cognitive property.
          </p>
          <p>
            We do not sell, license, or lease your strategic datasets. They are encrypted securely and processed end-to-end to serve your strategic inquiries exclusively.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">2. Information Collection Protocol</h2>
          <p>
            We collect information only to operate the essential operations of the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Data:</strong> If you use cloud synchronization, we save your authorization markers (email address) securely through encrypted authentications.</li>
            <li><strong>Decision Datasets:</strong> Raw logic trees, options, goals, and constraints are collected explicitly to enable AI reasoning computations.</li>
            <li><strong>Technical Operations logs:</strong> Minimal server logs protect system performance with no tracking cookies.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">3. Artificial-Intelligence Encryption</h2>
          <p>
            When utilizing Google Gemini models to parse logs and detect bias, inputs are sent server-side under strict token envelopes. No external LLMs use your personal data for training purposes. Your logic represents protected mathematical parameters.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">4. Client-Local Override</h2>
          <p>
            Beyond supports full and robust client local storage. If no cloud secrets are provided or if you operate in local mode, your entire database remains exclusively on your physical hardware, never entering web networks.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">5. Contact Support</h2>
          <p>
            For any compliance questions, structural database deletion, or information exports, submit an inquiry directly to: <strong>privacy@beyond-clarity.ai</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
