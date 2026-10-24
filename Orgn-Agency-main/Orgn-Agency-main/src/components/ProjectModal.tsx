import React, { useEffect } from "react";
import { PortfolioProject } from "../data/agencyData";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onStartProject: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onStartProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#10141D] border border-white/15 rounded-xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#080A0F]/80 text-[#A7B0C0] hover:text-white border border-white/10 hover:border-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#247BFF]"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Media Container */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#080A0F]">
          <img
            src={project.coverImage}
            alt={`${project.title} — ${project.client}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10141D] via-transparent to-black/30" />

          {/* Unboxed category & metadata */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs font-mono text-white/90">
            <span className="text-[#247BFF] font-semibold">{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            <span aria-hidden="true">·</span>
            <span className="text-white/60">{project.client}</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-10 space-y-8">
          <div>
            <h3
              id="project-modal-title"
              className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight mb-3"
            >
              {project.title}
            </h3>
            <p className="text-base text-[#A7B0C0] leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="p-5 rounded-lg bg-[#080A0F]/60 border border-white/5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF] block mb-2 font-semibold">
                THE CHALLENGE
              </span>
              <p className="text-sm text-[#A7B0C0] leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#080A0F]/60 border border-white/5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF] block mb-2 font-semibold">
                THE STRATEGY & EXECUTION
              </span>
              <p className="text-sm text-[#A7B0C0] leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables Delivered */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <span className="text-xs font-mono uppercase tracking-widest text-white/80 block font-medium">
              SCOPE & DELIVERABLES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#A7B0C0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#247BFF] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Gallery & Additional Media Showcase */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF] block font-semibold">
                  CASE STUDY GALLERY & ART DIRECTION
                </span>
                <span className="text-[11px] font-mono text-[#A7B0C0]">
                  {project.galleryImages.length} visual(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border border-white/10 bg-[#080A0F] aspect-[16/10] group/img"
                  >
                    <img
                      src={img}
                      alt={`${project.title} detail ${idx + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover/img:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white/80">
                      0{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#A7B0C0]">
              Interested in a similar approach for your brand?
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartProject();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] rounded-sm transition-colors cursor-pointer"
            >
              <span>INQUIRE ABOUT THIS PROJECT TYPE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
