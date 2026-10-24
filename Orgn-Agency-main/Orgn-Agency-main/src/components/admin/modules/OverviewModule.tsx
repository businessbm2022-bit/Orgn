import React, { useState, useEffect } from "react";
import { useCms } from "../../../context/CmsContext";
import {
  FolderKanban,
  Briefcase,
  Users,
  Inbox,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface OverviewModuleProps {
  onNavigateTab: (tabId: string) => void;
  onOpenPublicSite: () => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  onNavigateTab,
  onOpenPublicSite,
}) => {
  const { content, draft, hasUnsavedChanges, lastPublishedAt, lastSavedAt, publishChanges, isPublishing } = useCms();
  const [inquiryCount, setInquiryCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.inquiries) setInquiryCount(data.inquiries.length);
      })
      .catch(() => {});
  }, []);

  const publishedProjects = content.portfolio.filter((p) => p.published).length;
  const publishedClients = content.clientBrands.filter((c) => c.published).length;
  const publishedServices = content.services.filter((s) => s.published).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#247BFF] uppercase tracking-wider">
            <span>ORGN CMS CONTROL CENTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-[#A7B0C0] leading-relaxed">
            Manage public website content, publish updates in real-time, monitor incoming client briefs, and maintain brand fidelity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenPublicSite}
            className="px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {hasUnsavedChanges && (
            <button
              type="button"
              disabled={isPublishing}
              onClick={() => publishChanges()}
              className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2 transition-colors shadow-lg shadow-[#247BFF]/25"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPublishing ? "animate-spin" : ""}`} />
              <span>Publish Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Real Website Management Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab("portfolio")}
          className="p-6 rounded-xl bg-[#141923] border border-white/10 hover:border-[#247BFF]/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A7B0C0] font-mono mb-3">
            <span>PORTFOLIO PROJECTS</span>
            <FolderKanban className="w-4 h-4 text-[#247BFF]" />
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-[#247BFF] transition-colors">
            {publishedProjects}
          </div>
          <div className="mt-2 text-xs text-[#A7B0C0] flex items-center justify-between">
            <span>Total: {draft.portfolio.length} projects</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab("clients")}
          className="p-6 rounded-xl bg-[#141923] border border-white/10 hover:border-[#247BFF]/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A7B0C0] font-mono mb-3">
            <span>CLIENT BRANDS</span>
            <Users className="w-4 h-4 text-[#247BFF]" />
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-[#247BFF] transition-colors">
            {publishedClients}
          </div>
          <div className="mt-2 text-xs text-[#A7B0C0] flex items-center justify-between">
            <span>Marquee brands live</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab("services")}
          className="p-6 rounded-xl bg-[#141923] border border-white/10 hover:border-[#247BFF]/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A7B0C0] font-mono mb-3">
            <span>SERVICES ACTIVE</span>
            <Briefcase className="w-4 h-4 text-[#247BFF]" />
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-[#247BFF] transition-colors">
            {publishedServices}
          </div>
          <div className="mt-2 text-xs text-[#A7B0C0] flex items-center justify-between">
            <span>Published capabilities</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab("inquiries")}
          className="p-6 rounded-xl bg-[#141923] border border-white/10 hover:border-[#247BFF]/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-xs text-[#A7B0C0] font-mono mb-3">
            <span>RECEIVED BRIEFS</span>
            <Inbox className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-display text-white group-hover:text-emerald-400 transition-colors">
            {inquiryCount}
          </div>
          <div className="mt-2 text-xs text-[#A7B0C0] flex items-center justify-between">
            <span>Project inquiries inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Publishing Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Action Hub (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#141923] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">
              Quick Management Shortcuts
            </h3>
            <span className="text-xs text-[#A7B0C0]">Instant access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onNavigateTab("portfolio")}
              className="p-4 rounded-lg bg-[#080A0F] border border-white/5 hover:border-[#247BFF]/40 transition-colors text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded bg-white/[0.03] text-[#247BFF] group-hover:bg-[#247BFF] group-hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Add Portfolio Project</span>
                <span className="text-xs text-[#A7B0C0]">Create case study with challenge, solution & media</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("clients")}
              className="p-4 rounded-lg bg-[#080A0F] border border-white/5 hover:border-[#247BFF]/40 transition-colors text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded bg-white/[0.03] text-[#247BFF] group-hover:bg-[#247BFF] group-hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Add Client Brand</span>
                <span className="text-xs text-[#A7B0C0]">Add or customize moving logo marquee items</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("hero")}
              className="p-4 rounded-lg bg-[#080A0F] border border-white/5 hover:border-[#247BFF]/40 transition-colors text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded bg-white/[0.03] text-[#247BFF] group-hover:bg-[#247BFF] group-hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Edit Homepage Hero</span>
                <span className="text-xs text-[#A7B0C0]">Change headline, CTAs, and background art</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab("inquiries")}
              className="p-4 rounded-lg bg-[#080A0F] border border-white/5 hover:border-[#247BFF]/40 transition-colors text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded bg-white/[0.03] text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">Manage Inquiries</span>
                <span className="text-xs text-[#A7B0C0]">Review client leads, change status & export</span>
              </div>
            </button>
          </div>
        </div>

        {/* Real Publishing Status Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#141923] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-[#247BFF]">
              PUBLISHING STATUS
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LIVE</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#A7B0C0]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-medium">Last Published:</span>
                <span>{lastPublishedAt ? new Date(lastPublishedAt).toLocaleString() : "Initial deployment"}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#247BFF] shrink-0 mt-0.5" />
              <div>
                <span className="text-white block font-medium">Last Saved Draft:</span>
                <span>{lastSavedAt ? new Date(lastSavedAt).toLocaleString() : "Up to date"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[11px] text-[#A7B0C0] leading-relaxed">
              When you click <strong>Publish Changes</strong>, all updates instantly persist into the database and are served to live site visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
