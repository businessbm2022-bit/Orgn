import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CmsProvider, useCms } from "./context/CmsContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ClientMarquee } from "./components/ClientMarquee";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioSection } from "./components/PortfolioSection";
import { CompanyVideoSection } from "./components/CompanyVideoSection";
import { ProcessSection } from "./components/ProcessSection";
import { WhyUsSection } from "./components/WhyUsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";

function MainWebsite() {
  const { isAuthenticated } = useAuth();
  const { content } = useCms();
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Synchronize document title with CMS
  useEffect(() => {
    if (content.globalSettings?.browserTitle) {
      document.title = content.globalSettings.browserTitle;
    }
  }, [content.globalSettings?.browserTitle]);

  // Check URL hash or query for /admin or #admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const isHashAdmin = window.location.hash === "#admin";
      const isPathAdmin = window.location.pathname === "/admin";
      const hasQueryAdmin = new URLSearchParams(window.location.search).has("admin");

      if (isHashAdmin || isPathAdmin || hasQueryAdmin) {
        if (isAuthenticated) {
          setShowAdminDashboard(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener("hashchange", checkAdminRoute);
    return () => window.removeEventListener("hashchange", checkAdminRoute);
  }, [isAuthenticated]);

  // Scroll spy
  useEffect(() => {
    const sections = ["home", "about", "services", "work", "clients", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminTrigger = () => {
    if (isAuthenticated) {
      setShowAdminDashboard(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setShowAdminDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowAdminDashboard(false);
    if (window.location.hash === "#admin") {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  if (showAdminDashboard && isAuthenticated) {
    return <AdminDashboard onCloseToPublicSite={handleCloseDashboard} />;
  }

  return (
    <div className="min-h-screen bg-[#080A0F] text-white selection:bg-[#247BFF] selection:text-white flex flex-col font-sans">
      {/* Sticky Top Navigation */}
      <Navbar activeSection={activeSection} />

      <main className="flex-1">
        {/* Section B: Hero Section */}
        <Hero />

        {/* Section C: Moving Brand Marquee */}
        <ClientMarquee />

        {/* Section D: About ORGN */}
        <AboutSection />

        {/* Section E: Services Section */}
        <ServicesSection />

        {/* Section F: Selected Work / Portfolio */}
        <PortfolioSection />

        {/* Section G: Company Introduction Video (YouTube) */}
        <CompanyVideoSection />

        {/* Section H: Creative Process */}
        <ProcessSection />

        {/* Section I: Why ORGN */}
        <WhyUsSection />

        {/* Section J: Contact & Project Inquiry */}
        <ContactSection />
      </main>

      {/* Section K: Footer with Hidden Copyright Admin Trigger */}
      <Footer onAdminTrigger={handleAdminTrigger} />

      {/* Admin Login Modal (Triggered by copyright click or #admin route) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CmsProvider>
        <MainWebsite />
      </CmsProvider>
    </AuthProvider>
  );
}
