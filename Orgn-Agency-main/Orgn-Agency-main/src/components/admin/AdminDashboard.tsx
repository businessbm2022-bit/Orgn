import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCms } from "../../context/CmsContext";
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  Users,
  Briefcase,
  FolderKanban,
  Video,
  GitMerge,
  Award,
  Phone,
  Inbox,
  Menu as MenuIcon,
  Search,
  ExternalLink,
  Save,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
  Check,
  ChevronRight,
  X,
  Navigation,
} from "lucide-react";

// Modules
import { OverviewModule } from "./modules/OverviewModule";
import { GlobalSettingsModule } from "./modules/GlobalSettingsModule";
import { HeroModule } from "./modules/HeroModule";
import { AboutModule } from "./modules/AboutModule";
import { ServicesModule } from "./modules/ServicesModule";
import { PortfolioModule } from "./modules/PortfolioModule";
import { ClientsModule } from "./modules/ClientsModule";
import { VideoModule } from "./modules/VideoModule";
import { ProcessModule } from "./modules/ProcessModule";
import { WhyOrgnModule } from "./modules/WhyOrgnModule";
import { ContactModule } from "./modules/ContactModule";
import { InquiriesModule } from "./modules/InquiriesModule";
import { NavFooterModule } from "./modules/NavFooterModule";
import { SeoModule } from "./modules/SeoModule";
import { MediaLibraryModule } from "./modules/MediaLibraryModule";
import { SecurityModule } from "./modules/SecurityModule";

interface AdminDashboardProps {
  onCloseToPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCloseToPublicSite }) => {
  const { user, logout } = useAuth();
  const {
    saveDraft,
    publishChanges,
    hasUnsavedChanges,
    isSaving,
    isPublishing,
    revertDraft,
  } = useCms();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveDraft = async () => {
    const ok = await saveDraft();
    if (ok) showToast("Draft saved successfully!");
  };

  const handlePublish = async () => {
    const ok = await publishChanges();
    if (ok) showToast("Website published successfully! Changes are live.");
  };

  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "global", label: "Global Brand Settings", icon: Globe },
    { id: "hero", label: "Homepage / Hero", icon: Sparkles },
    { id: "about", label: "About & Principles", icon: Users },
    { id: "services", label: "Services Manager", icon: Briefcase },
    { id: "portfolio", label: "Portfolio & Projects", icon: FolderKanban },
    { id: "clients", label: "Client Brands Marquee", icon: Users },
    { id: "video", label: "Company Video", icon: Video },
    { id: "process", label: "Creative Process", icon: GitMerge },
    { id: "why", label: "Why ORGN Advantages", icon: Award },
    { id: "contact", label: "Contact Information", icon: Phone },
    { id: "inquiries", label: "Project Inquiries", icon: Inbox },
    { id: "nav-footer", label: "Navigation & Footer", icon: Navigation },
    { id: "seo", label: "SEO & Social Sharing", icon: Search },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "security", label: "Admin Security & Password", icon: ShieldCheck },
  ];

  const currentTabItem = navItems.find((n) => n.id === activeTab) || navItems[0];

  const renderActiveModule = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewModule
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPublicSite={onCloseToPublicSite}
          />
        );
      case "global":
        return <GlobalSettingsModule />;
      case "hero":
        return <HeroModule />;
      case "about":
        return <AboutModule />;
      case "services":
        return <ServicesModule />;
      case "portfolio":
        return <PortfolioModule />;
      case "clients":
        return <ClientsModule />;
      case "video":
        return <VideoModule />;
      case "process":
        return <ProcessModule />;
      case "why":
        return <WhyOrgnModule />;
      case "contact":
        return <ContactModule />;
      case "inquiries":
        return <InquiriesModule />;
      case "nav-footer":
        return <NavFooterModule />;
      case "seo":
        return <SeoModule />;
      case "media":
        return <MediaLibraryModule />;
      case "security":
        return <SecurityModule />;
      default:
        return <OverviewModule onNavigateTab={setActiveTab} onOpenPublicSite={onCloseToPublicSite} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1119] text-white flex overflow-hidden font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-[#247BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-2xl animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar (#080A0F) */}
      <aside className="hidden lg:flex w-64 bg-[#080A0F] border-r border-white/10 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center text-xl font-bold font-display tracking-tight text-white">
              <span>orgn</span>
              <span className="text-[#247BFF]">.</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A7B0C0] ml-3">
                CMS
              </span>
            </div>
          </div>

          {/* Navigation Item Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-none">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#A7B0C0]/60 px-3 py-2">
              WEBSITE MODULES
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-[#247BFF] text-white shadow-md shadow-[#247BFF]/20 font-semibold"
                      : "text-[#A7B0C0] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#A7B0C0]"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer User Profile & Logout */}
          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#A7B0C0]">
              <span className="font-mono text-white/90 truncate max-w-[120px]">
                {user?.username || "Administrator"}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-[11px]"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onCloseToPublicSite}
              className="w-full py-2 px-3 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#247BFF]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 bg-[#080A0F] border-r border-white/10 flex flex-col justify-between h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xl font-bold font-display text-white">
                  orgn<span className="text-[#247BFF]">.</span> CMS
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#A7B0C0] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs text-left ${
                        isActive
                          ? "bg-[#247BFF] text-white font-semibold"
                          : "text-[#A7B0C0] hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={onCloseToPublicSite}
                className="w-full py-2 px-3 rounded bg-white/5 text-white text-xs flex items-center justify-center gap-2"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#247BFF]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Area (#0D1119) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar Header */}
        <header className="h-16 bg-[#080A0F] border-b border-white/10 px-6 sm:px-8 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
              aria-label="Open CMS navigation menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#A7B0C0]">
              <span className="hidden sm:inline">Admin CMS</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="text-white font-semibold">{currentTabItem.label}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={revertDraft}
                className="text-xs text-[#A7B0C0] hover:text-white px-3 py-1.5 rounded"
              >
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#247BFF]" />
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 sm:px-5 py-2 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-[#247BFF]/25"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPublishing ? "animate-spin" : ""}`} />
              <span>{isPublishing ? "Publishing..." : "Publish Live"}</span>
            </button>
          </div>
        </header>

        {/* Content Workspace Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#0D1119]">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};
