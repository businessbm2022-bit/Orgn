import React, { useState, useMemo } from "react";
import { useCms } from "../context/CmsContext";
import { PortfolioCategory, PortfolioProject } from "../data/agencyData";
import { ArrowUpRight } from "lucide-react";
import { ProjectModal } from "./ProjectModal";

export const PortfolioSection: React.FC = () => {
  const { content } = useCms();
  const publishedProjects = content.portfolio.filter((p) => p.published);

  const [activeCategory, setActiveCategory] = useState<string>("All Projects");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Dynamically derive categories present in published projects
  const categories = useMemo(() => {
    const defaultCats = [
      "All Projects",
      "Branding",
      "Social Media",
      "Paid Advertising",
      "Video & Motion",
      "Photography",
    ];
    return defaultCats;
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All Projects") return publishedProjects;
    return publishedProjects.filter((p) => p.category === activeCategory);
  }, [publishedProjects, activeCategory]);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="work"
      aria-label="Selected Projects Portfolio"
      className="py-24 sm:py-32 bg-[#080A0F] relative border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] font-medium text-[#247BFF]">
              <span className="w-2 h-0.5 bg-[#247BFF]" />
              <span>SELECTED PROJECTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-white [text-wrap:balance]">
              Proof Lives <br className="hidden sm:inline" />
              <span className="text-[#247BFF]">in the Work.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#A7B0C0] leading-relaxed">
            Every project begins with a bespoke creative hypothesis and ends with a commercially validated, culturally distinctive result.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#10141D] rounded-lg border border-white/10 overflow-x-auto mb-12 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#247BFF] text-white shadow-sm font-semibold"
                    : "text-[#A7B0C0] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {filteredProjects.map((project, idx) => {
            const isWide = idx % 3 === 0;
            const colSpanClass = isWide ? "lg:col-span-8" : "lg:col-span-4";

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`${colSpanClass} group cursor-pointer`}
              >
                <div className="rounded-xl border border-white/10 bg-[#10141D] overflow-hidden transition-all duration-500 hover:border-[#247BFF]/50 hover:shadow-2xl hover:shadow-[#247BFF]/10 flex flex-col h-full">
                  {/* Card Media Container */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#080A0F]">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10141D] via-transparent to-transparent opacity-80" />

                    {/* Hover Action Corner */}
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-[#080A0F]/70 text-white/70 group-hover:text-white group-hover:bg-[#247BFF] transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    {/* Unboxed Metadata on Card */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <div className="flex items-center gap-2">
                        <span className="text-[#247BFF] font-mono text-[11px] font-semibold">
                          {project.category.toUpperCase()}
                        </span>
                        <span aria-hidden="true" className="text-white/40">·</span>
                        <span className="text-white/70">{project.year}</span>
                      </div>
                      <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                        View Project
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                      <span className="text-xs text-[#A7B0C0] font-mono block mb-1">
                        {project.client}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#247BFF] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#A7B0C0] leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Unboxed deliverables preview */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#A7B0C0]/70">
                      {project.deliverables.slice(0, 3).map((deliv, dIdx) => (
                        <span key={dIdx} className="flex items-center gap-1.5">
                          {dIdx > 0 && <span aria-hidden="true">·</span>}
                          <span>{deliv}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state fallback */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-base text-white">No published projects found in this category.</p>
            <p className="text-xs text-[#A7B0C0] mt-1">
              Add new projects directly in the CMS dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onStartProject={scrollToContact}
      />
    </section>
  );
};
