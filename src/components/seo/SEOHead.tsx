import React, { useEffect } from 'react';
import { ActiveTab } from '../../types';

interface SEOHeadProps {
  activeTab: ActiveTab;
}

interface MetadataConfig {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  keywords?: string;
  schemaType?: string;
  breadcrumbName?: string;
}

const metadataMap: Record<ActiveTab, MetadataConfig> = {
  home: {
    title: 'UNSENT — Say It Without Sending It | Private & Anonymous Writing',
    description: 'UNSENT is a private and anonymous writing platform for the thoughts, memories, letters and feelings you never sent. Keep them private or share them anonymously.',
    canonical: 'https://unsent-pk.vercel.app/',
    robots: 'index, follow',
    keywords: 'unsent messages, anonymous writing, private journal, say it without sending it, letters never sent',
    schemaType: 'WebApplication',
    breadcrumbName: 'Home',
  },
  discover: {
    title: 'Discover Anonymous Thoughts & Unsent Words | UNSENT',
    description: 'Discover anonymous thoughts, memories, letters and words people never sent. Read, reflect and share what resonates with you on UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/discover',
    robots: 'index, follow',
    keywords: 'discover anonymous posts, read unsent messages, unspoken thoughts, anonymous feed',
    schemaType: 'CollectionPage',
    breadcrumbName: 'Discover Feed',
  },
  write: {
    title: 'Write What You Never Sent | Private & Anonymous Writing | UNSENT',
    description: 'Write the thoughts, letters, memories or feelings you never sent. Keep them private or publish them anonymously with UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/write',
    robots: 'index, follow',
    keywords: 'write anonymously, unsent letters, write private thoughts, online journal editor',
    schemaType: 'WebPage',
    breadcrumbName: 'Write',
  },
  capsules: {
    title: 'Time Capsules & Digital Memories | UNSENT',
    description: 'Preserve thoughts, letters and memories for the future with UNSENT time capsules.',
    canonical: 'https://unsent-pk.vercel.app/capsules',
    robots: 'index, follow',
    keywords: 'digital time capsules, memory vault, future letters, time capsule journal',
    schemaType: 'WebPage',
    breadcrumbName: 'Time Capsules',
  },
  feedback: {
    title: 'Feedback & Community Reflections | UNSENT',
    description: 'Read community feedback, suggestions, and reflections about your experience with UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/feedback',
    robots: 'index, follow',
    schemaType: 'WebPage',
    breadcrumbName: 'Feedback',
  },
  reviews: {
    title: 'Community Reflections | UNSENT',
    description: 'Explore honest reviews and thoughts from people who found healing and expression on UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/reviews',
    robots: 'index, follow',
    schemaType: 'WebPage',
    breadcrumbName: 'Reviews',
  },
  privacy: {
    title: 'Privacy & Anonymous Writing | UNSENT',
    description: 'Learn how UNSENT protects private writing and separates private messages from publicly shared anonymous posts.',
    canonical: 'https://unsent-pk.vercel.app/privacy',
    robots: 'index, follow',
    keywords: 'privacy policy, private thought security, data protection, anonymous encryption',
    schemaType: 'WebPage',
    breadcrumbName: 'Privacy',
  },
  about: {
    title: 'About UNSENT — A Place for the Things You Never Sent',
    description: 'Learn about UNSENT, a private and anonymous writing platform for thoughts, letters, memories and confessions you never sent.',
    canonical: 'https://unsent-pk.vercel.app/about',
    robots: 'index, follow',
    keywords: 'about unsent, anonymous writing platform mission, emotional catharsis, unsent letters origin',
    schemaType: 'AboutPage',
    breadcrumbName: 'About',
  },
  terms: {
    title: 'Terms of Service | UNSENT',
    description: 'Terms of service and usage guidelines for UNSENT private and anonymous writing platform.',
    canonical: 'https://unsent-pk.vercel.app/terms',
    robots: 'index, follow',
    schemaType: 'WebPage',
    breadcrumbName: 'Terms',
  },
  'community-guidelines': {
    title: 'Community Guidelines | UNSENT',
    description: 'Guidelines for safe, respectful, and supportive anonymous expression on UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/community-guidelines',
    robots: 'index, follow',
    keywords: 'community guidelines, anonymous safety, respectful expression, content moderation',
    schemaType: 'WebPage',
    breadcrumbName: 'Community Guidelines',
  },
  'anonymous-writing': {
    title: 'Anonymous Writing — Say What You Never Sent | UNSENT',
    description: 'Explore anonymous writing on UNSENT. Write thoughts, feelings, memories and words you never sent, then share them without revealing your identity.',
    canonical: 'https://unsent-pk.vercel.app/anonymous-writing',
    robots: 'index, follow',
    keywords: 'anonymous writing, anonymous writing platform, anonymous posts, write anonymously, anonymous expression',
    schemaType: 'Article',
    breadcrumbName: 'Anonymous Writing',
  },
  'private-journal': {
    title: 'Private Online Journal & Thought Vault | UNSENT',
    description: 'A private place to write thoughts, memories and messages meant only for you. Keep your personal writing in your UNSENT vault.',
    canonical: 'https://unsent-pk.vercel.app/private-journal',
    robots: 'index, follow',
    keywords: 'private online journal, private journal, digital journal, private thoughts',
    schemaType: 'Article',
    breadcrumbName: 'Private Journal',
  },
  'unsent-messages': {
    title: 'Unsent Messages — Write What You Never Sent | UNSENT',
    description: 'Have a message you never sent? Write it down, keep it private, or share it anonymously on UNSENT.',
    canonical: 'https://unsent-pk.vercel.app/unsent-messages',
    robots: 'index, follow',
    keywords: 'unsent messages, messages you never sent, things I never sent, things I never said',
    schemaType: 'Article',
    breadcrumbName: 'Unsent Messages',
  },
  'anonymous-community': {
    title: 'Anonymous Community for Unspoken Thoughts | UNSENT',
    description: 'Discover anonymous thoughts, memories and words people never sent. UNSENT lets people express themselves without making identity the focus.',
    canonical: 'https://unsent-pk.vercel.app/anonymous-community',
    robots: 'index, follow',
    keywords: 'anonymous community, anonymous posts, anonymous thoughts, anonymous expression',
    schemaType: 'Article',
    breadcrumbName: 'Anonymous Community',
  },
  'time-capsules': {
    title: 'Digital Time Capsules & Memories | UNSENT',
    description: 'Preserve thoughts, messages and memories for the future with UNSENT digital time capsules.',
    canonical: 'https://unsent-pk.vercel.app/time-capsules',
    robots: 'index, follow',
    keywords: 'digital time capsule, online time capsule, digital memories, memory journal',
    schemaType: 'Article',
    breadcrumbName: 'Digital Time Capsules',
  },
  profile: {
    title: 'My Private Vault | UNSENT',
    description: 'Your private thoughts, letters, and unsent writings in your secure UNSENT vault.',
    canonical: 'https://unsent-pk.vercel.app/profile',
    robots: 'noindex, nofollow', // CRITICAL PRIVACY RULE: Private user vault must never be indexed!
    schemaType: 'WebPage',
    breadcrumbName: 'Private Vault',
  },
};

export const SEOHead: React.FC<SEOHeadProps> = ({ activeTab }) => {
  useEffect(() => {
    const config = metadataMap[activeTab] || metadataMap.home;

    // Document title
    document.title = config.title;

    // Helper function to update or create meta tag
    const updateMeta = (nameAttr: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Description & Keywords
    updateMeta('name', 'description', config.description);
    if (config.keywords) {
      updateMeta('name', 'keywords', config.keywords);
    }

    // Robots
    updateMeta('name', 'robots', config.robots);

    // Open Graph
    updateMeta('property', 'og:title', config.title);
    updateMeta('property', 'og:description', config.description);
    updateMeta('property', 'og:url', config.canonical);
    updateMeta('property', 'og:site_name', 'UNSENT');
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:image', 'https://unsent-pk.vercel.app/og-image.png');

    // Twitter / X
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', config.title);
    updateMeta('name', 'twitter:description', config.description);
    updateMeta('name', 'twitter:image', 'https://unsent-pk.vercel.app/og-image.png');

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', config.canonical);

    // JSON-LD Structured Data
    let schemaScript = document.getElementById('seo-schema-jsonld') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://unsent-pk.vercel.app/',
      },
    ];

    if (activeTab !== 'home' && config.breadcrumbName) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: config.breadcrumbName,
        item: config.canonical,
      });
    }

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://unsent-pk.vercel.app/#website',
          url: 'https://unsent-pk.vercel.app/',
          name: 'UNSENT',
          description: 'Private and anonymous writing platform for unsent messages, thoughts, and memories.',
          publisher: {
            '@type': 'Organization',
            name: 'UNSENT',
            url: 'https://unsent-pk.vercel.app/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://unsent-pk.vercel.app/favicon.png',
            },
          },
        },
        {
          '@type': config.schemaType || 'WebPage',
          '@id': `${config.canonical}#webpage`,
          url: config.canonical,
          name: config.title,
          description: config.description,
          isPartOf: {
            '@id': 'https://unsent-pk.vercel.app/#website',
          },
          inLanguage: 'en-US',
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${config.canonical}#breadcrumb`,
          itemListElement: breadcrumbItems,
        },
      ],
    };

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [activeTab]);

  return null;
};
