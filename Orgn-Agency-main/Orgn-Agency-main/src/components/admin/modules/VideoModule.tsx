import React, { useState } from "react";
import { useCms } from "../../../context/CmsContext";
import { parseYouTubeUrl } from "../../../utils/youtube";
import {
  Video,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Trash2,
  ExternalLink,
  Check,
  RotateCcw,
} from "lucide-react";
import { ImageUploader } from "../ImageUploader";

export const VideoModule: React.FC = () => {
  const { draft, updateDraft, saveDraft, publishChanges, isSaving, isPublishing } = useCms();
  const video = draft.companyVideo;

  const [inputUrl, setInputUrl] = useState(video.youtubeUrl);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const parsed = parseYouTubeUrl(inputUrl);

  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    updateDraft((prev) => ({
      ...prev,
      companyVideo: {
        ...prev.companyVideo,
        youtubeUrl: val,
      },
    }));
  };

  const handleFieldChange = (key: keyof typeof video, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      companyVideo: {
        ...prev.companyVideo,
        [key]: val,
      },
    }));
  };

  const handleRemoveVideo = () => {
    setInputUrl("");
    updateDraft((prev) => ({
      ...prev,
      companyVideo: {
        ...prev.companyVideo,
        youtubeUrl: "",
      },
    }));
    setSuccessBanner("Video URL removed. Cinematic placeholder mode restored.");
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleSaveOnly = async () => {
    const ok = await saveDraft();
    if (ok) {
      setSuccessBanner("Draft saved successfully!");
      setTimeout(() => setSuccessBanner(null), 3500);
    }
  };

  const handleSaveAndPublish = async () => {
    const ok = await publishChanges();
    if (ok) {
      setSuccessBanner("Video configuration saved & published live to the public website!");
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Company Video & Story Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Configure the agency promotional video, YouTube embed source, and custom poster artwork.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={isSaving || isPublishing}
            className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer border border-white/15 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={isSaving || isPublishing}
            className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#247BFF]/25 disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing..." : "Save & Publish Video"}</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      <div className="p-8 rounded-xl bg-[#141923] border border-white/10 space-y-6">
        {/* Section visibility toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-[#080A0F] border border-white/10">
          <div>
            <span className="text-sm font-bold text-white block">
              Section Visibility
            </span>
            <span className="text-xs text-[#A7B0C0]">
              Toggle whether the company video section appears on the public website.
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleFieldChange("visible", !video.visible)}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${
              video.visible
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-white/5 text-[#A7B0C0] border border-white/10"
            }`}
          >
            {video.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{video.visible ? "Visible" : "Hidden"}</span>
          </button>
        </div>

        {/* YouTube URL input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/90">
              YouTube Video URL
            </label>
            {inputUrl && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Video</span>
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/... or shorts"
              value={inputUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-4 py-3 rounded bg-[#080A0F] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#247BFF]"
            />
          </div>

          {/* Validation Feedback */}
          {parsed.isValid ? (
            <div className="flex items-center justify-between text-xs text-emerald-400 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid YouTube video detected (Video ID: {parsed.videoId})</span>
              </div>
              {parsed.directWatchUrl && (
                <a
                  href={parsed.directWatchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#247BFF] hover:underline flex items-center gap-1"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#A7B0C0] pt-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#247BFF]" />
              <span>
                {inputUrl.includes("PASTE_YOUR_YOUTUBE_LINK") || !inputUrl.trim()
                  ? "Placeholder mode active — displays cinematic 'Our Story, In Motion' placeholder."
                  : "Invalid YouTube URL format. Standard watch, share (youtu.be), shorts, and embed links are supported."}
              </span>
            </div>
          )}
        </div>

        {/* Real Live Video Embed Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#247BFF]">
              LIVE 16:9 EMBED PREVIEW
            </label>
            {parsed.isValid && (
              <span className="text-[11px] font-mono text-[#A7B0C0]">
                Playable inline · 16:9 HD Player
              </span>
            )}
          </div>

          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center relative shadow-2xl">
            {parsed.isValid && parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title="Admin Preview Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 space-y-3 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#247BFF]">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-display text-white font-bold">
                    Cinematic Placeholder Mode Active
                  </p>
                  <p className="text-xs text-[#A7B0C0] max-w-sm mx-auto mt-1">
                    Paste any YouTube link above to preview and embed the 16:9 player on your public website.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Video Thumbnail / Poster Image Uploader */}
        <div className="pt-4 border-t border-white/10">
          <ImageUploader
            value={video.thumbnailImage || ""}
            onChange={(val) => handleFieldChange("thumbnailImage", val)}
            label="Custom Video Poster / Thumbnail Artwork"
            helperText="Upload a high-resolution poster artwork for the video section (JPEG, PNG, WebP up to 15MB)."
            aspectRatioClass="aspect-[16/9]"
          />
        </div>

        {/* Section Typography */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#247BFF] block font-semibold">
            SECTION COPY & HEADINGS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Eyebrow Label</label>
              <input
                type="text"
                value={video.eyebrow}
                onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Headline Part 1</label>
              <input
                type="text"
                value={video.headlinePart1}
                onChange={(e) => handleFieldChange("headlinePart1", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A7B0C0] mb-1">Headline Highlight</label>
              <input
                type="text"
                value={video.headlineHighlight}
                onChange={(e) => handleFieldChange("headlineHighlight", e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A7B0C0] mb-1">Supporting Description</label>
            <textarea
              rows={2}
              value={video.supportingCopy}
              onChange={(e) => handleFieldChange("supportingCopy", e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:border-[#247BFF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
