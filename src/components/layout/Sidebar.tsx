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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen border-r border-[var(--glass-border)] flex-col p-6 sticky top-0 bg-[var(--bg-system)]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-sm ring-1 ring-black/5">
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

      {/* Mobile Bottom Navigation Bar (Just Icons) */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-system)]/95 border-t border-[var(--glass-border)] px-6 py-2 z-50 justify-around items-center shadow-[0_-8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-[var(--text-main)] bg-[var(--glass-layer)] border border-[var(--glass-border)]/50" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              )}
            >
              <item.icon size={22} className={cn("transition-transform duration-200", isActive && "scale-110")} />
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--text-main)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
