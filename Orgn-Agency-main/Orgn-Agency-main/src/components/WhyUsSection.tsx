import React from "react";
import { useCms } from "../context/CmsContext";
import { Sparkles, ShieldCheck, Repeat, Target } from "lucide-react";

export const WhyUsSection: React.FC = () => {
  const { content } = useCms();
  const why = content.whyOrgn;
  const publishedPoints = why.points.filter((p) => p.published);

  const getIcon = (idx: number) => {
    const props = { className: "w-5 h-5 text-[#247BFF]" };
    switch (idx) {
      case 0:
        return <Sparkles {...props} />;
      case 1:
        return <ShieldCheck {...props} />;
      case 2:
        return <Repeat {...props} />;
      case 3:
      default:
        return <Target {...props} />;
    }
  };

  return (
    <section
      id="why-orgn"
      aria-label="Why ORGN Agency"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
            <span className="w-2 h-0.5 bg-[#247BFF]" />
            <span>{why.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
            {why.headlinePart1} <br className="hidden sm:inline" />
            <span className="text-[#247BFF]">{why.headlineHighlight}</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A7B0C0] leading-relaxed">
            {why.supportingCopy}
          </p>
        </div>

        {/* 4 Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedPoints.map((item, idx) => (
            <div
              key={item.number || idx}
              className="p-8 rounded-xl bg-[#10141D] border border-white/10 hover:border-[#247BFF]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-bold text-[#247BFF]">
                    {item.number}
                  </span>
                  <div className="p-2.5 rounded bg-white/[0.03] border border-white/10 group-hover:border-[#247BFF]/30 transition-colors">
                    {getIcon(idx)}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mb-3 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[#A7B0C0] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#3D8BFF]">
                  {item.highlight}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#247BFF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
