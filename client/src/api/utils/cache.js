/**
 * Client-side cache utility with aggressive TTL strategy
 */
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    // Different TTLs for different data types
    this.ttls = {
      genres: 24 * 60 * 60 * 1000,        // 24 hours
      popular: 1 * 60 * 60 * 1000,        // 1 hour
      topRated: 1 * 60 * 60 * 1000,       // 1 hour
      upcoming: 6 * 60 * 60 * 1000,       // 6 hours
      nowPlaying: 12 * 60 * 60 * 1000,    // 12 hours
      search: 30 * 60 * 1000,             // 30 minutes
      detail: 2 * 60 * 60 * 1000,         // 2 hours
      default: 5 * 60 * 1000              // 5 minutes
    };
  }

  /**
   * Generate cache key from URL and params
   */
  generateKey(url, params = {}) {
    const paramStr = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${url}${paramStr ? '?' + paramStr : ''}`;
  }

  /**
   * Get TTL based on URL pattern
   */
  getTTL(url) {
    if (url.includes('genres')) return this.ttls.genres;
    if (url.includes('popular')) return this.ttls.popular;
    if (url.includes('top_rated')) return this.ttls.topRated;
    if (url.includes('upcoming')) return this.ttls.upcoming;
    if (url.includes('now_playing')) return this.ttls.nowPlaying;
    if (url.includes('search')) return this.ttls.search;
    if (url.includes('detail')) return this.ttls.detail;
    return this.ttls.default;
  }

  /**
   * Get value from cache
   */
  get(url, params = {}) {
    const key = this.generateKey(url, params);
    const cached = this.cache.get(key);
    if (cached) {
      console.log(`[Cache HIT] ${url.substring(0, 50)}`);
    }
    return cached;
  }

  /**
   * Set value in cache
   */
  set(url, data, params = {}) {
    const key = this.generateKey(url, params);
    const ttl = this.getTTL(url);
    
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store data
    this.cache.set(key, data);
    console.log(`[Cache SET] ${url.substring(0, 50)} TTL: ${ttl / 1000}s`);

    // Set expiration
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
      console.log(`[Cache EXPIRED] ${url.substring(0, 50)}`);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
    console.log('[Cache CLEARED ALL]');
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export default new ApiCache();

