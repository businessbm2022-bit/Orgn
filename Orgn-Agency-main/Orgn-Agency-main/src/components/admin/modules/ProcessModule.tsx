import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { ProcessStep } from "../../../data/agencyData";
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Edit2, X } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const ProcessModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const processSteps = draft.process;

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleStepField = (index: number, field: keyof ProcessStep, val: any) => {
    updateDraft((prev) => {
      const next = [...prev.process];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, process: next };
    });
  };

  const handleDetailsChange = (index: number, text: string) => {
    const arr = text.split("\n").filter((t) => t.trim().length > 0);
    handleStepField(index, "details", arr);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= processSteps.length) return;

    updateDraft((prev) => {
      const next = [...prev.process];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return {
        ...prev,
        process: next.map((item, idx) => ({ ...item, order: idx })),
      };
    });
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Creative Process & Workflow Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Edit the agency's 4-step creative methodology and execution framework.
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

      <div className="space-y-4">
        {processSteps.map((step, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div
              key={step.step || idx}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                isEditing ? "bg-[#141923] border-[#247BFF]" : "bg-[#141923]/80 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#080A0F] border border-white/20 flex items-center justify-center font-mono text-xs font-bold text-[#247BFF]">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-display text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#3D8BFF]">{step.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === processSteps.length - 1}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(isEditing ? null : idx)}
                    className="p-2 rounded bg-white/5 text-[#247BFF] hover:bg-[#247BFF]/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-3">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Step Code (e.g. 01)</label>
                      <input
                        type="text"
                        value={step.step}
                        onChange={(e) => handleStepField(idx, "step", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
                      />
                    </div>

                    <div className="sm:col-span-9">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepField(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-bold focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Short Subtitle</label>
                    <input
                      type="text"
                      value={step.subtitle}
                      onChange={(e) => handleStepField(idx, "subtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => handleStepField(idx, "description", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">
                      Key Action Bullets (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={step.details.join("\n")}
                      onChange={(e) => handleDetailsChange(idx, e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      value={step.image || ""}
                      onChange={(val) => handleStepField(idx, "image", val)}
                      label="Process Step Diagram or Graphic (Optional)"
                      helperText="Upload supporting blueprint, workflow diagram, or visual."
                      aspectRatioClass="aspect-[16/9]"
                      compact={true}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
