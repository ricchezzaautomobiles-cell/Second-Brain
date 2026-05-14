import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Settings as SettingsIcon, Shield, User as UserIcon, Bell, Database, LogOut, Key, Crown, Zap, Check } from "lucide-react";
import { Card, Button } from "../components/ui/Base";
import { supabase } from "../lib/supabase";
import { PlanTier } from "../types";
import { PLAN_LIMITS, PLAN_NAMES } from "../constants/plans";

export default function Settings({ user }: { user: User }) {
  const [plan, setPlan] = useState<PlanTier>("free");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) return;
      const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      if (data) setPlan(data.plan as PlanTier);
    }
    fetchProfile();
  }, [user.id]);

  const updatePlan = async (newPlan: PlanTier) => {
    if (!supabase) return;
    setUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({ plan: newPlan })
      .eq("id", user.id);
    
    if (!error) setPlan(newPlan);
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
  };

  const planOptions = [
    { id: "free", icon: Zap, color: "text-white/40", bgColor: "bg-white/5" },
    { id: "starter", icon: Crown, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { id: "pro", icon: Crown, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <header>
        <h1 className="text-4xl font-medium tracking-tight mb-2">Systems Configuration</h1>
        <p className="text-white/40 font-light">Preferences for your augmented intelligence environment.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <nav className="space-y-2">
          {[
            { label: "Profile", icon: UserIcon, active: true },
            { label: "Security", icon: Shield },
            { label: "Integrations", icon: Database },
            { label: "API Keys", icon: Key },
            { label: "Notifications", icon: Bell },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-2 space-y-8">
          <section className="space-y-6">
            <h3 className="text-xl font-medium tracking-tight border-b border-white/5 pb-4">Personal Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Email Address</label>
                    <input readOnly value={user.email} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-4 text-white/60 text-sm focus:outline-none focus:border-white/20" />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                   <label className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Subscription Management</label>
                   <div className="grid grid-cols-1 gap-4">
                     {planOptions.map((opt) => (
                       <button
                         key={opt.id}
                         disabled={updating}
                         onClick={() => updatePlan(opt.id as PlanTier)}
                         className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                           plan === opt.id 
                             ? "border-white/20 bg-white/5" 
                             : "border-white/5 bg-transparent hover:bg-white/[0.02]"
                         }`}
                       >
                         <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl ${opt.bgColor} flex items-center justify-center ${opt.color}`}>
                             <opt.icon size={20} />
                           </div>
                           <div className="text-left">
                             <div className="text-sm font-medium">{PLAN_NAMES[opt.id as PlanTier]}</div>
                             <div className="text-[10px] text-white/40 uppercase tracking-widest">{PLAN_LIMITS[opt.id as PlanTier]} decisions per day</div>
                           </div>
                         </div>
                         {plan === opt.id && (
                           <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black">
                             <Check size={14} />
                           </div>
                         )}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-medium tracking-tight border-b border-white/5 pb-4">AI Preferences</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div>
                  <h4 className="text-sm font-medium">Strategic Depth</h4>
                  <p className="text-xs text-white/40">Intensity of first-principles analysis</p>
                </div>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map((lev) => (
                    <button key={lev} className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-bold ${lev === 'High' ? 'bg-white text-black' : 'border border-white/10 text-white/40 hover:bg-white/5'}`}>{lev}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="pt-8 border-t border-white/10">
            <Button variant="danger" size="sm" onClick={handleSignOut}>
              <LogOut size={16} />
              Sign Out Securely
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
