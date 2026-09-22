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
      const height = iframeRef.current.offsetWidth * 9 / 16 + "px";
      if (iframeRef.current) {
        iframeRef.current.setAttribute("height", height);
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
    <Box sx={{ height: "max-content" }}>
      <iframe
        key={video.key}
        src={youtubeUrl}
        ref={iframeRef}
        width="100%"
        title={video.name || video.id}
        style={{ border: 0, display: "block" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Box>
  );
};

const MediaVideosSlide = ({ videos }) => {
  console.log("[MediaVideosSlide]", videos);
  
  if (!videos || videos.length === 0) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center", color: "text.secondary" }}>
        No videos available
      </Box>
    );
  }

  return (
    <NavigationSwiper>
      {videos.map((video, index) => (
        <SwiperSlide key={index}>
          <MediaVideo video={video} />
        </SwiperSlide>
      ))}
    </NavigationSwiper>
  );
};

export default MediaVideosSlide;