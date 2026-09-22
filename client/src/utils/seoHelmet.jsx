import { Helmet } from "react-helmet-async";

/**
 * SEO Helmet component for managing meta tags
 * Usage: <SEOHelmet title="..." description="..." etc />
 */
const SEOHelmet = ({
  title = "Mamovie - Your Ultimate Movie Experience",
  description = "Mamovie - Your ultimate movie streaming platform with thousands of movies and TV shows",
  image = "https://mamovie.com/Mamovie.png",
  url = "https://mamovie.com",
  type = "website",
  keywords = "movies, TV shows, streaming, watch online, movie database",
  author = "Mamovie"
}) => {
  const fullTitle = title.includes("Mamovie") ? title : `${title} | Mamovie`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Mamovie" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@mamovie" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Mamovie" />
    </Helmet>
  );
};

export default SEOHelmet;

/**
 * Helper function to generate SEO props for different page types
 */
export const generateSEOData = (type, data = {}) => {
  const baseUrl = "https://mamovie.com";

  const seoConfigs = {
    home: {
      title: "Mamovie - Your Ultimate Movie Experience",
      description: "Discover thousands of movies and TV shows on Mamovie. Stream your favorite content anytime, anywhere.",
      url: `${baseUrl}/`,
      type: "website"
    },
    movieList: {
      title: "Movies - Mamovie",
      description: "Browse our extensive collection of movies. Find trending, top-rated, and recently released films.",
      url: `${baseUrl}/movie`,
      type: "website"
    },
    tvList: {
      title: "TV Shows - Mamovie",
      description: "Browse our extensive collection of TV shows. Find trending, top-rated, and recently released series.",
      url: `${baseUrl}/tv`,
      type: "website"
    },
    movieDetail: {
      title: `${data.title || "Movie"} - Mamovie`,
      description: `${data.overview || "Watch this movie on Mamovie. Stream millions of movies and TV shows with subscription."} Rating: ${data.vote_average || "N/A"}/10`,
      image: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "https://mamovie.com/Mamovie.png",
      url: `${baseUrl}/movie/${data.id || ""}`,
      type: "movie",
      keywords: `${data.title || "Movie"}, watch online, streaming, ${data.genres?.join(", ") || "movies"}`
    },
    tvDetail: {
      title: `${data.name || "TV Show"} - Mamovie`,
      description: `${data.overview || "Watch this TV show on Mamovie. Stream millions of movies and TV shows with subscription."} Rating: ${data.vote_average || "N/A"}/10`,
      image: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "https://mamovie.com/Mamovie.png",
      url: `${baseUrl}/tv/${data.id || ""}`,
      type: "tv.show",
      keywords: `${data.name || "TV Show"}, watch online, streaming, ${data.genres?.join(", ") || "tv shows"}`
    },
    personDetail: {
      title: `${data.name || "Person"} - Mamovie`,
      description: `Learn about ${data.name || "this person"} on Mamovie. ${data.biography?.substring(0, 150) || "Explore filmography and career details."}...`,
      image: data.profile_path
        ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
        : "https://mamovie.com/Mamovie.png",
      url: `${baseUrl}/person/${data.id || ""}`,
      type: "profile",
      keywords: `${data.name || "Person"}, actor, director, filmography`
    },
    search: {
      title: `Search - Mamovie`,
      description: "Search for your favorite movies and TV shows on Mamovie.",
      url: `${baseUrl}/search`,
      type: "website"
    },
    favorites: {
      title: "My Favorites - Mamovie",
      description: "Your personal collection of favorite movies and TV shows on Mamovie.",
      url: `${baseUrl}/favorites`,
      type: "website"
    },
    reviews: {
      title: "My Reviews - Mamovie",
      description: "Manage and view your reviews on Mamovie.",
      url: `${baseUrl}/reviews`,
      type: "website"
    },
    trending: {
      title: `Trending ${data.mediaType === "movie" ? "Movies" : "TV Shows"} - Mamovie`,
      description: `Explore the most trending ${data.mediaType === "movie" ? "movies" : "TV shows"} right now on Mamovie.`,
      url: `${baseUrl}/trending/${data.mediaType || "movie"}`,
      type: "website"
    },
    topRated: {
      title: `Top Rated ${data.mediaType === "movie" ? "Movies" : "TV Shows"} - Mamovie`,
      description: `Discover the highest-rated ${data.mediaType === "movie" ? "movies" : "TV shows"} on Mamovie.`,
      url: `${baseUrl}/top-rated/${data.mediaType || "movie"}`,
      type: "website"
    }
  };

  return seoConfigs[type] || seoConfigs.home;
};
