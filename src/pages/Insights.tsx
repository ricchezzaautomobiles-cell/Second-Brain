import React from "react";
import { User } from "@supabase/supabase-js";
import { Zap, TrendingUp, AlertTriangle, Heart, Target, PieChart, BarChart3 } from "lucide-react";
import { Card } from "../components/ui/Base";
import { AdBanner } from "../components/ads/AdBanner";

export default function Insights({ user }: { user: User }) {
  return (
    <div className="space-y-12 py-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-medium tracking-tight">Intelligence Feed</h1>
        <p className="text-white/40 font-light">Meta-analysis of your decision patterns over time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              Clarity Progress
            </h3>
            <span className="text-xs text-white/40 uppercase tracking-widest">Last 30 Days</span>
          </div>
          <div className="h-64 w-full bg-white/[0.02] rounded-2xl flex items-end justify-around p-6 overflow-hidden">
            {[40, 65, 55, 80, 75, 90, 85].map((val, i) => (
              <div key={i} className="w-8 bg-gradient-to-t from-blue-500/10 to-blue-500/40 rounded-t-lg transition-all duration-1000" style={{ height: `${val}%` }} />
            ))}
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-lg font-medium mb-8 flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-400" />
            Core Fears
          </h3>
          <div className="space-y-6">
            {[
              { label: "Financial Loss", val: 65 },
              { label: "Social Risk", val: 40 },
              { label: "Time Waste", val: 85 },
              { label: "Obsolescence", val: 50 },
            ].map((fear, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest font-medium">
                  <span className="text-white/60">{fear.label}</span>
                  <span className="text-white/40">{fear.val}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/20" style={{ width: `${fear.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <Card className="p-8 flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-white/5 text-purple-400">
            <Heart size={32} />
          </div>
          <h4 className="font-medium text-lg">Emotional Awareness</h4>
          <p className="text-xs text-white/40 font-light leading-relaxed">Most decisions are made while in a state of "Controlled Optimism". Avoid making calls during "High Stress" cycles.</p>
        </Card>

         <Card className="p-8 flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-white/5 text-blue-400">
            <Target size={32} />
          </div>
          <h4 className="font-medium text-lg">Strategic Alignment</h4>
          <p className="text-xs text-white/40 font-light leading-relaxed">92% of your decisions align with your primary goal of "Freedom".</p>
        </Card>

         <Card className="p-8 flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-white/5 text-green-400">
            <Zap size={32} />
          </div>
          <h4 className="font-medium text-lg">Analysis Velocity</h4>
          <p className="text-xs text-white/40 font-light leading-relaxed">Your average decision time decreased by 2 days since using the system.</p>
        </Card>

         <Card className="p-8 flex flex-col items-center text-center gap-4">
          <div className="p-4 rounded-2xl bg-white/5 text-purple-400">
            <BarChart3 size={32} />
          </div>
          <h4 className="font-medium text-lg">Bias Detection</h4>
          <p className="text-xs text-white/40 font-light leading-relaxed">Sunk cost fallacy detected in 3 past decisions. Be mindful of legacy commitments.</p>
        </Card>
      </div>

      <AdBanner
        id="insights-ad-2"
        adClient="ca-pub-5297627506856360"
        adSlot="7752069290"
        slotLabel="Sponsored Analysis"
        showPlaceholderIfUnset={false}
      />
    </div>
  );
}
