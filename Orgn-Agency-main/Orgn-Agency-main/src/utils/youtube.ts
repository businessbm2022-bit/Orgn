/**
 * Safe YouTube URL parser and embed generator
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */

export interface YouTubeParseResult {
  isValid: boolean;
  videoId: string | null;
  embedUrl: string | null;
  directWatchUrl: string | null;
  reason?: string;
}

export function parseYouTubeUrl(inputUrl?: string | null): YouTubeParseResult {
  if (!inputUrl || typeof inputUrl !== "string") {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      directWatchUrl: null,
      reason: "No URL provided",
    };
  }

  const trimmed = inputUrl.trim();

  // Check if it's the default unconfigured placeholder
  if (
    trimmed === "" ||
    trimmed === "PASTE_YOUR_YOUTUBE_LINK_HERE" ||
    trimmed.includes("YOUR_YOUTUBE_LINK")
  ) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      directWatchUrl: null,
      reason: "Placeholder value detected",
    };
  }

  try {
    // 1. Check for standard youtu.be shortlinks
    const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (youtuBeMatch && youtuBeMatch[1]) {
      const id = youtuBeMatch[1];
      return {
        isValid: true,
        videoId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
        directWatchUrl: `https://www.youtube.com/watch?v=${id}`,
      };
    }

    // 2. Check for youtube.com/embed/
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch && embedMatch[1]) {
      const id = embedMatch[1];
      return {
        isValid: true,
        videoId: id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
        directWatchUrl: `https://www.youtube.com/watch?v=${id}`,
      };
    }

    // 3. Check for standard youtube.com/watch?v=...
    const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (urlObj.hostname.includes("youtube.com")) {
      const v = urlObj.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return {
          isValid: true,
          videoId: v,
          embedUrl: `https://www.youtube-nocookie.com/embed/${v}?rel=0&modestbranding=1`,
          directWatchUrl: `https://www.youtube.com/watch?v=${v}`,
        };
      }

      // Check /shorts/
      const shortsMatch = urlObj.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch && shortsMatch[1]) {
        const id = shortsMatch[1];
        return {
          isValid: true,
          videoId: id,
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
          directWatchUrl: `https://www.youtube.com/watch?v=${id}`,
        };
      }
    }
  } catch {
    // URL parsing failed
  }

  return {
    isValid: false,
    videoId: null,
    embedUrl: null,
    directWatchUrl: null,
    reason: "Invalid YouTube URL format",
  };
}
