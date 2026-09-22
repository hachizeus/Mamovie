import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";
import "./MediaDetail.css";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import SEOHelmet, { generateSEOData } from "../utils/seoHelmet";
import { StructuredData, generateMovieSchema, generateTVShowSchema } from "../utils/structuredData";

// Lazy load non-critical components below the fold
const BackdropSlide = lazy(() => import("../components/common/BackdropSlide"));
const PosterSlide = lazy(() => import("../components/common/PosterSlide"));
const RecommendSlide = lazy(() => import("../components/common/RecommendSlide"));
const MediaSlide = lazy(() => import("../components/common/MediaSlide"));
const MediaReview = lazy(() => import("../components/common/MediaReview"));

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();

  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      try {
        console.log(`[MediaDetail] Loading ${mediaType}/${mediaId}`);
        dispatch(setGlobalLoading(true));
        
        const { response, err } = await mediaApi.getDetail({ mediaType, mediaId });
        dispatch(setGlobalLoading(false));

        console.log(`[MediaDetail] Response:`, response);
        console.log(`[MediaDetail] Error:`, err);

        if (response) {
          console.log(`[MediaDetail] Setting media to:`, response.id, response.title || response.name);
          setMedia(response);
          setIsFavorite(response.isFavorite);
          const genreList = response.genres ? response.genres.splice(0, 2) : [];
          setGenres(genreList);
          console.log(`[MediaDetail] Media set successfully`);
        }

        if (err) {
          console.error(`[MediaDetail] API Error:`, err);
          toast.error(err.message || "Failed to load media");
        }
      } catch (error) {
        console.error(`[MediaDetail] Exception:`, error);
        dispatch(setGlobalLoading(false));
        toast.error("Failed to load media details");
      }
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const onFavoriteClick = async () => {
    // Signin functionality is disabled - show message instead
    toast.info("Sign in functionality is currently disabled");
    return;
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(e => e.mediaId.toString() === media.id.toString());

    const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Remove favorite success");
    }
  };

  if (!media) {
    return (
      <Box sx={{
        color: "primary.contrastText",
        ...uiConfigs.style.mainContent,
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <Typography variant="h6">Loading movie details...</Typography>
      </Box>
    );
  }

  // Generate SEO data based on media type
  const seoData = generateSEOData(
    mediaType === tmdbConfigs.mediaType.movie ? 'movieDetail' : 'tvDetail',
    media
  );

  // Generate structured data
  const structuredData = mediaType === tmdbConfigs.mediaType.movie 
    ? generateMovieSchema(media) 
    : generateTVShowSchema(media);

  return (
    <>
      <SEOHelmet {...seoData} />
      {structuredData && <StructuredData data={structuredData} />}
      <ImageHeader imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)} />
      <Box className="media-detail-container" sx={{ color: "primary.contrastText", ...uiConfigs.style.mainContent }}>
          {/* media content */}
          <Box className="media-content-wrapper">
            <Box className="media-content-flex">
              {/* poster */}
              <Box className="media-poster">
                <Box sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(media.poster_path || media.backdrop_path))
                }} />
              </Box>
              {/* poster */}

              {/* media info */}
              <Box className="media-info">
                <Stack spacing={5}>
                  {/* title */}
                  <Typography
                    variant="h4"
                    className="media-title"
                    sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                  >
                    {`${media.title || media.name} ${mediaType === tmdbConfigs.mediaType.movie ? media.release_date?.split("-")[0] || "" : media.first_air_date?.split("-")[0] || ""}`}
                  </Typography>
                  {/* title */}

                  {/* rate and genres */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularRate value={media.vote_average} />
                    <Divider orientation="vertical" />
                    {genres.map((genre, index) => (
                      <Chip
                        label={genre.name}
                        variant="filled"
                        color="primary"
                        key={index}
                      />
                    ))}
                  </Stack>
                  {/* rate and genres */}

                  {/* overview */}
                  <Typography
                    variant="body1"
                    sx={{ ...uiConfigs.style.typoLines(5) }}
                  >
                    {media.overview}
                  </Typography>
                  {/* overview */}

                  {/* buttons */}
                  <Stack direction="row" spacing={1}>
                    <LoadingButton
                      variant="text"
                      sx={{ width: "max-content", opacity: 0.5 }}
                      size="large"
                      disabled
                      startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                      loadingPosition="start"
                      loading={onRequest}
                      onClick={onFavoriteClick}
                      title="Favorites feature is disabled"
                    />
                    <Button
                      variant="contained"
                      sx={{ width: "max-content" }}
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => videoRef.current?.scrollIntoView()}
                    >
                      watch now
                    </Button>
                  </Stack>
                  {/* buttons */}

                  {/* cast */}
                  <Container header="Cast">
                    <CastSlide casts={media.credits?.cast || []} />
                  </Container>
                  {/* cast */}
                </Stack>
              </Box>
              {/* media info */}
            </Box>
          </Box>
          {/* media content */}

          {/* media videos */}
          <div ref={videoRef} style={{ paddingTop: "2rem" }}>
            <Container header="Videos">
              {(() => {
                console.log("[MediaDetail] Passing videos to MediaVideosSlide:");
                console.log("[MediaDetail]   - raw media.videos:", media.videos);
                
                // Handle both array and {results: []} format from TMDB
                let videosArray = [];
                if (Array.isArray(media.videos)) {
                  videosArray = media.videos;
                } else if (media.videos && Array.isArray(media.videos.results)) {
                  videosArray = media.videos.results;
                }
                
                const videosToPass = videosArray.slice(0, 5);
                console.log("[MediaDetail]   - sliced (0-5):", videosToPass);
                console.log("[MediaDetail]   - final videos to pass:", videosToPass);
                return <MediaVideosSlide videos={videosToPass} />;
              })()}
            </Container>
          </div>
          {/* media videos */}

          {/* media backdrop */}
          {media.images?.backdrops?.length > 0 && (
            <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading backdrops...</div>}>
              <Container header="backdrops">
                <BackdropSlide backdrops={media.images.backdrops} />
              </Container>
            </Suspense>
          )}
          {/* media backdrop */}

          {/* media posters */}
          {media.images?.posters?.length > 0 && (
            <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading posters...</div>}>
              <Container header="posters">
                <PosterSlide posters={media.images.posters} />
              </Container>
            </Suspense>
          )}
          {/* media posters */}

          {/* media reviews - lazy loaded */}
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading reviews...</div>}>
            <MediaReview reviews={media.reviews || []} media={media} mediaType={mediaType} />
          </Suspense>
          {/* media reviews */}

          {/* media recommendation */}
          <Container header="you may also like">
            {media.recommend?.length > 0 && (
              <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading recommendations...</div>}>
                <RecommendSlide medias={media.recommend} mediaType={mediaType} />
              </Suspense>
            )}
            {(!media.recommend || media.recommend.length === 0) && (
              <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading recommendations...</div>}>
                <MediaSlide
                  mediaType={mediaType}
                  mediaCategory={tmdbConfigs.mediaCategory.top_rated}
                />
              </Suspense>
            )}
          </Container>
          {/* media recommendation */}
        </Box>
    </>
  );
};

export default MediaDetail;