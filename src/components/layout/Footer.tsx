import React from 'react';
import { ActiveTab } from '../../types';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t border-zinc-800 text-zinc-400 font-sans py-16 px-6 sm:px-12 md:px-20 mt-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.png"
                alt="UNSENT logo"
                className="h-7 w-7 object-contain"
              />
              <span className="text-xl font-black tracking-[0.35em] text-white font-mono uppercase leading-none">
                UNSENT
              </span>
            </div>
            <p className="text-xs font-serif text-zinc-500 italic leading-relaxed">
              Say it without sending it. A private and anonymous vault for unspoken thoughts, letters, memories, and confessions.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
              Platform
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="/discover"
                  onClick={(e) => handleNavClick(e, 'discover')}
                  className="hover:text-white transition-colors"
                >
                  Discover Feed
                </a>
              </li>
              <li>
                <a
                  href="/write"
                  onClick={(e) => handleNavClick(e, 'write')}
                  className="hover:text-white transition-colors"
                >
                  Write What You Never Sent
                </a>
              </li>
              <li>
                <a
                  href="/capsules"
                  onClick={(e) => handleNavClick(e, 'capsules')}
                  className="hover:text-white transition-colors"
                >
                  Time Capsules
                </a>
              </li>
            </ul>
          </div>

          {/* Guides & Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
              Explore &amp; Guides
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="/anonymous-writing"
                  onClick={(e) => handleNavClick(e, 'anonymous-writing')}
                  className="hover:text-white transition-colors"
                >
                  Anonymous Writing
                </a>
              </li>
              <li>
                <a
                  href="/unsent-messages"
                  onClick={(e) => handleNavClick(e, 'unsent-messages')}
                  className="hover:text-white transition-colors"
                >
                  Unsent Messages
                </a>
              </li>
              <li>
                <a
                  href="/private-journal"
                  onClick={(e) => handleNavClick(e, 'private-journal')}
                  className="hover:text-white transition-colors"
                >
                  Private Online Journal
                </a>
              </li>
              <li>
                <a
                  href="/anonymous-community"
                  onClick={(e) => handleNavClick(e, 'anonymous-community')}
                  className="hover:text-white transition-colors"
                >
                  Anonymous Community
                </a>
              </li>
              <li>
                <a
                  href="/time-capsules"
                  onClick={(e) => handleNavClick(e, 'time-capsules')}
                  className="hover:text-white transition-colors"
                >
                  Digital Time Capsules
                </a>
              </li>
            </ul>
          </div>

          {/* Learn & About */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
              About UNSENT
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNavClick(e, 'about')}
                  className="hover:text-white transition-colors"
                >
                  About UNSENT
                </a>
              </li>
              <li>
                <a
                  href="/feedback"
                  onClick={(e) => handleNavClick(e, 'feedback')}
                  className="hover:text-white transition-colors"
                >
                  Feedback &amp; Reviews
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleNavClick(e, 'privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Vault &amp; Security
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Community */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white">
              Legal &amp; Guidelines
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleNavClick(e, 'terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/community-guidelines"
                  onClick={(e) => handleNavClick(e, 'community-guidelines')}
                  className="hover:text-white transition-colors"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-zinc-600 gap-4">
          <span>&copy; {new Date().getFullYear()} UNSENT. ALL RIGHTS RESERVED.</span>
          <span>SAY IT WITHOUT SENDING IT.</span>
        </div>
      </div>
    </footer>
  );
};
