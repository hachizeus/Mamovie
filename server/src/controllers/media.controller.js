import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";
import cacheService from "../services/cache.service.js";
import responseFormatter from "../utils/response.formatter.js";

const getList = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    let { mediaType, mediaCategory } = req.params;

    // mediaType is already validated and lowercased by route middleware
    // Clean up mediaCategory
    mediaCategory = String(mediaCategory).toLowerCase().trim();

    // Validate mediaCategory
    const validCategories = ["popular", "top_rated", "upcoming", "now_playing"];
    if (!validCategories.includes(mediaCategory)) {
      console.warn(`Invalid mediaCategory: ${mediaCategory}`, { mediaType, mediaCategory });
      return responseHandler.badRequest(res, "mediaCategory must be 'popular', 'top_rated', 'upcoming', or 'now_playing'");
    }

    // Validate page number
    const pageNum = Math.max(1, Math.min(parseInt(page) || 1, 1000));

    // Create cache key
    const cacheKey = `${mediaType}:${mediaCategory}:page${pageNum}`;
    
    // Check cache first
    let response = cacheService.get(cacheKey);
    
    if (!response) {
      console.log(`Fetching from TMDB: ${mediaType}/${mediaCategory} page ${pageNum}`);
      let data = await tmdbApi.mediaList({ mediaType, mediaCategory, page: pageNum });
      
      if (!data || !data.results) {
        console.error('No results from TMDB API');
        return responseHandler.badRequest(res, "Failed to fetch media list from external API");
      }
      
      // Format response to reduce payload size
      response = responseFormatter.formatMediaList(data);
      
      // Cache for 30 minutes (media list changes frequently)
      cacheService.set(cacheKey, response, 30 * 60 * 1000);
    }

    return responseHandler.ok(res, response);
  } catch (error) {
    console.error(`[getList Error] ${error.message}`, error);
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    let { mediaType } = req.params;

    // mediaType is already validated and lowercased by route middleware
    const cacheKey = `genres:${mediaType}`;
    
    // Check cache first - genres change rarely, cache for 24 hours
    let response = cacheService.get(cacheKey);
    
    if (!response) {
      console.log(`Fetching genres from TMDB: ${mediaType}`);
      let data = await tmdbApi.mediaGenres({ mediaType });
      
      if (!data || !data.genres) {
        console.error('No genres from TMDB API');
        return responseHandler.badRequest(res, "Failed to fetch genres from external API");
      }
      
      // Format response to reduce payload
      response = responseFormatter.formatGenres(data);
      
      cacheService.set(cacheKey, response, 24 * 60 * 60 * 1000);
    }

    return responseHandler.ok(res, response);
  } catch (error) {
    console.error(`[getGenres Error] ${error.message}`, error);
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page = 1 } = req.query;

    // mediaType is already validated by route middleware
    // query and page are already validated by route middleware

    if (!query || query.trim().length === 0) {
      return responseHandler.badRequest(res, "Search query is required");
    }

    // Validate page number
    const pageNum = Math.max(1, Math.min(parseInt(page) || 1, 1000));

    // Create cache key
    const cacheKey = `search:${mediaType}:${query}:page${pageNum}`;
    
    // Check cache first
    let response = cacheService.get(cacheKey);
    
    if (!response) {
      console.log(`Searching TMDB: ${mediaType} query="${query}" page ${pageNum}`);
      let data = await tmdbApi.mediaSearch({
        query: query.trim(),
        page: pageNum,
        mediaType: mediaType === "people" ? "person" : mediaType
      });
      
      if (!data || !data.results) {
        console.error('No search results from TMDB API');
        return responseHandler.badRequest(res, "Failed to search media from external API");
      }
      
      // Format response to reduce payload
      response = responseFormatter.formatSearchResults(data);
      
      // Cache search results for 1 hour
      cacheService.set(cacheKey, response, 60 * 60 * 1000);
    }

    responseHandler.ok(res, response);
  } catch (error) {
    console.error(`[search Error] ${error.message}`);
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    // mediaType is already validated by route middleware
    
    // Validate mediaId
    const id = parseInt(mediaId);
    if (isNaN(id) || id <= 0) {
      return responseHandler.badRequest(res, "Invalid mediaId");
    }

    // Create cache key
    const cacheKey = `detail:${mediaType}:${id}`;
    
    // Check cache first
    let media = cacheService.get(cacheKey);
    
    if (!media) {
      const params = { mediaType, mediaId: id };

      media = await tmdbApi.mediaDetail(params);
      
      if (!media || !media.id) {
        return responseHandler.notFound(res);
      }

      try {
        media.credits = await tmdbApi.mediaCredits(params);
      } catch (err) {
        console.warn(`[getDetail] Failed to fetch credits: ${err.message}`);
        media.credits = { cast: [], crew: [] };
      }

      try {
        const videos = await tmdbApi.mediaVideos(params);
        media.videos = videos || [];
      } catch (err) {
        console.warn(`[getDetail] Failed to fetch videos: ${err.message}`);
        media.videos = [];
      }

      try {
        const recommend = await tmdbApi.mediaRecommend(params);
        media.recommend = recommend?.results || [];
      } catch (err) {
        console.warn(`[getDetail] Failed to fetch recommendations: ${err.message}`);
        media.recommend = [];
      }

      try {
        media.images = await tmdbApi.mediaImages(params);
      } catch (err) {
        console.warn(`[getDetail] Failed to fetch images: ${err.message}`);
        media.images = {};
      }

      // Cache detail for 2 hours
      cacheService.set(cacheKey, media, 2 * 60 * 60 * 1000);
    }

    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      try {
        const user = await userModel.findById(tokenDecoded.data);

        if (user) {
          const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId: id });
          media.isFavorite = isFavorite !== null;
        }
      } catch (err) {
        console.warn(`[getDetail] Failed to fetch user favorite status: ${err.message}`);
        media.isFavorite = false;
      }
    }

    try {
      media.reviews = await reviewModel.find({ mediaId: id }).populate("user").sort("-createdAt");
    } catch (err) {
      console.warn(`[getDetail] Failed to fetch reviews: ${err.message}`);
      media.reviews = [];
    }

    // Format response to reduce payload size
    const formattedMedia = responseFormatter.formatMediaDetail(media);

    responseHandler.ok(res, formattedMedia);
  } catch (error) {
    console.error(`[getDetail Error] ${error.message}`);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };