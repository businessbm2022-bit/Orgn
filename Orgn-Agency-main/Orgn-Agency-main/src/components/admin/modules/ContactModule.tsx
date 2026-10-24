import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

export const ContactModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const contact = draft.contact;

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFieldChange = (key: keyof typeof contact, val: string) => {
    setValidationError(null);
    updateDraft((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: val,
      },
    }));
  };

  const handleSave = () => {
    // Validate email
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setValidationError("Please enter a valid contact email format.");
      return;
    }
    saveDraft();
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Contact & Social Channels Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Update primary contact emails, WhatsApp studio line, social handles, and studio presence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {validationError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        {/* Contact Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Primary Contact Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              WhatsApp Studio Number
            </label>
            <input
              type="text"
              placeholder="+1 (555) 234-5678"
              value={contact.whatsappNumber}
              onChange={(e) => handleFieldChange("whatsappNumber", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
              Studio Location Descriptor
            </label>
            <input
              type="text"
              value={contact.studioLocation}
              onChange={(e) => handleFieldChange("studioLocation", e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90 mb-2">
            Working Hours
          </label>
          <input
            type="text"
            value={contact.workingHours}
            onChange={(e) => handleFieldChange("workingHours", e.target.value)}
            className="w-full px-4 py-2.5 rounded bg-[#080A0F] border border-white/15 text-sm text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        {/* Social Channels */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            SOCIAL MEDIA CHANNELS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Instagram URL</label>
              <input
                type="text"
                value={contact.instagramUrl}
                onChange={(e) => handleFieldChange("instagramUrl", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={contact.linkedinUrl}
                onChange={(e) => handleFieldChange("linkedinUrl", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Behance URL</label>
              <input
                type="text"
                value={contact.behanceUrl}
                onChange={(e) => handleFieldChange("behanceUrl", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Facebook URL</label>
              <input
                type="text"
                value={contact.facebookUrl}
                onChange={(e) => handleFieldChange("facebookUrl", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>
          </div>
        </div>

        {/* Contact Section Copy */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-white/90 block font-semibold">
            CONTACT SECTION COPY
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Headline Part 1</label>
              <input
                type="text"
                value={contact.headlinePart1}
                onChange={(e) => handleFieldChange("headlinePart1", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Headline Highlight</label>
              <input
                type="text"
                value={contact.headlineHighlight}
                onChange={(e) => handleFieldChange("headlineHighlight", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1">Supporting Description</label>
            <input
              type="text"
              value={contact.supportingCopy}
              onChange={(e) => handleFieldChange("supportingCopy", e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
