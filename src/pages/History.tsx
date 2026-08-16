import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Search, ChevronDown, ChevronRight, Calendar, Brain } from "lucide-react";
import { Card } from "../components/ui/Base";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Decision } from "../types";
import { formatDate } from "../lib/utils";
import { storage } from "../lib/storage";
import { Link } from "react-router-dom";
import { AdBanner } from "../components/ads/AdBanner";

export default function History({ user }: { user: User }) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      if (user.id === "guest") {
        setDecisions(storage.getDecisions());
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) setDecisions(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const filteredDecisions = decisions.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 py-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-medium tracking-tight">Strategy Archive</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input
            type="text"
            placeholder="Search decisions..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-white/20 transition-all font-light"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : filteredDecisions.length > 0 ? (
          filteredDecisions.map((decision) => (
            <Link key={decision.id} to={`/decision/${decision.id}`}>
              <Card isHoverable className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                      <Brain size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium tracking-tight">{decision.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/40 uppercase tracking-widest font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(decision.created_at)}</span>
                        <span>•</span>
                        <span>Importance: {decision.importance}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-light">{decision.analysis?.clarityScore || 0}%</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/20">Clarity</div>
                    </div>
                    <ChevronRight size={20} className="text-white/20" />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center text-white/20 uppercase tracking-[0.2em] text-sm">
            No archives found
          </div>
        )}
      </div>

      <AdBanner
        id="history-ad-2"
        adClient="ca-pub-5297627506856360"
        adSlot="7752069290"
        slotLabel="Sponsored"
        showPlaceholderIfUnset={false}
      />
    </div>
  );
}
