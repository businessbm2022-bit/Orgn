import React from "react";
import { useCms } from "../../../context/CmsContext";
import { Globe, Save } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const GlobalSettingsModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const settings = draft.globalSettings;

  const handleChange = (key: keyof typeof settings, value: string) => {
    updateDraft((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Global Website & Brand Settings
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Configure global brand identity, browser metadata, and design tokens.
          </p>
        </div>

        <button
          type="button"
          onClick={() => saveDraft()}
          disabled={isSaving}
          className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving Draft..." : "Save Settings"}</span>
        </button>
      </div>

      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Brand Display Name
            </label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Wordmark Logotype
            </label>
            <input
              type="text"
              value={settings.brandLogoText}
              onChange={(e) => handleChange("brandLogoText", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
            <span className="text-[11px] text-[#A7B0C0] mt-1 block">
              Rendered as: <strong>{settings.brandLogoText}</strong><span className="text-[#247BFF]">.</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Main Brand Tagline
            </label>
            <input
              type="text"
              value={settings.taglineMain}
              onChange={(e) => handleChange("taglineMain", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Supporting Tagline
            </label>
            <input
              type="text"
              value={settings.taglineSupporting}
              onChange={(e) => handleChange("taglineSupporting", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Brand Philosophy Statement
          </label>
          <input
            type="text"
            value={settings.philosophy}
            onChange={(e) => handleChange("philosophy", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Primary Accent Color (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryAccentColor || "#247BFF"}
                onChange={(e) => handleChange("primaryAccentColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-white/20 bg-transparent p-1"
              />
              <input
                type="text"
                value={settings.primaryAccentColor}
                onChange={(e) => handleChange("primaryAccentColor", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-[#247BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={settings.footerCopyrightText}
              onChange={(e) => handleChange("footerCopyrightText", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        {/* Brand Media Assets: Logo & Favicon */}
        <div className="pt-6 border-t border-white/10 space-y-6">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            BRAND MEDIA ASSETS (REAL IMAGE UPLOADS)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ImageUploader
              value={settings.logoImage || ""}
              onChange={(val) => handleChange("logoImage", val)}
              label="Website Logo Image (Optional Custom Vector/PNG)"
              helperText="Upload transparent PNG or SVG logo. Overrides default typographic 'orgn.' wordmark if provided."
              aspectRatioClass="aspect-[3/1]"
              compact={true}
            />

            <ImageUploader
              value={settings.faviconImage || ""}
              onChange={(val) => handleChange("faviconImage", val)}
              label="Browser Tab Favicon (PNG, ICO, SVG)"
              helperText="Upload 32x32 or 64x64 browser tab icon for bookmarked tabs."
              aspectRatioClass="aspect-square"
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
