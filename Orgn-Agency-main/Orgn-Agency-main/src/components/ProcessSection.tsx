import React from "react";
import { useCms } from "../context/CmsContext";

export const ProcessSection: React.FC = () => {
  const { content } = useCms();
  const processSteps = content.process.filter((s) => s.published);

  return (
    <section
      id="process"
      aria-label="Creative Process Section"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
            <span className="w-2 h-0.5 bg-[#247BFF]" />
            <span>HOW WE WORK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
            From First Thought <br className="hidden sm:inline" />
            <span className="text-[#247BFF]">to Real Impact.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A7B0C0] leading-relaxed">
            A disciplined four-phase framework designed to eliminate guesswork and turn ambitious visions into high-performing commercial assets.
          </p>
        </div>

        {/* Process Timeline */}
        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 relative">
          <div
            aria-hidden="true"
            className="absolute top-10 left-12 right-12 h-px bg-gradient-to-r from-[#247BFF]/40 via-white/15 to-[#247BFF]/40 z-0"
          />

          {processSteps.map((step) => (
            <div
              key={step.step}
              className="relative z-10 p-6 rounded-xl bg-[#10141D] border border-white/10 hover:border-[#247BFF]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#080A0F] border border-white/20 group-hover:border-[#247BFF] group-hover:bg-[#247BFF]/10 flex items-center justify-center font-mono text-xs font-bold text-[#247BFF] mb-6 transition-colors shadow-lg">
                  {step.step}
                </div>

                <h3 className="text-lg font-bold font-display text-white tracking-wide mb-2 group-hover:text-[#247BFF] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs font-medium text-[#3D8BFF] mb-3">
                  {step.subtitle}
                </p>

                <p className="text-xs text-[#A7B0C0] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1.5">
                {step.details.map((item, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-center gap-1.5 text-[11px] text-[#A7B0C0]/80"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#247BFF]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet: Vertical timeline */}
        <div className="lg:hidden relative border-l-2 border-white/10 ml-4 pl-6 sm:pl-8 space-y-10">
          {processSteps.map((step) => (
            <div key={step.step} className="relative group">
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full bg-[#080A0F] border border-[#247BFF] flex items-center justify-center font-mono text-xs font-bold text-[#247BFF] shadow-md">
                {step.step}
              </div>

              <div className="p-6 rounded-xl bg-[#10141D] border border-white/10 space-y-3">
                <h3 className="text-lg font-bold font-display text-white">
                  {step.step} — {step.title}
                </h3>
                <p className="text-xs font-medium text-[#247BFF]">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[#A7B0C0] leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-3 border-t border-white/5 space-y-1">
                  {step.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#A7B0C0]/80"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#247BFF]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
