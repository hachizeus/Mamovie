import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "./NavigationSwiper";

const MediaVideo = ({ video }) => {
  const iframeRef = useRef();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;
    console.log("[MediaVideo] Video object:", video);
    console.log("[MediaVideo] Video key:", video?.key);
    console.log("[MediaVideo] Video name:", video?.name);
    console.log("[MediaVideo] YouTube URL:", tmdbConfigs.youtubePath(video?.key));
    
    try {
      const width = iframeRef.current.offsetWidth;
      console.log("[MediaVideo] Iframe offsetWidth:", width);
      
      if (width > 0) {
        const height = (width * 9 / 16) + "px";
        iframeRef.current.setAttribute("height", height);
        console.log("[MediaVideo] Set height:", height);
      } else {
        // If width is 0, use a sensible default
        iframeRef.current.setAttribute("height", "360px");
        console.warn("[MediaVideo] offsetWidth is 0, using default height");
      }
    } catch (e) {
      console.error("[MediaVideo] Error setting height:", e);
    }
  }, [video]);

  if (!video?.key) {
    return (
      <Box sx={{ height: "max-content", color: "text.secondary", textAlign: "center", p: 2 }}>
        Invalid video data (no key)
      </Box>
    );
  }

  const youtubeUrl = tmdbConfigs.youtubePath(video.key);
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${video.key}`;

  return (
    <Box sx={{ height: "max-content", width: "100%", position: "relative" }}>
      <Box sx={{ 
        position: "relative", 
        width: "100%",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        overflow: "hidden",
        backgroundColor: "#222"
      }}>
        <iframe
          key={video.key}
          src={youtubeUrl}
          ref={iframeRef}
          title={video.name || video.id}
          style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", 
            height: "100%",
            border: 0,
            display: "block"
          }}
          sandbox="allow-same-origin allow-scripts allow-presentation allow-popups"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onError={() => {
            console.error("[MediaVideo] iframe error for video:", video.key);
            setHasError(true);
          }}
          onLoad={() => {
            console.log("[MediaVideo] iframe loaded successfully for video:", video.key);
          }}
        ></iframe>
      </Box>
      {hasError && (
        <Box sx={{ 
          p: 2, 
          backgroundColor: "#1a1a1a", 
          color: "text.secondary", 
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <Typography variant="body2">
            Video "{video.name}" is not available for embedding. {" "}
            <a href={youtubeWatchUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#e50914" }}>
              Watch on YouTube
            </a>
          </Typography>
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