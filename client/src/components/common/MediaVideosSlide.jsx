import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "./NavigationSwiper";

const MediaVideo = ({ video }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("[MediaVideo] ========== DEEP LOGGING START ==========");
    console.log("[MediaVideo] Video prop received:", video);
    console.log("[MediaVideo] Video type:", typeof video);
    console.log("[MediaVideo] Video keys:", Object.keys(video || {}));
    
    if (video) {
      console.log("[MediaVideo] video.key:", video.key);
      console.log("[MediaVideo] video.name:", video.name);
      console.log("[MediaVideo] video.site:", video.site);
      console.log("[MediaVideo] video.type:", video.type);
      console.log("[MediaVideo] video.id:", video.id);
    }
  }, [video]);

  if (!video?.key) {
    const errorMsg = `No video key found. Video: ${JSON.stringify(video)}`;
    console.error("[MediaVideo] ERROR - " + errorMsg);
    return (
      <Box sx={{ height: "max-content", color: "#ff0000", textAlign: "center", p: 2, backgroundColor: "#1a1a1a", border: "2px solid #ff0000" }}>
        <Typography variant="body2">❌ Invalid video data (no key)</Typography>
        <Typography variant="caption" sx={{ color: "#ffaaaa" }}>Video object: {JSON.stringify(video)}</Typography>
      </Box>
    );
  }

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${video.key}`;
  const youtubeEmbedUrl = `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`;

  console.log("[MediaVideo] YouTube URLs built:");
  console.log("[MediaVideo]   - Watch URL:", youtubeWatchUrl);
  console.log("[MediaVideo]   - Embed URL:", youtubeEmbedUrl);

  const handleImageLoad = (e) => {
    console.log("[MediaVideo] Image loaded successfully for video:", video.key);
    console.log("[MediaVideo] Image element:", e.target);
  };

  const handleImageError = (e) => {
    const errorMsg = `Failed to load thumbnail for video ${video.key}`;
    console.error("[MediaVideo] IMAGE ERROR:", errorMsg);
    console.error("[MediaVideo] Error event:", e);
    console.error("[MediaVideo] Error details:", {
      error: e.error,
      message: e.message,
      type: e.type
    });
    setErrorMessage(errorMsg);
    setHasError(true);
  };

  const handlePlayClick = (e) => {
    try {
      console.log("[MediaVideo] Play button clicked for video:", video.key);
      console.log("[MediaVideo] Opening URL:", youtubeWatchUrl);
      const newWindow = window.open(youtubeWatchUrl, '_blank');
      if (!newWindow) {
        console.error("[MediaVideo] Failed to open window - popup may be blocked");
        setErrorMessage("Popup blocked - please allow popups");
      } else {
        console.log("[MediaVideo] Window opened successfully");
      }
    } catch (err) {
      console.error("[MediaVideo] EXCEPTION in handlePlayClick:", err);
      console.error("[MediaVideo] Exception details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setErrorMessage(err.message);
      setHasError(true);
    }
  };

  return (
    <Box sx={{ 
      height: "max-content", 
      width: "100%", 
      position: "relative",
      backgroundColor: "#222",
      borderRadius: "8px",
      overflow: "hidden"
    }}>
      <Box sx={{ 
        position: "relative", 
        width: "100%",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        backgroundColor: "#000",
        cursor: "pointer",
        backgroundImage: `url('${youtubeEmbedUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
      onError={handleImageError}
      onLoad={handleImageLoad}
      >
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          opacity: 0.9,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1
          }
        }}>
          <Button
            variant="contained"
            color="error"
            sx={{
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              minWidth: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#16A366",
              "&:hover": {
                backgroundColor: "#0d7a4a"
              }
            }}
            onClick={handlePlayClick}
            title={`Watch: ${video.name}`}
          >
            <PlayArrowIcon sx={{ fontSize: "40px" }} />
          </Button>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, backgroundColor: "#1a1a1a" }}>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
          {video.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {video.type} • {video.site || 'Unknown source'}
        </Typography>
      </Box>
      {hasError && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: "#330000", 
          color: "#ffaaaa", 
          textAlign: "center",
          border: "2px solid #ff0000"
        }}>
          <Typography variant="body2">❌ Error: {errorMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

const MediaVideosSlide = ({ videos }) => {
  console.log("[MediaVideosSlide] All videos:", videos);
  
  if (!videos || videos.length === 0) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center", color: "text.secondary" }}>
        No videos available
      </Box>
    );
  }

  // Filter to only YouTube videos
  const youtubeVideos = videos.filter(v => {
    console.log("[MediaVideosSlide] Checking video:", { site: v?.site, type: v?.type, key: v?.key });
    return v?.site === "YouTube" && v?.key;
  });

  console.log("[MediaVideosSlide] YouTube videos count:", youtubeVideos.length);

  if (youtubeVideos.length === 0) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center", color: "text.secondary" }}>
        No YouTube videos available
      </Box>
    );
  }

  return (
    <NavigationSwiper>
      {youtubeVideos.map((video, index) => (
        <SwiperSlide key={`${video.key}-${index}`}>
          <MediaVideo video={video} />
        </SwiperSlide>
      ))}
    </NavigationSwiper>
  );
};

export default MediaVideosSlide;