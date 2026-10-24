import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  FolderOpen,
  Loader2,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Link2,
} from "lucide-react";

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  width?: number;
  height?: number;
}

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatioClass?: string;
  compact?: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = "",
  onChange,
  label = "Upload Image",
  helperText = "Supports JPG, PNG, WebP, SVG up to 15MB.",
  aspectRatioClass = "aspect-[16/9]",
  compact = false,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    name?: string;
    width?: number;
    height?: number;
    size?: number;
  }>({});

  // Media library picker modal
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");

  // Manual URL fallback drawer
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState(value);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Measure existing image dimensions if url is provided
  useEffect(() => {
    if (value && value.trim()) {
      setManualUrlInput(value);
      const img = new Image();
      img.onload = () => {
        setImageMeta((prev) => ({
          ...prev,
          width: img.naturalWidth,
          height: img.naturalHeight,
        }));
      };
      img.src = value;
    } else {
      setImageMeta({});
    }
  }, [value]);

  // Open Media Library Modal
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
      // Ignored
    } finally {
      setIsLibraryLoading(false);
    }
  };

  const validateAndUpload = async (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    const hasValidExt = /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);

    if (!validMimes.includes(file.type) && !hasValidExt) {
      setErrorMessage("Invalid file format. Please upload a JPG, PNG, WebP, GIF, or SVG image.");
      return;
    }

    // 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File exceeds 15MB size limit. Please choose a smaller image.");
      return;
    }

    setIsUploading(true);

    try {
      // Calculate dimensions before upload
      let naturalWidth: number | undefined;
      let naturalHeight: number | undefined;

      if (file.type !== "image/svg+xml") {
        try {
          const tempUrl = URL.createObjectURL(file);
          const probeImg = new Image();
          await new Promise<void>((resolve) => {
            probeImg.onload = () => {
              naturalWidth = probeImg.naturalWidth;
              naturalHeight = probeImg.naturalHeight;
              URL.revokeObjectURL(tempUrl);
              resolve();
            };
            probeImg.onerror = () => {
              URL.revokeObjectURL(tempUrl);
              resolve();
            };
            probeImg.src = tempUrl;
          });
        } catch {
          // Dim extraction is optional
        }
      }

      // Read file to Base64
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
              width: naturalWidth,
              height: naturalHeight,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            setErrorMessage(errData.message || "Upload failed. Please try again.");
            return;
          }

          const data = await res.json();
          if (data.asset && data.asset.url) {
            setImageMeta({
              name: file.name,
              width: naturalWidth,
              height: naturalHeight,
              size: file.size,
            });
            onChange(data.asset.url);
          } else {
            setErrorMessage("Unexpected response from server upload.");
          }
        } catch (err: any) {
          setErrorMessage(err.message || "Network error during upload.");
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };

      reader.onerror = () => {
        setErrorMessage("Could not read image file from disk.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate file upload.");
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange("");
    setImageMeta({});
    setErrorMessage(null);
  };

  const handleSelectFromLibrary = (asset: MediaAsset) => {
    onChange(asset.url);
    setImageMeta({
      name: asset.name,
      width: asset.width,
      height: asset.height,
      size: asset.fileSize,
    });
    setIsLibraryOpen(false);
  };

  const handleApplyManualUrl = () => {
    if (manualUrlInput.trim()) {
      onChange(manualUrlInput.trim());
      setShowUrlFallback(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileName = (url: string) => {
    if (imageMeta.name) return imageMeta.name;
    try {
      const parts = url.split("/");
      return parts[parts.length - 1] || "Uploaded Image";
    } catch {
      return "Uploaded Image";
    }
  };

  const hasImage = Boolean(value && value.trim());

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Hidden File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Label and Top Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase tracking-wider text-white/90">
          {label}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openLibraryModal}
            className="text-[11px] text-[#247BFF] hover:text-[#3D8BFF] font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Media Library</span>
          </button>

          <span className="text-white/20">|</span>

          <button
            type="button"
            onClick={() => setShowUrlFallback(!showUrlFallback)}
            className="text-[11px] text-[#A7B0C0] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{showUrlFallback ? "Hide URL" : "Paste URL"}</span>
          </button>
        </div>
      </div>

      {/* Manual URL input fallback if requested */}
      {showUrlFallback && (
        <div className="p-3 rounded-lg bg-[#080A0F] border border-white/10 flex items-center gap-2 animate-fade-in">
          <input
            type="text"
            placeholder="Paste image URL (e.g. /uploads/image.jpg or https://...)"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded bg-[#10141D] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#247BFF]"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-1.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Apply
          </button>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {hasImage ? (
        /* Preview Card */
        <div className="rounded-xl border border-white/15 bg-[#080A0F] overflow-hidden group/card relative">
          <div className={`relative ${aspectRatioClass} w-full overflow-hidden bg-black/60 flex items-center justify-center`}>
            <img
              src={value}
              alt="Asset Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-102"
              onError={() => {
                setErrorMessage("Unable to render image preview from the current path.");
              }}
            />

            {/* Quick action overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-between p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>

                <button
                  type="button"
                  onClick={openLibraryModal}
                  className="px-3 py-1.5 rounded bg-black/70 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Library</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Live Upload Progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#247BFF] animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-white">
                  Uploading to server...
                </span>
              </div>
            )}
          </div>

          {/* Image Details Bar */}
          <div className="px-4 py-3 bg-[#10141D] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate max-w-sm">
              <ImageIcon className="w-3.5 h-3.5 text-[#247BFF] shrink-0" />
              <span className="text-white font-medium truncate font-mono text-[11px]" title={value}>
                {getFileName(value)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#A7B0C0] font-mono shrink-0">
              {imageMeta.width && imageMeta.height && (
                <span>
                  {imageMeta.width} × {imageMeta.height} px
                </span>
              )}
              {imageMeta.size && <span>{formatFileSize(imageMeta.size)}</span>}
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-400 hover:text-red-300 transition-colors ml-1"
                title="Remove image"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
            isDragOver
              ? "border-[#247BFF] bg-[#247BFF]/10 scale-[1.01]"
              : "border-white/15 hover:border-[#247BFF]/50 bg-[#080A0F]/50 hover:bg-[#10141D]"
          } ${compact ? "py-6" : "py-10"}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#247BFF] animate-spin" />
              <p className="text-sm font-medium text-white font-display">Uploading Image...</p>
              <p className="text-xs text-[#A7B0C0]">Storing permanently in server uploads folder</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#247BFF]/10 border border-[#247BFF]/30 flex items-center justify-center text-[#247BFF] group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-white font-display">
                    Click to upload
                  </span>
                  <span className="text-xs text-[#A7B0C0]">or drag & drop</span>
                </div>
                <p className="text-xs text-[#A7B0C0] mt-1">{helperText}</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <span className="px-4 py-2 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-[#247BFF]/20">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLibraryModal();
                  }}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#247BFF]" />
                  <span>Media Library</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Media Library Picker Modal */}
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
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Select from Media Library</h3>
                <p className="text-xs text-[#A7B0C0] mt-0.5">
                  Pick an existing image from your server uploads or upload a new file.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 text-[#A7B0C0] hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Upload New */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search assets by name..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 rounded bg-[#080A0F] border border-white/15 text-xs text-white focus:outline-none focus:border-[#247BFF]"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded bg-[#247BFF] hover:bg-[#3D8BFF] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Asset</span>
              </button>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {isLibraryLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#247BFF] animate-spin" />
                  <span className="text-xs text-[#A7B0C0]">Loading assets...</span>
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#A7B0C0] space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-white/30" />
                  <p>No media assets uploaded yet.</p>
                  <p className="text-[11px] text-[#A7B0C0]/70">
                    Upload an image directly using the button above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryAssets
                    .filter((a) =>
                      a.name.toLowerCase().includes(librarySearch.toLowerCase())
                    )
                    .map((asset) => {
                      const isSelected = value === asset.url;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => handleSelectFromLibrary(asset)}
                          className={`rounded-lg border overflow-hidden cursor-pointer group transition-all duration-200 relative ${
                            isSelected
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
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#247BFF] text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="text-xs font-semibold text-white truncate" title={asset.name}>
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-[#A7B0C0] font-mono mt-0.5">
                              {formatFileSize(asset.fileSize)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
