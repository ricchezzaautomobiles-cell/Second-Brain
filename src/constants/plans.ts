import { PlanTier } from "../types";

export const PLAN_LIMITS: Record<PlanTier, number> = {
  free: 3,
  starter: 10,
  pro: 20,
};

export const PLAN_NAMES: Record<PlanTier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
};
