import React, { useState } from "react";
import { useCms } from "../context/CmsContext";
import { parseYouTubeUrl } from "../utils/youtube";
import { Play, Video, Sparkles, X } from "lucide-react";

export const CompanyVideoSection: React.FC = () => {
  const { content } = useCms();
  const videoConfig = content.companyVideo;

  const [showPlaceholderDemoModal, setShowPlaceholderDemoModal] = useState<boolean>(false);

  // If set to hidden in CMS, return null
  if (!videoConfig.visible) return null;

  const parsed = parseYouTubeUrl(videoConfig.youtubeUrl);

  return (
    <section
      id="video-story"
      aria-label="Company Introduction Video"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10 overflow-hidden"
    >
      {/* Background radial blue glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#247BFF]/5 rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
              <span className="w-2 h-0.5 bg-[#247BFF]" />
              <span>{videoConfig.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
              {videoConfig.headlinePart1} <br className="hidden sm:inline" />
              <span className="text-[#247BFF]">{videoConfig.headlineHighlight}</span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#A7B0C0] leading-relaxed">
            {videoConfig.supportingCopy}
          </p>
        </div>

        {/* Video Display Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#10141D] shadow-2xl group max-w-5xl mx-auto">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#247BFF] to-transparent z-10 opacity-60" />

          {parsed.isValid && parsed.embedUrl ? (
            /* Real Embedded Video */
            <div>
              <div className="relative aspect-[16/9] w-full bg-black">
                <iframe
                  src={parsed.embedUrl}
                  title="ORGN Agency — Company Introduction Story"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Player Metadata & External Link Bar */}
              <div className="px-5 py-3 bg-[#080A0F]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#A7B0C0] font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-medium">1080p HD Video</span>
                  <span aria-hidden="true">·</span>
                  <span>ORGN Agency Media</span>
                </div>

                {parsed.directWatchUrl && (
                  <a
                    href={parsed.directWatchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#247BFF] hover:text-[#3D8BFF] font-medium transition-colors"
                  >
                    <span>Watch directly on YouTube</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Elegant Cinematic Placeholder */
            <div className="relative aspect-[16/9] w-full bg-[#080A0F] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
              <img
                src={videoConfig.thumbnailImage || "/src/assets/images/hero_orgn_cinematic_1792859878617.jpg"}
                alt="ORGN Agency — Cinematic Abstract Film Still"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[2px] transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-[#080A0F]/70 to-[#080A0F]/80" />

              <div className="relative z-10 flex flex-col items-center max-w-lg space-y-6">
                <button
                  type="button"
                  onClick={() => setShowPlaceholderDemoModal(true)}
                  className="w-20 h-20 rounded-full bg-[#247BFF] hover:bg-[#3D8BFF] active:scale-95 text-white flex items-center justify-center transition-all duration-300 shadow-2xl shadow-[#247BFF]/40 cursor-pointer group/btn"
                  aria-label="Play our story video placeholder"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5 text-white transition-transform group-hover/btn:scale-110" />
                </button>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#247BFF]">
                    ORGN CINEMA
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                    Our Story, In Motion
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7B0C0] [text-wrap:balance]">
                    Watch how we build brand velocity through original creative thinking and high-production execution.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPlaceholderDemoModal(true)}
                    className="px-6 py-2.5 rounded-sm bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-white/15 flex items-center gap-2 cursor-pointer"
                  >
                    <span>WATCH OUR STORY</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Showreel Experience Modal */}
      {showPlaceholderDemoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setShowPlaceholderDemoModal(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#10141D] border border-white/20 rounded-xl overflow-hidden p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPlaceholderDemoModal(false)}
              className="absolute top-4 right-4 p-2 text-[#A7B0C0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#247BFF]">
                <Sparkles className="w-4 h-4" />
                <span>ORGN AGENCY REEL PREVIEW</span>
              </div>
              <h4 className="text-2xl font-bold font-display text-white">
                "Not Made To Blend In" — Manifesto Reel
              </h4>
              <p className="text-sm text-[#A7B0C0] leading-relaxed">
                Our introductory video is currently in master production. When your YouTube link is configured in the CMS, the embedded player automatically renders in 16:9 high definition.
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPlaceholderDemoModal(false)}
                  className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] rounded transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
