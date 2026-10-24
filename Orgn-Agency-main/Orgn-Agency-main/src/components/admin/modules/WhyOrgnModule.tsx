import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { WhyOrgnItem } from "../../../data/agencyData";
import { Save, Edit2 } from "lucide-react";

export const WhyOrgnModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const why = draft.whyOrgn;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleHeaderField = (key: keyof typeof why, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      whyOrgn: {
        ...prev.whyOrgn,
        [key]: val,
      },
    }));
  };

  const handlePointField = (idx: number, field: keyof WhyOrgnItem, val: string) => {
    updateDraft((prev) => {
      const nextPoints = [...prev.whyOrgn.points];
      nextPoints[idx] = { ...nextPoints[idx], [field]: val };
      return {
        ...prev,
        whyOrgn: {
          ...prev.whyOrgn,
          points: nextPoints,
        },
      };
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Why ORGN & Strategic Advantages
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Customize the 4 core differentiators and value proposition statements.
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1">Eyebrow Label</label>
            <input
              type="text"
              value={why.eyebrow}
              onChange={(e) => handleHeaderField("eyebrow", e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1">Headline Part 1</label>
            <input
              type="text"
              value={why.headlinePart1}
              onChange={(e) => handleHeaderField("headlinePart1", e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1">Headline Highlight</label>
            <input
              type="text"
              value={why.headlineHighlight}
              onChange={(e) => handleHeaderField("headlineHighlight", e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#A7B0C0] mb-1">Supporting Copy</label>
          <textarea
            rows={2}
            value={why.supportingCopy}
            onChange={(e) => handleHeaderField("supportingCopy", e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
          />
        </div>

        {/* 4 Differentiators */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            THE 4 STRATEGIC DIFFERENTIATORS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {why.points.map((pt, idx) => (
              <div
                key={pt.number || idx}
                className="p-5 rounded-lg bg-[#080A0F] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#247BFF]">
                    {pt.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                    className="p-1 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={pt.title}
                  onChange={(e) => handlePointField(idx, "title", e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-xs font-bold text-white focus:border-[#247BFF]"
                />

                <textarea
                  rows={3}
                  value={pt.description}
                  onChange={(e) => handlePointField(idx, "description", e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-xs text-[#A7B0C0] focus:border-[#247BFF]"
                />

                <input
                  type="text"
                  placeholder="Key highlight label..."
                  value={pt.highlight}
                  onChange={(e) => handlePointField(idx, "highlight", e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-[#10141D] border border-white/15 text-[11px] font-mono text-[#3D8BFF] focus:border-[#247BFF]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
