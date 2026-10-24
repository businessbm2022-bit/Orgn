import React, { useState, useRef } from "react";
import {
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";
import { MediaAsset } from "./ImageUploader";

interface GalleryUploaderProps {
  images?: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
  maxImages?: number;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  images = [],
  onChange,
  label = "Project Gallery & Additional Images",
  helperText = "Upload multiple high-resolution images. Reorder or remove individual slides.",
  maxImages = 12,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openLibraryModal = async () => {
    setIsLibraryOpen(true);
    setIsLibraryLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setLibraryAssets(data.assets || []);
      }
    } catch {
      // Handled
    } finally {
      setIsLibraryLoading(false);
    }
  };

  const uploadSingleFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.size > 15 * 1024 * 1024) {
        resolve(null);
        return;
      }

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
              mimeType: file.type || "image/jpeg",
            }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data.asset?.url || null);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const files = Array.from(fileList);
    const validFiles = files.filter(
      (f) =>
        f.type.startsWith("image/") ||
        /\.(jpe?g|png|webp|gif|svg)$/i.test(f.name)
    );

    if (validFiles.length === 0) {
      setErrorMessage("No valid image files found.");
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      setErrorMessage(`Maximum of ${maxImages} gallery images allowed.`);
    }

    const availableSlots = Math.max(0, maxImages - images.length);
    const filesToUpload = validFiles.slice(0, availableSlots);

    setIsUploading(true);
    setUploadProgress({ current: 0, total: filesToUpload.length });

    const newUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      setUploadProgress({ current: i + 1, total: filesToUpload.length });
      const uploadedUrl = await uploadSingleFile(filesToUpload[i]);
      if (uploadedUrl) {
        newUrls.push(uploadedUrl);
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    } else {
      setErrorMessage("Failed to upload selected files.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const target = direction === "left" ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;

    const next = [...images];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = images.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleToggleLibraryItem = (url: string) => {
    if (images.includes(url)) {
      onChange(images.filter((item) => item !== url));
    } else {
      if (images.length >= maxImages) {
        setErrorMessage(`Maximum of ${maxImages} gallery images allowed.`);
        return;
      }
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={(e) => handleFilesSelected(e.target.files)}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-white/90">
            {label}
          </label>
          <span className="text-[11px] text-[#A7B0C0]">{helperText}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openLibraryModal}
            className="text-[11px] text-[#247BFF] hover:text-[#3D8BFF] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Select From Library</span>
          </button>

          <span className="text-white/20">|</span>

          <span className="text-[11px] font-mono text-[#A7B0C0]">
            {images.length} / {maxImages}
          </span>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {isUploading && uploadProgress && (
        <div className="p-3 rounded-lg bg-[#247BFF]/10 border border-[#247BFF]/30 text-xs text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[#247BFF] animate-spin" />
            <span>
              Uploading image {uploadProgress.current} of {uploadProgress.total}...
            </span>
          </div>
          <span className="text-xs font-mono text-[#247BFF]">
            {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="p-1 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={`${imgUrl}-${idx}`}
            className="rounded-lg border border-white/10 bg-[#080A0F] overflow-hidden group relative flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-black/60 relative overflow-hidden">
              <img
                src={imgUrl}
                alt={`Gallery Slide ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-white/90">
                #{idx + 1}
              </div>
            </div>

            {/* Reorder and Delete Controls */}
            <div className="p-2 bg-[#10141D] border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "left")}
                  disabled={idx === 0}
                  className="p-1 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                  title="Move Left"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "right")}
                  disabled={idx === images.length - 1}
                  className="p-1 rounded bg-white/5 text-[#A7B0C0] hover:text-white disabled:opacity-30"
                  title="Move Right"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add More Slot */}
        {images.length < maxImages && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-white/15 hover:border-[#247BFF]/50 bg-[#080A0F]/40 hover:bg-[#10141D] flex flex-col items-center justify-center gap-2 p-4 transition-colors cursor-pointer text-center group disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-[#247BFF]/10 text-[#247BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white font-display">Add Image</span>
            <span className="text-[10px] text-[#A7B0C0]">Upload file</span>
          </button>
        )}
      </div>

      {/* Select from Library Modal */}
      {isLibraryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsLibraryOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#10141D] border border-white/20 rounded-xl overflow-hidden p-6 sm:p-8 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Add to Gallery from Media Library</h3>
                <p className="text-xs text-[#A7B0C0] mt-0.5">
                  Click an image to toggle inclusion in this project gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 text-[#A7B0C0] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <input
                type="text"
                placeholder="Search assets by name..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isLibraryLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#247BFF] animate-spin" />
                  <span className="text-xs text-[#A7B0C0]">Loading assets...</span>
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#A7B0C0] space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-white/30" />
                  <p>No media assets available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryAssets
                    .filter((a) => a.name.toLowerCase().includes(librarySearch.toLowerCase()))
                    .map((asset) => {
                      const isIncluded = images.includes(asset.url);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => handleToggleLibraryItem(asset.url)}
                          className={`rounded-lg border overflow-hidden cursor-pointer group transition-all duration-200 relative ${
                            isIncluded
                              ? "border-[#247BFF] ring-2 ring-[#247BFF]/50 bg-[#247BFF]/10"
                              : "border-white/10 hover:border-[#247BFF]/50 bg-[#080A0F]"
                          }`}
                        >
                          <div className="aspect-[4/3] bg-black/60 overflow-hidden relative">
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isIncluded && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#247BFF] text-white flex items-center justify-center shadow-lg">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="text-xs font-semibold text-white truncate" title={asset.name}>
                              {asset.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#247BFF] hover:bg-[#3D8BFF] rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
