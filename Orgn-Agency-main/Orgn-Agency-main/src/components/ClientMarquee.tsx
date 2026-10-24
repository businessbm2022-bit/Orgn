import React, { useState } from "react";
import { useCms } from "../context/CmsContext";
import { ClientBrand } from "../data/agencyData";
import { Info } from "lucide-react";

export const ClientMarquee: React.FC = () => {
  const { content } = useCms();
  const [showConfigNote, setShowConfigNote] = useState(false);

  const publishedBrands = content.clientBrands.filter((b) => b.published);
  const marqueeItems: ClientBrand[] = [...publishedBrands, ...publishedBrands];

  return (
    <section
      id="clients"
      aria-label="Client Brands Marquee"
      className="py-14 border-y border-white/10 bg-[#080A0F] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#247BFF] rounded-full" />
          <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A7B0C0]">
            BRANDS WE'VE WORKED WITH
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfigNote(!showConfigNote)}
            className="text-[11px] text-[#A7B0C0]/70 hover:text-[#247BFF] transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Customize Brands</span>
          </button>
        </div>
      </div>

      {showConfigNote && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-6">
          <div className="p-4 rounded-md bg-[#10141D] border border-white/10 text-xs text-[#A7B0C0] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#247BFF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                How to update client brand names and logos:
              </p>
              <p>
                Log in to the <strong>Admin Dashboard</strong> (click the copyright line in the footer) and open the <strong>Client Brands Marquee</strong> module to add, reorder, or publish brand names.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 py-3">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex items-center gap-3.5 group cursor-default transition-all duration-300 shrink-0 px-4 py-2"
            >
              {brand.logoImage ? (
                <div className="h-8 max-w-[130px] flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <img
                    src={brand.logoImage}
                    alt={brand.name}
                    className="max-h-7 max-w-full object-contain filter brightness-100"
                  />
                </div>
              ) : (
                <>
                  <div className="w-7 h-7 rounded border border-white/15 bg-white/[0.02] flex items-center justify-center text-xs font-mono font-bold text-white/50 group-hover:border-[#247BFF] group-hover:text-[#247BFF] group-hover:bg-[#247BFF]/10 transition-colors">
                    {brand.id.split("-")[1] || "01"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-display font-bold tracking-wider text-white/60 group-hover:text-white transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#A7B0C0]/50 group-hover:text-[#247BFF] transition-colors">
                      {brand.subtitle}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
