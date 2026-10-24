import React from "react";
import { useCms } from "../../../context/CmsContext";
import { Sparkles, Save, Eye } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const HeroModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const hero = draft.hero;

  const handleChange = (key: keyof typeof hero, value: any) => {
    updateDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Homepage Hero Editor
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Customize the primary headline, call to actions, and cinematic artwork.
          </p>
        </div>

        <button
          type="button"
          onClick={() => saveDraft()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Introductory Eyebrow Label
          </label>
          <input
            type="text"
            value={hero.eyebrow}
            onChange={(e) => handleChange("eyebrow", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Headline (Main Leading Line)
            </label>
            <input
              type="text"
              value={hero.headlinePart1}
              onChange={(e) => handleChange("headlinePart1", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Highlighted Word(s) (Electric Blue Gradient)
            </label>
            <input
              type="text"
              value={hero.headlineHighlight}
              onChange={(e) => handleChange("headlineHighlight", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Supporting Description Copy
          </label>
          <textarea
            rows={3}
            value={hero.supportingCopy}
            onChange={(e) => handleChange("supportingCopy", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        {/* CTAs */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
              PRIMARY CTA (SOLID BLUE)
            </span>
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Button Label</label>
              <input
                type="text"
                value={hero.primaryCtaText}
                onChange={(e) => handleChange("primaryCtaText", e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Destination Target</label>
              <input
                type="text"
                value={hero.primaryCtaLink}
                onChange={(e) => handleChange("primaryCtaLink", e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#247BFF]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-white/80 block font-semibold">
              SECONDARY CTA (OUTLINE GHOST)
            </span>
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Button Label</label>
              <input
                type="text"
                value={hero.secondaryCtaText}
                onChange={(e) => handleChange("secondaryCtaText", e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Destination Target</label>
              <input
                type="text"
                value={hero.secondaryCtaLink}
                onChange={(e) => handleChange("secondaryCtaLink", e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#247BFF]"
              />
            </div>
          </div>
        </div>

        {/* Hero Cinematic Artwork */}
        <div className="pt-4 border-t border-white/10">
          <ImageUploader
            value={hero.heroImage}
            onChange={(val) => handleChange("heroImage", val)}
            label="Hero Cinematic Artwork & Background"
            helperText="Upload your primary hero banner (JPEG, PNG, WebP up to 15MB). Recommended ratio: 21:9 or 16:9."
            aspectRatioClass="aspect-[21/9]"
          />
        </div>

        {/* Toggles */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-6 text-xs text-[#A7B0C0]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hero.showAmbientGlow}
              onChange={(e) => handleChange("showAmbientGlow", e.target.checked)}
              className="rounded bg-[#080A0F] border-white/20 text-[#247BFF] focus:ring-0"
            />
            <span>Render ambient blue radial backdrop glow</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hero.showScrollIndicator}
              onChange={(e) => handleChange("showScrollIndicator", e.target.checked)}
              className="rounded bg-[#080A0F] border-white/20 text-[#247BFF] focus:ring-0"
            />
            <span>Render bottom scroll down indicator</span>
          </label>
        </div>
      </div>
    </div>
  );
};
