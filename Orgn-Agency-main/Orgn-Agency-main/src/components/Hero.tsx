import React from "react";
import { useCms } from "../context/CmsContext";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export const Hero: React.FC = () => {
  const { content } = useCms();
  const hero = content.hero;
  const philosophy = content.globalSettings.philosophy;

  const scrollTo = (id: string) => {
    const cleanId = id.replace("#", "");
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      aria-label="Hero Section"
      className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between overflow-hidden bg-[#080A0F]"
    >
      {/* Background ambient lighting and subtle radial glows */}
      {hero.showAmbientGlow && (
        <>
          <div
            aria-hidden="true"
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#247BFF]/10 rounded-full blur-[140px] pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -top-40 right-[-10%] w-[500px] h-[500px] bg-[#3D8BFF]/5 rounded-full blur-[120px] pointer-events-none"
          />
        </>
      )}

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
          <span className="w-2 h-0.5 bg-[#247BFF]" />
          <span>{hero.eyebrow}</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-display tracking-tight leading-[1.05] text-white [text-wrap:balance] mb-8">
            {hero.headlinePart1} <br className="hidden sm:inline" />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#247BFF]">
              {hero.headlineHighlight}
            </span>
          </h1>

          {/* Supporting Copy & Action Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8 lg:col-span-7">
              <p className="text-lg sm:text-xl text-[#A7B0C0] font-light leading-relaxed [text-wrap:balance]">
                {hero.supportingCopy}
              </p>
            </div>

            <div className="md:col-span-4 lg:col-span-5 flex flex-wrap items-center gap-4 sm:justify-end">
              <button
                type="button"
                onClick={() => scrollTo(hero.primaryCtaLink)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-[0.98] transition-all duration-200 rounded-sm whitespace-nowrap shadow-xl shadow-[#247BFF]/25 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF]"
              >
                <span>{hero.primaryCtaText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo(hero.secondaryCtaLink)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white/90 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.98] transition-all duration-200 rounded-sm whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{hero.secondaryCtaText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Art-Directed Hero Media Showcase */}
        <div className="mt-14 sm:mt-18 relative rounded-xl border border-white/10 overflow-hidden bg-[#10141D] shadow-2xl group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#247BFF] to-transparent z-10 opacity-75" />

          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-h-[560px] overflow-hidden">
            <img
              src={hero.heroImage}
              alt="ORGN Agency — Sculptural obsidian chrome curves with volumetric sapphire blue lighting"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-transparent to-black/30 pointer-events-none" />

            {/* Bottom floating artistic manifesto badge */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div className="bg-[#080A0F]/80 backdrop-blur-md px-4 py-2.5 rounded-sm border border-white/10 max-w-md">
                <p className="text-xs font-mono uppercase tracking-widest text-[#247BFF] mb-0.5">
                  BRAND PHILOSOPHY
                </p>
                <p className="text-sm font-medium text-white/90">
                  {philosophy}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-3 bg-[#080A0F]/80 backdrop-blur-md px-4 py-2.5 rounded-sm border border-white/10 text-xs text-[#A7B0C0]">
                <span>Art Direction</span>
                <span aria-hidden="true">·</span>
                <span>Spatial Dynamics</span>
                <span aria-hidden="true">·</span>
                <span>Original Thought</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      {hero.showScrollIndicator && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full mt-12 flex items-center justify-between text-xs text-[#A7B0C0]/60">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#247BFF]" />
            <span className="tracking-widest uppercase text-[11px]">SCROLL TO EXPLORE</span>
          </div>
          <button
            onClick={() => scrollTo("clients")}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
            aria-label="Scroll down to client brand strip"
          >
            <span>DISCOVER</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </section>
  );
};
