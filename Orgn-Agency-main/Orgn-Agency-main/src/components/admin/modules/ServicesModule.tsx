import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { ServiceItem } from "../../../data/agencyData";
import {
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Check,
  X,
  Palette,
  TrendingUp,
  Share2,
  Camera,
  Film,
  Layers,
  Compass,
} from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const ServicesModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const services = draft.services;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Available icon choices
  const iconOptions = ["Palette", "TrendingUp", "Share2", "Camera", "Film", "Layers", "Compass"];

  const handleTogglePublish = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, published: !s.published } : s
      ),
    }));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    updateDraft((prev) => {
      const next = [...prev.services];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return {
        ...prev,
        services: next.map((item, idx) => ({ ...item, order: idx })),
      };
    });
  };

  const handleDelete = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
    setDeleteConfirmId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleAddService = () => {
    const newId = `srv-${Date.now()}`;
    const nextNum = (services.length + 1).toString().padStart(2, "0");
    const newService: ServiceItem & { published: boolean; order: number } = {
      id: newId,
      number: nextNum,
      title: "NEW SERVICE TITLE",
      shortDescription: "Short description of the new service discipline.",
      fullDescription: "Comprehensive overview of the creative deliverables and methodology.",
      deliverables: ["Deliverable 01", "Deliverable 02"],
      iconName: "Palette",
      published: true,
      order: services.length,
    };

    updateDraft((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    setEditingId(newId);
  };

  const handleServiceField = (id: string, field: keyof ServiceItem, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, [field]: val } : s
      ),
    }));
  };

  const handleDeliverablesChange = (id: string, text: string) => {
    const arr = text.split("\n").filter((t) => t.trim().length > 0);
    handleServiceField(id, "deliverables", arr);
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Services & Capabilities Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Create, edit, reorder, and publish your agency's service disciplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddService}
            className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#247BFF]" />
            <span>Add Service</span>
          </button>

          <button
            type="button"
            onClick={() => saveDraft()}
            disabled={isSaving}
            className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service, idx) => {
          const isEditing = editingId === service.id;

          return (
            <div
              key={service.id}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                isEditing
                  ? "bg-[#141923] border-[#247BFF]"
                  : "bg-[#141923]/80 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-[#247BFF]">
                    {service.number}
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                      <span>{service.title}</span>
                      {!service.published && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Draft (Unpublished)
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#A7B0C0] mt-0.5 line-clamp-1">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(service.id)}
                    title={service.published ? "Unpublish Service" : "Publish Service"}
                    className={`p-2 rounded text-xs transition-colors ${
                      service.published
                        ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20"
                        : "text-[#A7B0C0] bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {service.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === services.length - 1}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : service.id)}
                    className="p-2 rounded bg-white/5 text-[#247BFF] hover:bg-[#247BFF]/10"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === service.id ? (
                    <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded border border-red-500/30">
                      <button
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        className="px-2 py-1 text-[11px] font-bold text-red-400 hover:text-white hover:bg-red-500 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-[#A7B0C0] hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(service.id)}
                      className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-red-400"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editing Form Expanded */}
              {isEditing && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Index Number</label>
                      <input
                        type="text"
                        value={service.number}
                        onChange={(e) => handleServiceField(service.id, "number", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Service Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => handleServiceField(service.id, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-bold focus:border-[#247BFF]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Icon Representation</label>
                      <select
                        value={service.iconName}
                        onChange={(e) => handleServiceField(service.id, "iconName", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      >
                        {iconOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Short Description (Grid View)</label>
                    <input
                      type="text"
                      value={service.shortDescription}
                      onChange={(e) => handleServiceField(service.id, "shortDescription", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Full Description (Capability Deep Dive)</label>
                    <textarea
                      rows={3}
                      value={service.fullDescription}
                      onChange={(e) => handleServiceField(service.id, "fullDescription", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">
                      Deliverables List (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={service.deliverables.join("\n")}
                      onChange={(e) => handleDeliverablesChange(service.id, e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <ImageUploader
                      value={service.image || ""}
                      onChange={(val) => handleServiceField(service.id, "image", val)}
                      label="Service Feature Visual / Thumbnail (Optional)"
                      helperText="Upload supporting graphic or showcase visual for this service discipline."
                      aspectRatioClass="aspect-[16/9]"
                      compact={true}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 text-xs font-semibold text-white uppercase tracking-wider"
                    >
                      Done Editing
                    </button>
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
