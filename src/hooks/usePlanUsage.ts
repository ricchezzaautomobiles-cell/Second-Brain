import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { PlanTier } from "../types";
import { PLAN_LIMITS } from "../constants/plans";

export function usePlanUsage(user: User | null) {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanTier>("free");
  const [decisionsToday, setDecisionsToday] = useState(0);

  useEffect(() => {
    if (!user) return;

    async function fetchUsage() {
      setLoading(true);
      try {
        if (!supabase) return;

        // Fetch profile/plan
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();

        if (profile) {
          setPlan(profile.plan as PlanTier);
        }

        // Fetch decisions made today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count } = await supabase
          .from("decisions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", today.toISOString());

        setDecisionsToday(count || 0);
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, [user]);

  const limit = PLAN_LIMITS[plan];
  const remaining = Math.max(0, limit - decisionsToday);
  const isOverLimit = decisionsToday >= limit;

  return {
    plan,
    decisionsToday,
    limit,
    remaining,
    isOverLimit,
    loading
  };
}
