import React from "react";
import { useCms } from "../context/CmsContext";
import { ArrowUp, ArrowUpRight } from "lucide-react";

interface FooterProps {
  onAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminTrigger }) => {
  const { content } = useCms();
  const currentYear = new Date().getFullYear();
  const settings = content.globalSettings;
  const contact = content.contact;
  const navItems = content.navigation.items.filter((i) => i.visible);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { label: "Instagram", href: contact.instagramUrl },
    { label: "LinkedIn", href: contact.linkedinUrl },
    { label: "Behance", href: contact.behanceUrl },
    { label: "Facebook", href: contact.facebookUrl },
  ];

  return (
    <footer
      aria-label="Site Footer"
      className="bg-[#080A0F] border-t border-white/10 pt-20 pb-12 relative overflow-hidden"
    >
      {/* Top subtle blue glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#247BFF]/50 to-transparent pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href="#home"
              className="inline-flex items-center text-3xl font-bold font-display tracking-tight text-white group"
              aria-label="ORGN Agency Home"
            >
              {settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt={settings.brandName}
                  className="h-8 max-w-[140px] object-contain"
                />
              ) : (
                <>
                  <span>{settings.brandLogoText}</span>
                  <span className="text-[#247BFF] transition-transform duration-300 group-hover:scale-125">
                    .
                  </span>
                </>
              )}
            </a>

            <p className="text-sm font-medium text-white/90 italic">
              "{settings.philosophy}"
            </p>

            <p className="text-xs text-[#A7B0C0] max-w-sm leading-relaxed">
              We turn bold ideas into distinctive brands, powerful campaigns, and digital experiences built to make an impact. Not made to blend in.
            </p>

            <div className="pt-2">
              <a
                href={`mailto:${contact.email}`}
                className="text-xs font-mono text-[#247BFF] hover:text-[#3D8BFF] transition-colors"
              >
                {contact.email}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A7B0C0] font-semibold block">
              NAVIGATION
            </span>
            <ul className="space-y-2.5 text-xs text-[#A7B0C0]">
              {navItems.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A7B0C0] font-semibold block">
              CAPABILITIES
            </span>
            <ul className="space-y-2 text-xs text-[#A7B0C0]">
              {content.services.filter((s) => s.published).slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-white transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A7B0C0] font-semibold block">
              CONNECT
            </span>
            <ul className="space-y-2.5 text-xs text-[#A7B0C0]">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Hidden Admin Trigger) & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A7B0C0]">
          <div className="flex items-center gap-2">
            {/* The exact copyright trigger per Master Prompt requirements */}
            <span
              onClick={onAdminTrigger}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onAdminTrigger?.();
                }
              }}
              tabIndex={0}
              role="button"
              className="cursor-pointer select-none focus:outline-none focus:text-white transition-colors"
              title="© Copyright Information"
              aria-label="Copyright ORGN Agency"
            >
              © {currentYear} {settings.footerCopyrightText}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-white/60">Independent Creative & Digital</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <div className="p-1.5 rounded bg-white/[0.04] border border-white/10 group-hover:border-[#247BFF] transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
