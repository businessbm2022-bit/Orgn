import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
} from "../src/data/agencyData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const CONTENT_FILE = path.join(DATA_DIR, "orgn_content.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "orgn_inquiries.json");
const MEDIA_FILE = path.join(DATA_DIR, "orgn_media.json");

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

export interface ContentEnvelope {
  published: WebsiteContent;
  draft: WebsiteContent;
  lastUpdated: string;
  lastPublished: string;
}

export interface InquiryRecord {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  details: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// DEFAULT CONTENT GENERATOR
// ---------------------------------------------------------------------------
function getSeedContent(): WebsiteContent {
  return {
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
}

export function initContentStore(): void {
  if (!fs.existsSync(CONTENT_FILE)) {
    const seed = getSeedContent();
    const envelope: ContentEnvelope = {
      published: seed,
      draft: JSON.parse(JSON.stringify(seed)),
      lastUpdated: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
    };
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(envelope, null, 2), "utf-8");
  }

  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
  }

  if (!fs.existsSync(MEDIA_FILE)) {
    // Seed initial media assets
    const initialMedia: MediaAsset[] = [
      {
        id: "hero-cinematic",
        name: "hero_orgn_cinematic.jpg",
        url: "/src/assets/images/hero_orgn_cinematic_1792859878617.jpg",
        fileSize: 420000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "about-studio",
        name: "about_creative_direction.jpg",
        url: "/src/assets/images/about_creative_direction_1792859879679.jpg",
        fileSize: 380000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "brand-identity",
        name: "portfolio_branding_identity.jpg",
        url: "/src/assets/images/portfolio_branding_identity_1792859880781.jpg",
        fileSize: 310000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "motion-campaign",
        name: "portfolio_motion_campaign.jpg",
        url: "/src/assets/images/portfolio_motion_campaign_1792859881488.jpg",
        fileSize: 340000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "editorial-product",
        name: "portfolio_editorial_product.jpg",
        url: "/src/assets/images/portfolio_editorial_product_1792859881505.jpg",
        fileSize: 290000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(initialMedia, null, 2), "utf-8");
  }
}

export function getContentEnvelope(): ContentEnvelope {
  initContentStore();
  const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveDraftContent(draft: WebsiteContent): ContentEnvelope {
  const current = getContentEnvelope();
  current.draft = draft;
  current.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current;
}

export function publishContent(contentToPublish?: WebsiteContent): ContentEnvelope {
  const current = getContentEnvelope();
  if (contentToPublish) {
    current.draft = contentToPublish;
    current.published = JSON.parse(JSON.stringify(contentToPublish));
  } else {
    current.published = JSON.parse(JSON.stringify(current.draft));
  }
  const now = new Date().toISOString();
  current.lastUpdated = now;
  current.lastPublished = now;
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(current, null, 2), "utf-8");
  return current;
}

// ---------------------------------------------------------------------------
// INQUIRIES MANAGEMENT
// ---------------------------------------------------------------------------
export function getInquiries(): InquiryRecord[] {
  initContentStore();
  const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
  return JSON.parse(raw);
}

export function addInquiry(
  data: Omit<InquiryRecord, "id" | "status" | "createdAt" | "updatedAt">
): InquiryRecord {
  const list = getInquiries();
  const newRecord: InquiryRecord = {
    ...data,
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: "New",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  list.unshift(newRecord);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  return newRecord;
}

export function updateInquiry(
  id: string,
  patch: Partial<Pick<InquiryRecord, "status" | "internalNotes">>
): InquiryRecord | null {
  const list = getInquiries();
  const index = list.findIndex((i) => i.id === id);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  return list[index];
}

export function deleteInquiry(id: string): boolean {
  const list = getInquiries();
  const filtered = list.filter((i) => i.id !== id);
  if (filtered.length === list.length) return false;
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

// ---------------------------------------------------------------------------
// MEDIA MANAGEMENT
// ---------------------------------------------------------------------------
export function getMediaAssets(): MediaAsset[] {
  initContentStore();
  const raw = fs.readFileSync(MEDIA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function addMediaAsset(asset: Omit<MediaAsset, "id" | "createdAt">): MediaAsset {
  const list = getMediaAssets();
  const newAsset: MediaAsset = {
    ...asset,
    id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newAsset);
  fs.writeFileSync(MEDIA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return newAsset;
}

export function deleteMediaAsset(id: string): boolean {
  const list = getMediaAssets();
  const filtered = list.filter((m) => m.id !== id);
  if (filtered.length === list.length) return false;
  fs.writeFileSync(MEDIA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
