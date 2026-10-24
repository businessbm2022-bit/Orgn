import React from "react";
import { useCms } from "../context/CmsContext";
import { ArrowUpRight } from "lucide-react";

export const AboutSection: React.FC = () => {
  const { content } = useCms();
  const about = content.about;
  const philosophy = content.globalSettings.philosophy;

  return (
    <section
      id="about"
      aria-label="About ORGN Agency"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header Eyebrow & Headline */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
            <span className="w-2 h-0.5 bg-[#247BFF]" />
            <span>{about.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance] max-w-4xl">
            {about.headlinePart1} <br />
            <span className="text-[#247BFF]">{about.headlineHighlight}</span>
          </h2>
        </div>

        {/* Two-Column Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Narrative Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-xl sm:text-2xl text-white font-light leading-relaxed [text-wrap:balance]">
              {about.mainStory}
            </p>

            <p className="text-base text-[#A7B0C0] leading-relaxed">
              {about.secondaryStory}
            </p>

            <div className="pt-4">
              <a
                href="#services"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#247BFF] transition-colors group"
              >
                <span>EXPLORE OUR CAPABILITIES</span>
                <ArrowUpRight className="w-4 h-4 text-[#247BFF] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Brand Name Etymology Card */}
            <div className="mt-8 p-6 rounded-lg bg-[#10141D] border border-white/10">
              <div className="text-xs uppercase tracking-widest text-[#247BFF] font-mono mb-2">
                THE ORGN FOUNDATION
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#A7B0C0]">
                <div>
                  <span className="text-white font-semibold font-display block mb-1">
                    ORIGINAL
                  </span>
                  Original thinking, bold creativity, and distinctive ideas that command attention.
                </div>
                <div>
                  <span className="text-white font-semibold font-display block mb-1">
                    ORGANIC
                  </span>
                  Authentic communication, natural growth curves, and meaningful audience connection.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Art-Directed Studio Visual & Manifesto Frame */}
          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#10141D] group shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={about.studioImage}
                  alt="ORGN Agency — Creative team reviewing high-contrast campaign art direction in studio"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-transparent to-black/20" />

                {/* Visual Label */}
                <div className="absolute top-4 left-4 bg-[#080A0F]/80 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10 text-[11px] font-mono text-white/80">
                  CREATIVE STRATEGY LAB
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#080A0F]/85 backdrop-blur-md p-4 rounded-sm border border-white/10">
                  <p className="text-xs font-mono uppercase tracking-widest text-[#247BFF] mb-1">
                    STUDIO MANIFESTO
                  </p>
                  <p className="text-sm font-medium text-white italic">
                    "{philosophy}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Brand Principles */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A7B0C0]">
              CORE PRINCIPLES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {about.principles.map((principle) => (
              <div
                key={principle.number}
                className="p-6 rounded-lg bg-[#10141D]/50 border border-white/10 hover:border-[#247BFF]/50 transition-colors duration-300 group"
              >
                <div className="text-2xl font-mono font-bold text-[#247BFF] mb-4 group-hover:translate-x-1 transition-transform">
                  {principle.number}
                </div>
                <h3 className="text-lg font-bold font-display text-white tracking-wide mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-[#A7B0C0] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
