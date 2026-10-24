import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  AGENCY_CONFIG,
  CLIENT_BRANDS,
  SERVICES,
  PORTFOLIO_PROJECTS,
  BRAND_PRINCIPLES,
  PROCESS_STEPS,
  WHY_ORGN_POINTS,
  ClientBrand,
  ServiceItem,
  PortfolioProject,
  BrandPrinciple,
  ProcessStep,
  WhyOrgnItem,
} from "../data/agencyData";

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  text: string;
  published: boolean;
  order: number;
  portraitImage?: string;
  rating?: number;
}

export interface WebsiteContent {
  globalSettings: {
    brandName: string;
    brandLogoText: string;
    taglineMain: string;
    taglineSupporting: string;
    philosophy: string;
    browserTitle: string;
    seoMetaDescription: string;
    canonicalUrl: string;
    ogImage: string;
    footerCopyrightText: string;
    primaryAccentColor: string;
    secondaryBgColor: string;
    logoImage?: string;
    faviconImage?: string;
  };
  hero: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    supportingCopy: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    heroImage: string;
    showAmbientGlow: boolean;
    showScrollIndicator: boolean;
  };
  about: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    mainStory: string;
    secondaryStory: string;
    studioImage: string;
    principles: BrandPrinciple[];
  };
  services: (ServiceItem & { published: boolean; order: number })[];
  portfolio: (PortfolioProject & { published: boolean; order: number })[];
  clientBrands: (ClientBrand & { published: boolean; order: number })[];
  companyVideo: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    supportingCopy: string;
    youtubeUrl: string;
    visible: boolean;
    thumbnailImage?: string;
  };
  process: (ProcessStep & { published: boolean; order: number })[];
  whyOrgn: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    supportingCopy: string;
    points: (WhyOrgnItem & { published: boolean; order: number })[];
  };
  testimonials: TestimonialItem[];
  contact: {
    eyebrow: string;
    headlinePart1: string;
    headlineHighlight: string;
    supportingCopy: string;
    email: string;
    whatsappNumber: string;
    phone: string;
    instagramUrl: string;
    facebookUrl: string;
    linkedinUrl: string;
    behanceUrl: string;
    studioLocation: string;
    workingHours: string;
  };
  navigation: {
    items: { id: string; label: string; href: string; visible: boolean; order: number }[];
    footerLinks: { id: string; label: string; href: string }[];
  };
}

const defaultSeedContent: WebsiteContent = {
  globalSettings: {
    brandName: AGENCY_CONFIG.brandName,
    brandLogoText: AGENCY_CONFIG.brandLogoText,
    taglineMain: AGENCY_CONFIG.taglineMain,
    taglineSupporting: AGENCY_CONFIG.taglineSupporting,
    philosophy: AGENCY_CONFIG.philosophy,
    browserTitle: "ORGN Agency – Not Made To Blend In | Creative Advertising & Digital Marketing",
    seoMetaDescription:
      "ORGN is an independent creative advertising and digital marketing agency. Original ideas, organic growth, bold brand experiences, and performance campaigns built to make an impact.",
    canonicalUrl: "https://orgnagency.com",
    ogImage: "/src/assets/images/hero_orgn_cinematic_1792859878617.jpg",
    footerCopyrightText: "ORGN Agency. All rights reserved.",
    primaryAccentColor: "#247BFF",
    secondaryBgColor: "#10141D",
  },
  hero: {
    eyebrow: AGENCY_CONFIG.introEyebrow,
    headlinePart1: "NOT MADE TO",
    headlineHighlight: "BLEND IN.",
    supportingCopy: AGENCY_CONFIG.introDescription,
    primaryCtaText: "EXPLORE OUR WORK",
    primaryCtaLink: "#work",
    secondaryCtaText: "LET'S TALK",
    secondaryCtaLink: "#contact",
    heroImage: "/src/assets/images/hero_orgn_cinematic_1792859878617.jpg",
    showAmbientGlow: true,
    showScrollIndicator: true,
  },
  about: {
    eyebrow: "WHO WE ARE",
    headlinePart1: "Original Thinking.",
    headlineHighlight: "Organic Impact.",
    mainStory: AGENCY_CONFIG.aboutStory,
    secondaryStory: AGENCY_CONFIG.aboutSecondary,
    studioImage: "/src/assets/images/about_creative_direction_1792859879679.jpg",
    principles: BRAND_PRINCIPLES,
  },
  services: SERVICES.map((s, idx) => ({ ...s, published: true, order: idx })),
  portfolio: PORTFOLIO_PROJECTS.map((p, idx) => ({ ...p, published: true, order: idx })),
  clientBrands: CLIENT_BRANDS.map((c, idx) => ({ ...c, published: true, order: idx })),
  companyVideo: {
    eyebrow: "MEET ORGN",
    headlinePart1: "Get to Know",
    headlineHighlight: "Our World.",
    supportingCopy:
      "A closer look at our mindset, our creative process, and the ideas behind the work we create.",
    youtubeUrl: AGENCY_CONFIG.COMPANY_VIDEO_URL,
    visible: true,
  },
  process: PROCESS_STEPS.map((step, idx) => ({ ...step, published: true, order: idx })),
  whyOrgn: {
    eyebrow: "THE ORGN ADVANTAGE",
    headlinePart1: "Creativity With",
    headlineHighlight: "a Clear Purpose.",
    supportingCopy:
      "We are built to be an agile, senior-led creative partner for founders and brands that value distinction over conformity.",
    points: WHY_ORGN_POINTS.map((pt, idx) => ({ ...pt, published: true, order: idx })),
  },
  testimonials: [],
  contact: {
    eyebrow: "START A PROJECT",
    headlinePart1: "Got a Brand Worth",
    headlineHighlight: "Talking About?",
    supportingCopy: "Tell us what you're building. Let's create something that stands out.",
    email: AGENCY_CONFIG.CONTACT_EMAIL,
    whatsappNumber: AGENCY_CONFIG.WHATSAPP_NUMBER,
    phone: "+1 (555) 234-5678",
    instagramUrl: AGENCY_CONFIG.INSTAGRAM_URL,
    facebookUrl: AGENCY_CONFIG.FACEBOOK_URL,
    linkedinUrl: AGENCY_CONFIG.LINKEDIN_URL,
    behanceUrl: AGENCY_CONFIG.BEHANCE_URL,
    studioLocation: AGENCY_CONFIG.studioLocation,
    workingHours: AGENCY_CONFIG.workingHours,
  },
  navigation: {
    items: [
      { id: "home", label: "Home", href: "#home", visible: true, order: 0 },
      { id: "about", label: "About", href: "#about", visible: true, order: 1 },
      { id: "services", label: "Services", href: "#services", visible: true, order: 2 },
      { id: "work", label: "Our Work", href: "#work", visible: true, order: 3 },
      { id: "clients", label: "Clients", href: "#clients", visible: true, order: 4 },
      { id: "contact", label: "Contact", href: "#contact", visible: true, order: 5 },
    ],
    footerLinks: [
      { id: "nav-home", label: "Home", href: "#home" },
      { id: "nav-about", label: "About", href: "#about" },
      { id: "nav-services", label: "Services", href: "#services" },
      { id: "nav-work", label: "Our Work", href: "#work" },
      { id: "nav-clients", label: "Clients", href: "#clients" },
      { id: "nav-contact", label: "Contact", href: "#contact" },
    ],
  },
};

interface CmsContextType {
  content: WebsiteContent;
  draft: WebsiteContent;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastSavedAt: string | null;
  lastPublishedAt: string | null;
  hasUnsavedChanges: boolean;
  updateDraft: (updater: (prev: WebsiteContent) => WebsiteContent) => void;
  saveDraft: () => Promise<boolean>;
  publishChanges: (customPayload?: WebsiteContent) => Promise<boolean>;
  revertDraft: () => void;
  refreshContent: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent>(defaultSeedContent);
  const [draft, setDraft] = useState<WebsiteContent>(defaultSeedContent);
  const [originalDraft, setOriginalDraft] = useState<WebsiteContent>(defaultSeedContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Load content from server
  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content?mode=draft");
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          const publishedData = data.published || data.content;
          setContent(publishedData);
          setDraft(data.content);
          setOriginalDraft(JSON.parse(JSON.stringify(data.content)));
          setLastSavedAt(data.lastUpdated || null);
          setLastPublishedAt(data.lastPublished || null);
        }
      }
    } catch {
      // Fallback preserves initial seed content
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Initial Load & Multi-Tab BroadcastChannel Setup
  useEffect(() => {
    refreshContent();

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("orgn_cms_realtime_sync");
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
          if (event.data?.type === "CONTENT_PUBLISHED" && event.data.published) {
            setContent(event.data.published);
            if (event.data.lastPublished) setLastPublishedAt(event.data.lastPublished);
          }
        };
      } catch {
        // BroadcastChannel optional fallback
      }
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [refreshContent]);

  // 2. Real-Time Server-Sent Events (SSE) Listener for Instant Public Website Sync
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const setupStream = () => {
      try {
        eventSource = new EventSource("/api/content/stream");

        eventSource.addEventListener("content_update", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            if (data.published) {
              setContent(data.published);
              if (data.lastPublished) setLastPublishedAt(data.lastPublished);
              if (data.lastUpdated) setLastSavedAt(data.lastUpdated);
            }
          } catch (err) {
            console.error("Failed to parse SSE payload", err);
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect with backoff
          reconnectTimeout = setTimeout(setupStream, 3000);
        };
      } catch {
        reconnectTimeout = setTimeout(setupStream, 5000);
      }
    };

    setupStream();

    // 3. Fallback interval polling (every 6 seconds if window visible) & on focus
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetch("/api/content")
          .then((res) => res.json())
          .then((data) => {
            if (data.content) {
              setContent(data.content);
              if (data.lastPublished) setLastPublishedAt(data.lastPublished);
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener("focus", handleVisibility);
    document.addEventListener("visibilitychange", handleVisibility);

    const pollingInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetch("/api/content")
          .then((res) => res.json())
          .then((data) => {
            if (data.content) {
              setContent((prev) => {
                // Only update if serialized content changed to avoid unnecessary renders
                if (JSON.stringify(prev) !== JSON.stringify(data.content)) {
                  return data.content;
                }
                return prev;
              });
              if (data.lastPublished) setLastPublishedAt(data.lastPublished);
            }
          })
          .catch(() => {});
      }
    }, 6000);

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollingInterval);
      window.removeEventListener("focus", handleVisibility);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const updateDraft = (updater: (prev: WebsiteContent) => WebsiteContent) => {
    setDraft((prev) => updater(prev));
  };

  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(originalDraft);

  const saveDraft = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content/draft", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      if (res.ok) {
        const data = await res.json();
        setOriginalDraft(JSON.parse(JSON.stringify(draft)));
        setLastSavedAt(data.envelope?.lastUpdated || new Date().toISOString());
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishChanges = async (customPayload?: WebsiteContent): Promise<boolean> => {
    setIsPublishing(true);
    const payload = customPayload || draft;
    try {
      const res = await fetch("/api/content/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      });
      if (res.ok) {
        const data = await res.json();
        const publishedPayload = JSON.parse(JSON.stringify(payload));
        setContent(publishedPayload);
        setDraft(publishedPayload);
        setOriginalDraft(publishedPayload);
        const publishedTime = data.envelope?.lastPublished || new Date().toISOString();
        setLastPublishedAt(publishedTime);
        setLastSavedAt(data.envelope?.lastUpdated || publishedTime);

        // Notify local tabs immediately via BroadcastChannel
        if (broadcastChannelRef.current) {
          try {
            broadcastChannelRef.current.postMessage({
              type: "CONTENT_PUBLISHED",
              published: publishedPayload,
              lastPublished: publishedTime,
            });
          } catch {
            // Ignore channel post errors
          }
        }

        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  const revertDraft = () => {
    setDraft(JSON.parse(JSON.stringify(originalDraft)));
  };

  return (
    <CmsContext.Provider
      value={{
        content,
        draft,
        isLoading,
        isSaving,
        isPublishing,
        lastSavedAt,
        lastPublishedAt,
        hasUnsavedChanges,
        updateDraft,
        saveDraft,
        publishChanges,
        revertDraft,
        refreshContent,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
};
