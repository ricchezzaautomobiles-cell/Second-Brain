import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  id?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  className?: string;
  slotLabel?: string;
  sponsorTitle?: string;
  sponsorDescription?: string;
  sponsorLink?: string;
  sponsorCta?: string;
  showPlaceholderIfUnset?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  id = "ad-slot",
  adClient = import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-5297627506856360",
  adSlot = import.meta.env.VITE_ADSENSE_SLOT_ID || "",
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  slotLabel = "Sponsored",
  sponsorTitle,
  sponsorDescription,
  sponsorLink,
  sponsorCta = "Learn More",
  showPlaceholderIfUnset = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (adClient && adSlot && adRef.current && !isLoaded.current) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        }
      } catch (err) {
        console.warn("AdSense failed to push ad unit:", err);
      }
    }
  }, [adClient, adSlot]);

  // If custom sponsor information is passed
  if (sponsorTitle && sponsorLink) {
    return (
      <aside
        id={id}
        aria-label="Advertisement"
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
            {slotLabel}
          </span>
          <span className="text-[9px] text-white/20">Ad</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium text-white/90">{sponsorTitle}</h4>
            {sponsorDescription && (
              <p className="text-xs text-white/40 mt-1 max-w-xl font-light">
                {sponsorDescription}
              </p>
            )}
          </div>
          <a
            href={sponsorLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white hover:text-black shrink-0"
          >
            {sponsorCta}
          </a>
        </div>
      </aside>
    );
  }

  // If Google AdSense is configured with active keys
  if (adClient && adSlot) {
    return (
      <aside
        id={id}
        aria-label="Advertisement"
        className={`relative my-6 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-3 text-center ${className}`}
      >
        <div className="flex items-center justify-between px-2 mb-2 text-[9px] uppercase tracking-[0.25em] text-white/20">
          <span>{slotLabel}</span>
          <span>Google Ad</span>
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle block min-h-[90px] w-full"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        />
      </aside>
    );
  }

  // Placeholder / Setup guidance box (when AdSense ID isn't provided yet)
  if (showPlaceholderIfUnset) {
    return (
      <aside
        id={id}
        aria-label="Advertisement Slot"
        className={`relative my-8 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-center transition-all ${className}`}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {slotLabel} Slot
          </span>
        </div>
        <p className="text-xs text-white/40 font-light max-w-md mx-auto">
          Ready for Google AdSense, Carbon Ads, or Direct Sponsors.
        </p>
      </aside>
    );
  }

  return null;
};
