import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { ClientBrand } from "../../../data/agencyData";
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Edit2, X, Play } from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const ClientsModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const clients = draft.clientBrands;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleTogglePublish = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      clientBrands: prev.clientBrands.map((c) =>
        c.id === id ? { ...c, published: !c.published } : c
      ),
    }));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clients.length) return;

    updateDraft((prev) => {
      const next = [...prev.clientBrands];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return {
        ...prev,
        clientBrands: next.map((item, idx) => ({ ...item, order: idx })),
      };
    });
  };

  const handleDelete = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      clientBrands: prev.clientBrands.filter((c) => c.id !== id),
    }));
    setDeleteConfirmId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleAddNew = () => {
    const nextIdx = clients.length + 1;
    const newId = `client-${nextIdx.toString().padStart(2, "0")}`;
    const newBrand: ClientBrand & { published: boolean; order: number } = {
      id: newId,
      name: `CLIENT BRAND ${nextIdx.toString().padStart(2, "0")}`,
      subtitle: "Industry Sector",
      symbol: "BRAND SYMBOL",
      published: true,
      order: clients.length,
    };

    updateDraft((prev) => ({
      ...prev,
      clientBrands: [...prev.clientBrands, newBrand],
    }));
    setEditingId(newId);
  };

  const handleField = (id: string, field: keyof ClientBrand, val: string) => {
    updateDraft((prev) => ({
      ...prev,
      clientBrands: prev.clientBrands.map((c) =>
        c.id === id ? { ...c, [field]: val } : c
      ),
    }));
  };

  const publishedBrands = clients.filter((c) => c.published);

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Client Brands & Marquee Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Manage the brand names and logotypes featured in the continuous moving marquee strip.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#247BFF]" />
            <span>Add Brand</span>
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

      {/* Live Marquee Preview Strip */}
      <div className="p-6 rounded-xl bg-[#141923] border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs text-[#A7B0C0]">
          <span className="font-mono text-[#247BFF] uppercase tracking-wider flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" />
            LIVE MARQUEE PREVIEW ({publishedBrands.length} Brands Published)
          </span>
          <span>Hover to pause</span>
        </div>

        <div className="overflow-hidden border border-white/5 rounded-lg bg-[#080A0F] py-3">
          <div className="animate-marquee flex items-center gap-8 px-4">
            {[...publishedBrands, ...publishedBrands].map((b, i) => (
              <div key={`${b.id}-${i}`} className="flex items-center gap-3 shrink-0">
                <span className="w-6 h-6 rounded border border-white/20 bg-white/5 flex items-center justify-center font-mono text-[10px] text-white/50">
                  {b.id.split("-")[1] || "01"}
                </span>
                <span className="font-display font-bold text-xs text-white/80 whitespace-nowrap">
                  {b.name}
                </span>
                <span className="text-[10px] text-[#A7B0C0]/50 whitespace-nowrap">
                  ({b.subtitle})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands List */}
      <div className="space-y-3">
        {clients.map((brand, idx) => {
          const isEditing = editingId === brand.id;

          return (
            <div
              key={brand.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                isEditing
                  ? "bg-[#141923] border-[#247BFF]"
                  : "bg-[#141923]/80 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded border border-white/10 bg-black/40 flex items-center justify-center font-mono text-xs text-[#247BFF] shrink-0">
                    {idx + 1}
                  </span>
                  {brand.logoImage && (
                    <div className="w-12 h-7 rounded bg-black/50 border border-white/10 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={brand.logoImage} alt={brand.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-bold font-display text-white">
                      {brand.name}
                    </span>
                    <span className="text-xs text-[#A7B0C0] ml-2">
                      · {brand.subtitle}
                    </span>
                    {!brand.published && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 ml-2">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(brand.id)}
                    className={`p-2 rounded text-xs ${
                      brand.published ? "text-emerald-400 bg-emerald-400/10" : "text-[#A7B0C0] bg-white/5"
                    }`}
                  >
                    {brand.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

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
                    disabled={idx === clients.length - 1}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : brand.id)}
                    className="p-2 rounded bg-white/5 text-[#247BFF] hover:bg-[#247BFF]/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === brand.id ? (
                    <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded border border-red-500/30">
                      <button
                        type="button"
                        onClick={() => handleDelete(brand.id)}
                        className="px-2 py-1 text-[11px] font-bold text-red-400 hover:text-white hover:bg-red-500 rounded"
                      >
                        Delete
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
                      onClick={() => setDeleteConfirmId(brand.id)}
                      className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#A7B0C0] mb-1">Brand Name Label</label>
                      <input
                        type="text"
                        value={brand.name}
                        onChange={(e) => handleField(brand.id, "name", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#A7B0C0] mb-1">Subtitle / Category</label>
                      <input
                        type="text"
                        value={brand.subtitle}
                        onChange={(e) => handleField(brand.id, "subtitle", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      value={brand.logoImage || ""}
                      onChange={(val) => handleField(brand.id, "logoImage", val)}
                      label="Client Brand Logo Image (SVG, PNG, WebP)"
                      helperText="Upload transparent vector logo or white monochrome brand icon."
                      aspectRatioClass="aspect-[4/1]"
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
