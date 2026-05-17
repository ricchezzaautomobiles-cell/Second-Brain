import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, History, Zap, Settings, Brain } from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlusCircle, label: "New Decision", path: "/new-decision" },
  { icon: History, label: "History", path: "/history" },
  { icon: Zap, label: "Insights", path: "/insights" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen border-r border-[var(--glass-border)] flex flex-col p-6 sticky top-0 bg-[var(--bg-system)]">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--text-main)] flex items-center justify-center text-[var(--bg-system)]">
          <Brain size={24} />
        </div>
        <span className="font-semibold text-lg tracking-tight">Beyond</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-[var(--glass-layer)] text-[var(--text-main)] border border-[var(--glass-border)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-layer)]"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate text-[var(--text-main)]">User Account</span>
            <span className="text-xs text-[var(--text-muted)] truncate">Free Tier</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
