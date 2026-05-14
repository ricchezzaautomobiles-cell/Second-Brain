import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Shield, Target, Zap, ChevronRight, MessageSquare, Heart } from "lucide-react";

export function AIDemo() {
  const [step, setStep] = useState(0);
  
  const scenarios = [
    {
      question: "Should I quit my job to start a specialized AI consultancy?",
      results: [
        {
          title: "Strategic Analysis",
          content: "Current market maturity for specialized AI services is at an inflection point. First-principles analysis suggests higher asymmetric upside compared to employee security.",
          icon: Brain,
          color: "text-blue-400"
        },
        {
          title: "Risk Analysis",
          content: "Primary risk is cash flow consistency in Q1. Secondary risk is domain competition. Mitigation: Secure 2 anchor clients before resignation.",
          icon: Shield,
          color: "text-red-400"
        },
        {
          title: "Emotional Insight",
          content: "I detect 'security anxiety'—a common physiological response to growth. By anchoring your transition with 2 clients, we transform this fear into a calculated, manageable variable.",
          icon: Heart,
          color: "text-pink-400"
        },
        {
          title: "Recommended Path",
          content: "Hybrid transition. Dedicated 15h/week for 2 months to validate client demand before full commitment.",
          icon: Zap,
          color: "text-yellow-400"
        }
      ]
    },
    {
      question: "Should I move to Tokyo for a year to focus on deep work?",
      results: [
        {
          title: "Opportunity Cost",
          content: "The trade-off isn't just rent; it's the removal of domestic 'comfortable distractions'. The potential for high-output deep work in a new environment outweighs local social network maintenance.",
          icon: Target,
          color: "text-purple-400"
        },
        {
          title: "Clarity Check",
          content: "You are conflating 'adventure' with 'output'. Tokyo provides the environment, but the framework for work must be established *before* the move to prevent 'vacation drift'.",
          icon: Brain,
          color: "text-blue-400"
        },
        {
          title: "Emotional Insight",
          content: "There is an underlying 'escapism' vector here. Address your current project fatigue directly, rather than hoping a geography change will solve structural motivation issues.",
          icon: Heart,
          color: "text-pink-400"
        },
        {
          title: "Final Verdict",
          content: "Proceed only if you commit to a 3-month isolation sprint. Otherwise, your ROI will be negative due to high setup overhead.",
          icon: Zap,
          color: "text-green-400"
        }
      ]
    },
    {
      question: "Should we pivot our SaaS to focus exclusively on Enterprise clients?",
      results: [
        {
          title: "Economic Reality",
          content: "Current churn in SMB tier is 12%. Enterprise churn is <2%. The LTV/CAC ratio for Enterprise is 4x higher, justifying the longer sales cycle duration.",
          icon: Target,
          color: "text-blue-400"
        },
        {
          title: "Systemic Risk",
          content: "Risk of 'feature bloat' driven by single large contracts. Requirement: A rigid product roadmap that rejects non-scalable custom requests.",
          icon: Shield,
          color: "text-red-400"
        },
        {
          title: "Recommended Path",
          content: "Aggressive pivot. Sun-setting the free tier by Q3. Reallocate 70% of dev resources to security and compliance features immediately.",
          icon: Zap,
          color: "text-yellow-400"
        }
      ]
    }
  ];

  // Flatten scenarios into individual steps
  const demoSteps = scenarios.flatMap(s => [
    { type: "user", text: s.question, icon: MessageSquare },
    { type: "ai-header", text: "Finding Clarity...", icon: Brain },
    ...s.results.map(r => ({ ...r, type: "result" }))
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % demoSteps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentStep = demoSteps[step] as any;

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[400px] flex flex-col justify-center gap-6 p-8 rounded-[2.5rem] glass-morphism relative overflow-hidden border border-white/5">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Neural Engine Active</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {currentStep.type === "user" && (
            <div className="flex flex-col items-center text-center gap-6 py-10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-2xl font-light tracking-tight text-white/80 italic">
                "{currentStep.text}"
              </h3>
            </div>
          )}

          {currentStep.type === "ai-header" && (
            <div className="flex flex-col items-center py-12 gap-8">
              <div className="relative">
                <Brain size={64} className="text-white/20 animate-pulse" />
                <motion.div 
                  className="absolute inset-0 border border-white/40 rounded-full"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40 animate-pulse">
                {currentStep.text}
              </p>
            </div>
          )}

          {currentStep.type === "result" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${currentStep.color}`}>
                  {currentStep.icon && (
                    <React.Fragment>
                      {React.createElement(currentStep.icon, { size: 24 })}
                    </React.Fragment>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium tracking-tight">{currentStep.title}</h4>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Clarity Score: 0.94</p>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 leading-relaxed text-white/60 font-light">
                {currentStep.content}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                <span>View deep analysis</span>
                <ChevronRight size={12} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2 mt-auto pt-4 border-t border-white/5">
        {demoSteps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-1000 ${
              step === i ? "w-8 bg-white/40" : "w-2 bg-white/5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
