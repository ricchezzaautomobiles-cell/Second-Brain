import React from "react";
import { User } from "@supabase/supabase-js";
import { Settings as SettingsIcon, Shield, User as UserIcon, Bell, Database, LogOut, Key } from "lucide-react";
import { Card, Button } from "../components/ui/Base";
import { supabase } from "../lib/supabase";

export default function Settings({ user }: { user: User }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Email Address</label>
                  <input readOnly value={user.email} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-4 text-white/60 text-sm focus:outline-none focus:border-white/20" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Account Type</label>
                   <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-4 text-white/60 text-sm">Professional Tier</div>
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
