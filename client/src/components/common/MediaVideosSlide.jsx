import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "./NavigationSwiper";

const MediaVideo = ({ video }) => {
  const iframeRef = useRef();

  useEffect(() => {
    if (!iframeRef.current) return;
    console.log("[MediaVideo] Video object:", video);
    console.log("[MediaVideo] Video key:", video?.key);
    console.log("[MediaVideo] YouTube URL:", tmdbConfigs.youtubePath(video?.key));
    
    try {
      const width = iframeRef.current.offsetWidth;
      console.log("[MediaVideo] Iframe offsetWidth:", width);
      
      if (width > 0) {
        const height = (width * 9 / 16) + "px";
        iframeRef.current.setAttribute("height", height);
        console.log("[MediaVideo] Set height:", height);
      } else {
        // If width is 0, use a sensible default and try again on next render
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

  return (
    <Box sx={{ height: "max-content", width: "100%" }}>
      <iframe
        key={video.key}
        src={youtubeUrl}
        ref={iframeRef}
        width="100%"
        height="360"
        title={video.name || video.id}
        style={{ border: 0, display: "block", minHeight: "360px" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
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