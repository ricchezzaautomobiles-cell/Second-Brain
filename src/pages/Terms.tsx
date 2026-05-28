import React from "react";
import { motion } from "motion/react";
import { FileText, Award, Scale } from "lucide-react";
import { SEO } from "../components/SEO";

export default function Terms() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Beyond Terms of Service",
    "description": "Examine the terms of service agreement for using the Beyond decision intelligence system."
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] pb-32">
      <SEO 
        title="Terms of Service Agreement" 
        description="Read the terms of service governing Beyond. Learn about user responsibilities, account management, and strategic disclaimers."
        keywords="terms of service, legal, user agreement, strategic disclaimers"
        canonical="https://beyond.openminded.vercel.app/terms"
        schema={schema}
      />

      <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 text-blue-400">
          <FileText size={20} />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Consensual Engagement</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-white">Terms of Service</h1>
        <p className="text-sm font-light text-white/40 uppercase tracking-widest">Effective Date: May 28, 2026</p>
      </section>

      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-12 font-light text-white/60 text-sm md:text-base leading-relaxed border-t border-white/5 pt-12">
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">1. System Access and Eligibility</h2>
          <p>
            By accessing or operating the Beyond database and diagnostic framework, you enter a legally binding relationship with Beyond Inc. You represent that you are at least 18 years of age and hold full judicial capacity.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">2. Use Limitations</h2>
          <p>
            Beyond is designed exclusively to deconstruct decision metrics, isolate biases, and enhance strategic cognitive focus. You are strictly forbidden from:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Employing malicious scrapers, crawlers, or automation engines that overload local or cloud server architectures.</li>
            <li>Using logical results for psychiatric diagnosis or high-frequency automated algorithmic trading.</li>
            <li>Bypassing internal encryption filters or access barriers.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">3. Fiduciary Disclaimer</h2>
          <p>
            Beyond systems utilize advanced artificial intelligence models to organize variables and detect emotional blind spots. BUT: The modeling outputs do not present legally binding medical, fiduciary, or corporate advisory.
          </p>
          <p>
            All decisions are executed under the absolute strategic responsibility of the human user. Beyond Inc. accepts zero liabilities for career changes, financial shifts, or personal choices executed post-analysis.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">4. System Evolution</h2>
          <p>
            We optimize, adjust, and deploy system upgrades continuously. We reserve the absolute right to suspend free tiers, alter design structures, or discontinue beta modules with zero strategic liabilities.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white tracking-tight">5. Arbitration</h2>
          <p>
            Any disputes, claims, or systemic legal inquiries arising from these terms will face binding arbitration in San Francisco, CA, under the auspices of California jurisdiction.
          </p>
        </div>
      </section>
    </div>
  );
}
