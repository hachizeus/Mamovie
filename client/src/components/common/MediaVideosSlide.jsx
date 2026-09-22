import { Box, Typography, Button, Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "./NavigationSwiper";

const MediaVideo = ({ video }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
  const youtubeIframeUrl = `https://www.youtube.com/embed/${video.key}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`;

  console.log("[MediaVideo] YouTube URLs built:");
  console.log("[MediaVideo]   - Watch URL:", youtubeWatchUrl);
  console.log("[MediaVideo]   - Embed URL:", youtubeEmbedUrl);
  console.log("[MediaVideo]   - Iframe URL:", youtubeIframeUrl);

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
      console.log("[MediaVideo] Opening modal with video:", video.name);
      setModalOpen(true);
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

  const handleCloseModal = () => {
    console.log("[MediaVideo] Closing modal for video:", video.key);
    setModalOpen(false);
  };

  return (
    <>
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

      {/* Video Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300
        }}
      >
        <Box sx={{
          position: "relative",
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.9)"
        }}>
          {/* Close Button */}
          <Button
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              backgroundColor: "#16A366",
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              minWidth: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "#0d7a4a"
              }
            }}
            title="Close"
          >
            <CloseIcon />
          </Button>

          {/* Video Title */}
          <Box sx={{ p: 2, backgroundColor: "#1a1a1a", borderBottom: "1px solid #333" }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
              {video.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#999" }}>
              {video.type} • {video.site}
            </Typography>
          </Box>

          {/* YouTube Iframe */}
          <Box sx={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%",
            backgroundColor: "#000"
          }}>
            <iframe
              key={video.key}
              src={youtubeIframeUrl}
              title={video.name || video.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                display: "block"
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => console.log("[MediaVideo] Modal iframe loaded for video:", video.key)}
              onError={(e) => {
                console.error("[MediaVideo] Modal iframe error:", e);
                console.error("[MediaVideo] Error for video:", video.key);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const MediaVideosSlide = ({ videos }) => {
  console.log("[MediaVideosSlide] ========== CONTAINER DEEP LOGGING START ==========");
  console.log("[MediaVideosSlide] Videos prop received:", videos);
  console.log("[MediaVideosSlide] Videos type:", typeof videos);
  console.log("[MediaVideosSlide] Videos is array:", Array.isArray(videos));
  console.log("[MediaVideosSlide] Videos length:", videos?.length);
  
  if (videos && Array.isArray(videos)) {
    console.log("[MediaVideosSlide] First video object:", videos[0]);
    console.log("[MediaVideosSlide] All videos details:");
    videos.forEach((v, idx) => {
      console.log(`[MediaVideosSlide]   [${idx}] key=${v?.key}, site=${v?.site}, type=${v?.type}, name=${v?.name}`);
    });
  }
  
  if (!videos || videos.length === 0) {
    console.warn("[MediaVideosSlide] WARNING: No videos provided");
    return (
      <Box sx={{ padding: "2rem", textAlign: "center", color: "text.secondary" }}>
        No videos available
      </Box>
    );
  }

  // Filter to only YouTube videos
  console.log("[MediaVideosSlide] Starting YouTube filter...");
  const youtubeVideos = videos.filter((v, idx) => {
    const isYoutube = v?.site === "YouTube";
    const hasKey = !!v?.key;
    const passes = isYoutube && hasKey;
    console.log(`[MediaVideosSlide]   [Filter ${idx}] site="${v?.site}" hasKey=${hasKey} passes=${passes}`);
    return passes;
  });

  console.log("[MediaVideosSlide] YouTube videos count:", youtubeVideos.length);
  console.log("[MediaVideosSlide] YouTube videos:", youtubeVideos);

  if (youtubeVideos.length === 0) {
    console.warn("[MediaVideosSlide] WARNING: No YouTube videos after filtering");
    console.log("[MediaVideosSlide] All videos:", JSON.stringify(videos, null, 2));
    return (
      <Box sx={{ padding: "2rem", textAlign: "center", color: "#ffaaaa", backgroundColor: "#330000", border: "2px solid #ff0000" }}>
        <Typography sx={{ fontWeight: "bold" }}>❌ No YouTube videos available</Typography>
        <Typography variant="caption">Total videos: {videos.length}</Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
          Video types: {videos.map(v => v?.site).filter(Boolean).join(", ")}
        </Typography>
      </Box>
    );
  }

  console.log("[MediaVideosSlide] Rendering", youtubeVideos.length, "YouTube videos");
  return (
    <NavigationSwiper>
      {youtubeVideos.map((video, index) => {
        console.log(`[MediaVideosSlide] Rendering video ${index}:`, video.key);
        return (
          <SwiperSlide key={`${video.key}-${index}`}>
            <MediaVideo video={video} />
          </SwiperSlide>
        );
      })}
    </NavigationSwiper>
  );
};

export default MediaVideosSlide;