import { Helmet } from "react-helmet-async";

/**
 * Component to render JSON-LD structured data
 * This helps search engines understand the content better
 */
export const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

/**
 * Generate Movie structured data
 */
export const generateMovieSchema = (movie) => {
  if (!movie || !movie.id) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date,
    director: {
      "@type": "Person",
      name: movie.director || "Unknown"
    },
    aggregateRating: movie.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          bestRating: "10",
          worstRating: "1",
          ratingCount: movie.vote_count || 0
        }
      : undefined,
    url: `https://mamovie.com/movie/${movie.id}`,
    genre: movie.genres ? movie.genres.map(g => g.name) : [],
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    inLanguage: movie.original_language || "en"
  };
};

/**
 * Generate TV Show structured data
 */
export const generateTVShowSchema = (show) => {
  if (!show || !show.id) return null;

  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    description: show.overview,
    image: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : undefined,
    datePublished: show.first_air_date,
    aggregateRating: show.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: show.vote_average,
          bestRating: "10",
          worstRating: "1",
          ratingCount: show.vote_count || 0
        }
      : undefined,
    url: `https://mamovie.com/tv/${show.id}`,
    genre: show.genres ? show.genres.map(g => g.name) : [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    inLanguage: show.original_language || "en"
  };
};

/**
 * Generate Person structured data
 */
export const generatePersonSchema = (person) => {
  if (!person || !person.id) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.biography,
    image: person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : undefined,
    birthDate: person.birthday,
    deathDate: person.deathday,
    birthPlace: person.place_of_birth,
    url: `https://mamovie.com/person/${person.id}`,
    jobTitle: person.known_for_department || "Actor"
  };
};

/**
 * Generate Website schema (for homepage)
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mamovie",
    description: "Your ultimate movie streaming platform with thousands of movies and TV shows",
    url: "https://mamovie.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://mamovie.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generate Organization schema (for footer/about)
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mamovie",
    description: "Your ultimate movie streaming platform",
    url: "https://mamovie.com",
    logo: "https://mamovie.com/Mamovie.png",
    sameAs: [
      "https://www.facebook.com/mamovie",
      "https://www.twitter.com/mamovie",
      "https://www.instagram.com/mamovie"
    ]
  };
};

/**
 * Generate BreadcrumbList structured data for navigation
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

/**
 * Generate CollectionPage schema (for list pages)
 */
export const generateCollectionPageSchema = (title, description, items = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: "https://mamovie.com",
    mainEntity: items.slice(0, 10).map(item => ({
      "@type": item.mediaType === "tv" ? "TVSeries" : "Movie",
      name: item.title || item.name,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      url: `https://mamovie.com/${item.mediaType || "movie"}/${item.id}`
    }))
  };
};
