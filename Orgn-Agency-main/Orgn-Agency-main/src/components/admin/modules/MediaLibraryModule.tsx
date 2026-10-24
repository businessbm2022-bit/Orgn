import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export const MediaLibraryModule: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files (JPEG, PNG, WebP) are supported.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError("File size exceeds 15MB limit.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch("/api/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Data,
            filename: file.name,
            mimeType: file.type,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.asset) {
            setAssets((prev) => [data.asset, ...prev]);
          }
        } else {
          setUploadError("Failed to upload image.");
        }
      } catch {
        setUploadError("Network error during file upload.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // Handled
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Media Library & Asset Manager
          </h2>
          <p className="text-xs text-[#A7B0C0] mt-1">
            Upload, preview, and copy persistent image assets for hero backgrounds, portfolio items, and studio visuals.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-[#247BFF]/20 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload New Asset</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#141923] border border-white/10 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A7B0C0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
          />
        </div>

        <span className="text-xs text-[#A7B0C0] hidden sm:inline">
          {filteredAssets.length} asset(s)
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl bg-[#141923] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#247BFF]/40 transition-all duration-200"
          >
            <div className="aspect-[16/10] bg-black/60 overflow-hidden relative">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80">
                {formatSize(asset.fileSize)}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-white truncate font-display" title={asset.name}>
                  {asset.name}
                </p>
                <p className="text-[10px] font-mono text-[#A7B0C0] truncate mt-0.5">
                  {asset.url}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset.id, asset.url)}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs text-[#247BFF] flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="p-1.5 rounded bg-white/5 text-[#A7B0C0] hover:text-red-400 transition-colors"
                  title="Delete asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
