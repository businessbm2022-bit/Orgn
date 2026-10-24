import React, { useState, useEffect } from "react";
import { useCms } from "../context/CmsContext";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection = "home" }) => {
  const { content } = useCms();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = content.navigation.items.filter((item) => item.visible);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080A0F]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark / Custom Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center text-2xl font-bold font-display tracking-tighter text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF] rounded"
            aria-label="ORGN Agency Home"
          >
            {content.globalSettings.logoImage ? (
              <img
                src={content.globalSettings.logoImage}
                alt={content.globalSettings.brandName}
                className="h-8 max-w-[140px] object-contain"
              />
            ) : (
              <>
                <span>{content.globalSettings.brandLogoText}</span>
                <span className="text-[#247BFF] transition-transform duration-300 group-hover:scale-125">
                  .
                </span>
              </>
            )}
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A7B0C0]"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 transition-colors duration-200 whitespace-nowrap shrink-0 hover:text-white ${
                    isActive ? "text-white font-semibold" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#247BFF] rounded-full"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary CTA */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-[0.98] transition-all duration-200 rounded-sm whitespace-nowrap shrink-0 shadow-lg shadow-[#247BFF]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#247BFF] focus-visible:ring-offset-[#080A0F]"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A7B0C0] hover:text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 bg-[#080A0F]/95 backdrop-blur-xl md:hidden pt-24 px-8 pb-10 flex flex-col justify-between"
        >
          <div className="flex flex-col space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#247BFF] font-semibold">
              NAVIGATION
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-2xl font-display font-semibold text-white/90 hover:text-[#247BFF] transition-colors py-1 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-5 h-5 text-white/30" />
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-4">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="w-full py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] rounded-sm transition-colors text-center"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <div className="text-xs text-[#A7B0C0] text-center pt-2">
              {content.globalSettings.philosophy}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
