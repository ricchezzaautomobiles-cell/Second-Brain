import React from "react";
import { Link } from "react-router-dom";
import { Brain, ArrowUpRight, ShieldCheck, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const links = {
    platform: [
      { label: "Home Base", path: "/" },
      { label: "About Beyond", path: "/about" },
      { label: "Features Index", path: "/features" },
      { label: "AI Decision Engine", path: "/ai" },
    ],
    clarity: [
      { label: "Think Clearly", path: "/think-clearly" },
      { label: "Focus Track", path: "/focus" },
      { label: "Mental Clarity", path: "/mental-clarity" },
    ],
    resources: [
      { label: "Chronicles (Blog)", path: "/blog" },
      { label: "System Status", path: "/contact" },
      { label: "Contact Intelligence", path: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ]
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-white/5 bg-[#030303] pt-24 pb-16 px-6 lg:px-8">
      {/* Background radial highlight */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Logo Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Brain className="text-black" size={22} />
              </div>
              <span className="text-2xl font-semibold tracking-tighter text-white">
                Beyond
              </span>
            </Link>
            <p className="text-white/40 text-sm max-w-sm font-light leading-relaxed">
              Quiet the mental noise. Beyond translates high-stakes human complexity into pure first-principles clarity, optimizing cognitive capacity.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-white/30">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white/20" />
                <span>San Francisco, CA — Cognitive Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-white/20" />
                <span>intelligence@beyond-clarity.ai</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Platform</h4>
            <ul className="space-y-3.5">
              {links.platform.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-light text-white/50 hover:text-white hover:underline decoration-white/10 underline-offset-4 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Cognitive Tracks</h4>
            <ul className="space-y-3.5">
              {links.clarity.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-light text-white/50 hover:text-white hover:underline decoration-white/10 underline-offset-4 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Resources & Legal</h4>
            <ul className="space-y-3.5">
              {links.resources.concat(links.legal).map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm font-light text-white/50 hover:text-white hover:underline decoration-white/10 underline-offset-4 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 w-full mb-8" />

        {/* Legal and Disclaimer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-[11px] text-white/20 tracking-wider">
          <div className="space-y-1">
            <p className="font-medium uppercase tracking-[0.1em] text-white/30">
              Beyond Decision Intelligence Systems
            </p>
            <p className="max-w-2xl font-light leading-relaxed">
              Disclaimer: Beyond is an AI-assisted cognitive modeling framework used for strategic modeling and decision clarity. It is not a replacement for clinical psychiatric advisory or legally binding fiduciary consultation.
            </p>
          </div>
          <div className="md:text-right shrink-0">
            <p className="font-bold tracking-[0.2em] text-white/25">© {currentYear} BEYOND INC.</p>
            <p className="font-light mt-1">Made with premium physical minimalism.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
