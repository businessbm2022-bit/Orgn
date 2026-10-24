import React, { useState, useMemo } from "react";
import { useCms } from "../../../context/CmsContext";
import { PortfolioProject, PortfolioCategory } from "../../../data/agencyData";
import {
  Plus,
  Save,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Search,
  Check,
  X,
  Star,
  ExternalLink,
} from "lucide-react";
import { ImageUploader } from "../ImageUploader";
import { GalleryUploader } from "../GalleryUploader";

export const PortfolioModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, isSaving } = useCms();
  const projects = draft.portfolio;

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories: PortfolioCategory[] = [
    "Branding",
    "Social Media",
    "Paid Advertising",
    "Video & Motion",
    "Photography",
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        categoryFilter === "All" || p.category === categoryFilter;

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && p.published) ||
        (statusFilter === "Draft" && !p.published);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [projects, searchQuery, categoryFilter, statusFilter]);

  const handleTogglePublish = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) =>
        p.id === id ? { ...p, published: !p.published } : p
      ),
    }));
  };

  const handleToggleFeatured = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      ),
    }));
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((p) => p.id === id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    updateDraft((prev) => {
      const next = [...prev.portfolio];
      const temp = next[currentIndex];
      next[currentIndex] = next[targetIndex];
      next[targetIndex] = temp;
      return {
        ...prev,
        portfolio: next.map((item, idx) => ({ ...item, order: idx })),
      };
    });
  };

  const handleDuplicate = (id: string) => {
    const source = projects.find((p) => p.id === id);
    if (!source) return;

    const newId = `proj-${Date.now()}`;
    const duplicated: PortfolioProject & { published: boolean; order: number } = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      published: false,
      order: projects.length,
    };

    updateDraft((prev) => ({
      ...prev,
      portfolio: [...prev.portfolio, duplicated],
    }));
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((p) => p.id !== id),
    }));
    setDeleteConfirmId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleAddNew = () => {
    const newId = `proj-${Date.now()}`;
    const newProject: PortfolioProject & { published: boolean; order: number } = {
      id: newId,
      title: "New Agency Project Title",
      client: "Sample Client — Industry Category",
      category: "Branding",
      categoryLabel: "Brand Identity & Art Direction",
      coverImage: "/src/assets/images/hero_orgn_cinematic_1792859878617.jpg",
      shortDescription: "Concise summary of the project transformation and outcome.",
      summary: "Detailed narrative detailing the project inception and creative execution.",
      challenge: "The commercial challenge or brand friction that prompted this project.",
      solution: "Our bespoke strategic solution and creative execution framework.",
      deliverables: ["Visual Identity System", "Creative Direction", "Campaign Assets"],
      year: new Date().getFullYear().toString(),
      featured: false,
      published: true,
      order: projects.length,
    };

    updateDraft((prev) => ({
      ...prev,
      portfolio: [newProject, ...prev.portfolio],
    }));
    setEditingId(newId);
  };

  const handleProjectField = (id: string, field: keyof PortfolioProject, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((p) =>
        p.id === id ? { ...p, [field]: val } : p
      ),
    }));
  };

  const handleDeliverablesChange = (id: string, text: string) => {
    const arr = text.split("\n").filter((t) => t.trim().length > 0);
    handleProjectField(id, "deliverables", arr);
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Portfolio & Projects Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Manage agency case studies, deliverables, imagery, and filter categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#247BFF]" />
            <span>Add Project</span>
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

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#141923] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A7B0C0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const isEditing = editingId === project.id;

          return (
            <div
              key={project.id}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                isEditing
                  ? "bg-[#141923] border-[#247BFF]"
                  : "bg-[#141923]/80 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Row summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-12 rounded overflow-hidden bg-black/40 border border-white/10 shrink-0">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-display text-white">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#247BFF]/10 text-[#247BFF] border border-[#247BFF]/30 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Featured
                        </span>
                      )}
                      {!project.published && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#A7B0C0] mt-1">
                      <span>{project.client}</span>
                      <span>·</span>
                      <span className="text-[#247BFF]">{project.category}</span>
                      <span>·</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(project.id)}
                    title={project.featured ? "Remove from featured" : "Mark as featured"}
                    className={`p-2 rounded text-xs transition-colors ${
                      project.featured
                        ? "text-[#247BFF] bg-[#247BFF]/10"
                        : "text-[#A7B0C0] bg-white/5 hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project.id)}
                    title={project.published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded text-xs transition-colors ${
                      project.published
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-[#A7B0C0] bg-white/5 hover:text-white"
                    }`}
                  >
                    {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(project.id, "up")}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(project.id, "down")}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(project.id)}
                    className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-white"
                    title="Duplicate Project"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : project.id)}
                    className="p-2 rounded bg-white/5 text-[#247BFF] hover:bg-[#247BFF]/10"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === project.id ? (
                    <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded border border-red-500/30">
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
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
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 rounded bg-white/5 text-[#A7B0C0] hover:text-red-400"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Edit form expanded */}
              {isEditing && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-6">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Project Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleProjectField(project.id, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-bold focus:border-[#247BFF]"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Client or Brand Name</label>
                      <input
                        type="text"
                        value={project.client}
                        onChange={(e) => handleProjectField(project.id, "client", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-4">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Filter Category</label>
                      <select
                        value={project.category}
                        onChange={(e) => handleProjectField(project.id, "category", e.target.value as PortfolioCategory)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Category Subtitle / Badge</label>
                      <input
                        type="text"
                        value={project.categoryLabel}
                        onChange={(e) => handleProjectField(project.id, "categoryLabel", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs text-[#A7B0C0] mb-1">Year</label>
                      <input
                        type="text"
                        value={project.year}
                        onChange={(e) => handleProjectField(project.id, "year", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ImageUploader
                      value={project.coverImage}
                      onChange={(val) => handleProjectField(project.id, "coverImage", val)}
                      label="Project Cover Image"
                      helperText="Upload the primary hero/thumbnail visual for this portfolio item (aspect ratio: 16:9 or 4:3)."
                      aspectRatioClass="aspect-[16/10]"
                    />

                    <GalleryUploader
                      images={project.galleryImages || []}
                      onChange={(gallery) => handleProjectField(project.id, "galleryImages", gallery)}
                      label="Project Gallery Slides & Multi-Image Showcase"
                      helperText="Upload multiple case study images, lookbooks, or detail captures. Reorder or remove at any time."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Short Description (Card Teaser)</label>
                    <input
                      type="text"
                      value={project.shortDescription}
                      onChange={(e) => handleProjectField(project.id, "shortDescription", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">Full Case Study Summary</label>
                    <textarea
                      rows={3}
                      value={project.summary}
                      onChange={(e) => handleProjectField(project.id, "summary", e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#A7B0C0] mb-1">The Challenge</label>
                      <textarea
                        rows={3}
                        value={project.challenge}
                        onChange={(e) => handleProjectField(project.id, "challenge", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#A7B0C0] mb-1">The Strategy & Execution</label>
                      <textarea
                        rows={3}
                        value={project.solution}
                        onChange={(e) => handleProjectField(project.id, "solution", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#A7B0C0] mb-1">
                      Deliverables (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={project.deliverables.join("\n")}
                      onChange={(e) => handleDeliverablesChange(project.id, e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:border-[#247BFF]"
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
