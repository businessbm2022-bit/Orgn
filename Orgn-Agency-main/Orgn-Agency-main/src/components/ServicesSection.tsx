import React, { useState } from "react";
import { useCms } from "../context/CmsContext";
import { ServiceItem } from "../data/agencyData";
import {
  Palette,
  TrendingUp,
  Share2,
  Camera,
  Film,
  Layers,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const ServicesSection: React.FC = () => {
  const { content } = useCms();
  const publishedServices = content.services.filter((s) => s.published);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    publishedServices[0]?.id || "branding"
  );

  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-[#247BFF]" };
    switch (iconName) {
      case "Palette":
        return <Palette {...props} />;
      case "TrendingUp":
        return <TrendingUp {...props} />;
      case "Share2":
        return <Share2 {...props} />;
      case "Camera":
        return <Camera {...props} />;
      case "Film":
        return <Film {...props} />;
      case "Layers":
        return <Layers {...props} />;
      case "Compass":
      default:
        return <Compass {...props} />;
    }
  };

  const activeService =
    publishedServices.find((s) => s.id === selectedServiceId) ||
    publishedServices[0] ||
    content.services[0];

  return (
    <section
      id="services"
      aria-label="Services Section"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
              <span className="w-2 h-0.5 bg-[#247BFF]" />
              <span>WHAT WE DO</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
              Everything Your Brand <br className="hidden sm:inline" />
              <span className="text-[#247BFF]">Needs to Stand Out.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#A7B0C0] leading-relaxed">
            From strategic inception to campaign execution, our cross-functional capabilities deliver seamless creative continuity across all touchpoints.
          </p>
        </div>

        {/* Master Interactive Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Services Interactive List (Left Column) */}
          <div className="lg:col-span-7 space-y-3">
            {publishedServices.map((service) => {
              const isSelected = service.id === selectedServiceId;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedServiceId(service.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`w-full text-left p-6 rounded-lg transition-all duration-300 border cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF] ${
                    isSelected
                      ? "bg-[#10141D] border-[#247BFF] shadow-lg shadow-[#247BFF]/10"
                      : "bg-[#10141D]/40 border-white/10 hover:border-white/20 hover:bg-[#10141D]/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-xs font-bold text-[#247BFF] mt-1 shrink-0">
                        {service.number}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold font-display tracking-wide text-white flex items-center gap-2">
                          <span>{service.title}</span>
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-[#A7B0C0] leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 p-2 rounded bg-white/[0.03] border border-white/10 hidden sm:block">
                      {renderIcon(service.iconName)}
                    </div>
                  </div>

                  {/* Mobile inline expansion */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-white/10 lg:hidden space-y-3">
                      <p className="text-xs text-[#A7B0C0] leading-relaxed">
                        {service.fullDescription}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#247BFF]">
                        {service.deliverables.map((item, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span>·</span>
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Service Detailed Spotlight (Right Column - Desktop) */}
          {activeService && (
            <div className="hidden lg:block lg:col-span-5 sticky top-28">
              <div className="p-8 rounded-xl bg-[#10141D] border border-[#247BFF]/30 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#247BFF]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF] font-semibold">
                    CAPABILITY DEEP DIVE · {activeService.number}
                  </span>
                  <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
                    {renderIcon(activeService.iconName)}
                  </div>
                </div>

                <h4 className="text-2xl font-bold font-display text-white tracking-tight mb-4">
                  {activeService.title}
                </h4>

                <p className="text-sm text-[#A7B0C0] leading-relaxed mb-8">
                  {activeService.fullDescription}
                </p>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <p className="text-xs font-mono uppercase tracking-wider text-white/80 font-medium">
                    KEY DELIVERABLES:
                  </p>
                  <ul className="space-y-2">
                    {activeService.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-xs text-[#A7B0C0]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#247BFF] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <a
                    href="#contact"
                    className="w-full py-3 px-4 rounded-sm bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>INQUIRE ABOUT THIS SERVICE</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
