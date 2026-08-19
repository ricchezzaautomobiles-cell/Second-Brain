/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

function cleanUrl(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    // Ensure we only have protocol and host (no trailing slash or paths)
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url.trim().replace(/\/+$/, "");
  }
}

// Only create the client if we have valid-looking credentials
const cleanedUrl = cleanUrl(supabaseUrl);
export const isSupabaseConfigured = !!(cleanedUrl && supabaseAnonKey && cleanedUrl.startsWith("http"));
export const supabase = isSupabaseConfigured 
  ? createClient(cleanedUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("Supabase credentials missing. Auth and DB features are disabled until configured in the Secrets panel.");
}
