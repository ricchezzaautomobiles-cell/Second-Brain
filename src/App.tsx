import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './hooks/useAuth';
import { ActiveTab } from './types';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SEOHead } from './components/seo/SEOHead';
import { HomeView } from './components/home/HomeView';
import { WriteView } from './components/write/WriteView';
import { DiscoverView } from './components/discover/DiscoverView';
import { CapsulesView } from './components/capsules/CapsulesView';
import { ProfileView } from './components/profile/ProfileView';
import { PrivacyCenterView } from './components/privacy/PrivacyCenterView';
import { AboutView } from './components/about/AboutView';
import { TermsView } from './components/terms/TermsView';
import { CommunityGuidelinesView } from './components/community/CommunityGuidelinesView';
import { AnonymousWritingView } from './components/pages/AnonymousWritingView';
import { PrivateJournalView } from './components/pages/PrivateJournalView';
import { UnsentMessagesView } from './components/pages/UnsentMessagesView';
import { AnonymousCommunityView } from './components/pages/AnonymousCommunityView';
import { TimeCapsulesInfoView } from './components/pages/TimeCapsulesInfoView';
import { FeedbackView } from './components/feedback/FeedbackView';
import { AuthModal } from './components/auth/AuthModal';

function getTabFromPath(pathname: string): ActiveTab {
  const cleanPath = pathname.replace(/\/$/, '').toLowerCase();
  switch (cleanPath) {
    case '':
    case '/':
      return 'home';
    case '/write':
      return 'write';
    case '/discover':
      return 'discover';
    case '/capsules':
      return 'capsules';
    case '/profile':
    case '/vault':
      return 'profile';
    case '/feedback':
      return 'feedback';
    case '/reviews':
      return 'reviews';
    case '/privacy':
      return 'privacy';
    case '/about':
      return 'about';
    case '/terms':
      return 'terms';
    case '/community-guidelines':
      return 'community-guidelines';
    case '/anonymous-writing':
      return 'anonymous-writing';
    case '/private-journal':
      return 'private-journal';
    case '/unsent-messages':
      return 'unsent-messages';
    case '/anonymous-community':
      return 'anonymous-community';
    case '/time-capsules':
      return 'time-capsules';
    default:
      return 'home';
  }
}

function getPathFromTab(tab: ActiveTab): string {
  if (tab === 'home') return '/';
  return `/${tab}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getTabFromPath(window.location.pathname));
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigate = (tab: ActiveTab) => {
    const targetPath = getPathFromTab(tab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setActiveTab(tab);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const {
    user,
    profile,
    loading,
    isConfigured,
    signOut,
    refreshProfile,
  } = useAuth();

  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] font-sans selection:bg-white selection:text-black relative overflow-x-hidden flex flex-col">
      {/* Dynamic Production SEO Metadata */}
      <SEOHead activeTab={activeTab} />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Global Minimal Header */}
        {activeTab !== 'write' && (
          <Header
            user={user}
            profile={profile}
            isConfigured={isConfigured}
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {/* Main View Switcher */}
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              {activeTab === 'home' && (
                <HomeView
                  user={user}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}

              {activeTab === 'write' && (
                <WriteView
                  user={user}
                  onOpenAuth={() => setShowAuthModal(true)}
                  onSaved={() => handleNavigate('profile')}
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === 'discover' && (
                <DiscoverView
                  user={user}
                  onOpenAuth={() => setShowAuthModal(true)}
                  onNavigateWrite={() => handleNavigate('write')}
                />
              )}

              {activeTab === 'capsules' && (
                <CapsulesView
                  user={user}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  user={user}
                  profile={profile}
                  onSignOut={signOut}
                  onOpenAuth={() => setShowAuthModal(true)}
                  onNavigateWrite={() => handleNavigate('write')}
                  onNavigate={handleNavigate}
                />
              )}

              {(activeTab === 'feedback' || activeTab === 'reviews') && (
                <FeedbackView
                  user={user}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              )}

              {activeTab === 'privacy' && <PrivacyCenterView />}

              {activeTab === 'about' && (
                <AboutView onNavigate={handleNavigate} />
              )}

              {activeTab === 'terms' && <TermsView />}

              {activeTab === 'community-guidelines' && <CommunityGuidelinesView />}

              {activeTab === 'anonymous-writing' && (
                <AnonymousWritingView onNavigate={handleNavigate} />
              )}

              {activeTab === 'private-journal' && (
                <PrivateJournalView onNavigate={handleNavigate} />
              )}

              {activeTab === 'unsent-messages' && (
                <UnsentMessagesView onNavigate={handleNavigate} />
              )}

              {activeTab === 'anonymous-community' && (
                <AnonymousCommunityView onNavigate={handleNavigate} />
              )}

              {activeTab === 'time-capsules' && (
                <TimeCapsulesInfoView onNavigate={handleNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Crawlable Footer */}
        {activeTab !== 'write' && (
          <Footer onNavigate={handleNavigate} />
        )}

        {/* Mobile Bottom Dock (hidden in write mode) */}
        {activeTab !== 'write' && (
          <Navbar activeTab={activeTab} onTabChange={handleNavigate} />
        )}

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            refreshProfile();
          }}
        />
      </div>
    </div>
  );
}
