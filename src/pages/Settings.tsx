import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Settings as SettingsIcon, Shield, User as UserIcon, Bell, Database, LogOut, Key, Crown, Zap, Check, Palette } from "lucide-react";
import { Card, Button } from "../components/ui/Base";
import { supabase } from "../lib/supabase";
import { PlanTier } from "../types";
import { PLAN_LIMITS, PLAN_NAMES } from "../constants/plans";

export default function Settings({ user }: { user: User }) {
  const [plan, setPlan] = useState<PlanTier>("free");
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [theme, setTheme] = useState(localStorage.getItem("beyond_theme") || "dark");

  const isGuest = user.id === "guest";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("beyond_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isGuest) {
      const storedPlan = localStorage.getItem("beyond_guest_plan") as PlanTier;
      if (storedPlan) setPlan(storedPlan);
      return;
    }

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
  }, [user.id, isGuest]);

  const updatePlan = async (newPlan: PlanTier) => {
    setUpdating(true);
    
    if (isGuest) {
      localStorage.setItem("beyond_guest_plan", newPlan);
      setPlan(newPlan);
      setUpdating(false);
      return;
    }

    if (!supabase) {
      setUpdating(false);
      return;
    }

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
            { label: "Profile", icon: UserIcon },
            { label: "Theme", icon: Palette },
            { label: "Notifications", icon: Bell },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.label ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-2 space-y-8">
          {activeTab === "Theme" && (
            <section className="space-y-6">
              <h3 className="text-xl font-medium tracking-tight border-b border-white/5 pb-4">Visual Atmosphere</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "dark", label: "Midnight", desc: "Premium dark energy. High focus.", icon: Shield },
                  { id: "light", label: "Clarity", desc: "Clean and airy. High readability.", icon: Zap }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all duration-500 text-left ${
                      theme === t.id
                        ? "border-[var(--text-main)] bg-[var(--glass-layer)] ring-1 ring-[var(--glass-border)]"
                        : "border-[var(--glass-border)] bg-transparent hover:bg-[var(--bg-accent)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${t.id === 'dark' ? 'bg-[var(--bg-accent)]' : 'bg-blue-500/10 text-blue-400'}`}>
                        <t.icon size={18} />
                      </div>
                      {theme === t.id && (
                        <div className="w-5 h-5 rounded-full bg-[var(--text-main)] flex items-center justify-center text-[var(--bg-system)]">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.label} Mode</div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === "Profile" && (
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
          )}

          {activeTab === "Profile" && (
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
          )}

          {activeTab === "Notifications" && (
            <section className="space-y-6">
              <h3 className="text-xl font-medium tracking-tight border-b border-white/5 pb-4">Communications</h3>
              <div className="space-y-4">
                {["Weekly Cognitive Recap", "Smart Decision Reminders", "System Alerts"].map((n) => (
                  <div key={n} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{n}</span>
                    <div className="w-10 h-5 rounded-full bg-white/10 relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white/40" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
