import React from "react";
import { useCms } from "../../../context/CmsContext";
import { Save, Search, ExternalLink } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const SeoModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const settings = draft.globalSettings;

  const handleChange = (key: keyof typeof settings, val: string) => {
    updateDraft((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [key]: val,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            SEO & Social Card Metadata
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Optimize search engine ranking snippets and social media OpenGraph cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => saveDraft()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/90">
              Browser Page Title
            </label>
            <span className="text-[11px] text-[#A7B0C0]">
              {settings.browserTitle.length} chars (Optimal: 40–60)
            </span>
          </div>
          <input
            type="text"
            value={settings.browserTitle}
            onChange={(e) => handleChange("browserTitle", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/90">
              SEO Meta Description
            </label>
            <span className="text-[11px] text-[#A7B0C0]">
              {settings.seoMetaDescription.length} chars (Optimal: 120–160)
            </span>
          </div>
          <textarea
            rows={3}
            value={settings.seoMetaDescription}
            onChange={(e) => handleChange("seoMetaDescription", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Canonical Site URL
            </label>
            <input
              type="text"
              value={settings.canonicalUrl}
              onChange={(e) => handleChange("canonicalUrl", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <ImageUploader
              value={settings.ogImage}
              onChange={(val) => handleChange("ogImage", val)}
              label="OpenGraph Social Share Image"
              helperText="Upload 1200×630 image displayed when links are shared on LinkedIn, X/Twitter, or iMessage."
              aspectRatioClass="aspect-[1200/630]"
              compact={true}
            />
          </div>
        </div>

        {/* Live Search Engine Snippet Preview */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            SEARCH ENGINE RESULT PREVIEW
          </span>

          <div className="p-5 rounded-lg bg-[#080A0F] border border-white/10 space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs text-[#A7B0C0]">
              <span>{settings.canonicalUrl || "https://orgnagency.com"}</span>
            </div>
            <h4 className="text-base font-medium text-[#247BFF] hover:underline cursor-pointer">
              {settings.browserTitle}
            </h4>
            <p className="text-xs text-[#A7B0C0] leading-relaxed line-clamp-2">
              {settings.seoMetaDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
