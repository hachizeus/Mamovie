import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { SwiperSlide } from "swiper/react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import NavigationSwiper from "./NavigationSwiper";

const MediaVideo = ({ video }) => {
  const [hasError, setHasError] = useState(false);

  if (!video?.key) {
    return (
      <Box sx={{ height: "max-content", color: "text.secondary", textAlign: "center", p: 2 }}>
        Invalid video data (no key)
      </Box>
    );
  }

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${video.key}`;
  const youtubeEmbedUrl = `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`;

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
      }}>
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
            onClick={() => window.open(youtubeWatchUrl, '_blank')}
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
          {video.type}
        </Typography>
      </Box>
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