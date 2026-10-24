import React from "react";
import { useCms } from "../../../context/CmsContext";
import { Save } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const AboutModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const about = draft.about;

  const handleFieldChange = (key: keyof typeof about, value: any) => {
    updateDraft((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [key]: value,
      },
    }));
  };

  const handlePrincipleChange = (idx: number, field: "title" | "description", val: string) => {
    updateDraft((prev) => {
      const nextPrinciples = [...prev.about.principles];
      nextPrinciples[idx] = {
        ...nextPrinciples[idx],
        [field]: val,
      };
      return {
        ...prev,
        about: {
          ...prev.about,
          principles: nextPrinciples,
        },
      };
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            About Section Editor
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Manage agency narrative, brand manifesto, and the 3 core principles.
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

      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Eyebrow Label
            </label>
            <input
              type="text"
              value={about.eyebrow}
              onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Headline Part 1
            </label>
            <input
              type="text"
              value={about.headlinePart1}
              onChange={(e) => handleFieldChange("headlinePart1", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Headline Highlight
            </label>
            <input
              type="text"
              value={about.headlineHighlight}
              onChange={(e) => handleFieldChange("headlineHighlight", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Primary Agency Story (Lead Statement)
          </label>
          <textarea
            rows={4}
            value={about.mainStory}
            onChange={(e) => handleFieldChange("mainStory", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Secondary Paragraph (Capabilities Synergy)
          </label>
          <textarea
            rows={3}
            value={about.secondaryStory}
            onChange={(e) => handleFieldChange("secondaryStory", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div>
          <ImageUploader
            value={about.studioImage}
            onChange={(val) => handleFieldChange("studioImage", val)}
            label="Studio Art Direction & About Visual"
            helperText="Upload the creative studio documentary image (recommended aspect ratio: 4:3 or 16:9)."
            aspectRatioClass="aspect-[4/3]"
          />
        </div>

        {/* Brand Principles */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            BRAND PRINCIPLES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {about.principles.map((principle, idx) => (
              <div key={principle.number} className="p-4 rounded-lg bg-[#080A0F] border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-[#247BFF] block">
                  {principle.number}
                </span>
                <input
                  type="text"
                  value={principle.title}
                  onChange={(e) => handlePrincipleChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#247BFF]"
                />
                <textarea
                  rows={4}
                  value={principle.description}
                  onChange={(e) => handlePrincipleChange(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-xs text-[#A7B0C0] focus:outline-none focus:border-[#247BFF]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
