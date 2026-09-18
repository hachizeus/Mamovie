/**
 * Response formatter to optimize API payloads
 * Removes unnecessary fields to reduce data transfer
 */

const formatMediaList = (data) => {
  if (!data) return data;
  
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results?.map(item => ({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
      overview: item.overview,
      media_type: item.media_type,
      genre_ids: item.genre_ids
    })) || []
  };
};

const formatMediaDetail = (data) => {
  if (!data) return data;
  
  return {
    id: data.id,
    title: data.title || data.name,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date || data.first_air_date,
    vote_average: data.vote_average,
    overview: data.overview,
    runtime: data.runtime,
    genres: data.genres?.map(g => ({ id: g.id, name: g.name })) || [],
    credits: data.credits ? {
      cast: data.credits.cast?.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
        order: c.order
      })) || [],
      crew: data.credits.crew?.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        job: c.job,
        profile_path: c.profile_path
      })) || []
    } : { cast: [], crew: [] },
    videos: data.videos ? {
      results: data.videos.results?.slice(0, 5).map(v => ({
        id: v.id,
        key: v.key,
        name: v.name,
        type: v.type,
        site: v.site
      })) || []
    } : { results: [] },
    recommend: data.recommend?.slice(0, 10).map(item => ({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average
    })) || [],
    images: data.images ? {
      posters: data.images.posters?.slice(0, 5).map(img => ({
        file_path: img.file_path,
        width: img.width,
        height: img.height
      })) || [],
      backdrops: data.images.backdrops?.slice(0, 5).map(img => ({
        file_path: img.file_path,
        width: img.width,
        height: img.height
      })) || []
    } : { posters: [], backdrops: [] },
    reviews: data.reviews?.slice(0, 5).map(r => ({
      id: r._id,
      author: r.user?.username || 'Anonymous',
      content: r.content,
      rating: r.rating,
      createdAt: r.createdAt
    })) || [],
    isFavorite: data.isFavorite || false
  };
};

const formatGenres = (data) => {
  if (!data) return data;
  
  return {
    genres: data.genres?.map(g => ({
      id: g.id,
      name: g.name
    })) || []
  };
};

const formatSearchResults = (data) => {
  if (!data) return data;
  
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results?.map(item => ({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
      overview: item.overview,
      media_type: item.media_type
    })) || []
  };
};

export default {
  formatMediaList,
  formatMediaDetail,
  formatGenres,
  formatSearchResults
};
