/**
 * Server-side cache service for TMDB API responses
 * Prevents redundant calls to TMDB API for frequently requested data
 */
class CacheService {
  constructor(defaultTtl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.timers = new Map();
    this.defaultTtl = defaultTtl;
  }

  /**
   * Generate cache key from endpoint and parameters
   */
  generateKey(endpoint, params = {}) {
    const paramStr = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${endpoint}${paramStr ? ':' + paramStr : ''}`;
  }

  /**
   * Get value from cache
   */
  get(endpoint, params = {}) {
    const key = this.generateKey(endpoint, params);
    const cached = this.cache.get(key);
    if (cached) {
      console.log(`[Cache HIT] ${key}`);
    }
    return cached;
  }

  /**
   * Set value in cache with optional TTL
   */
  set(endpoint, data, params = {}, ttl = this.defaultTtl) {
    const key = this.generateKey(endpoint, params);

    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store data
    this.cache.set(key, data);
    console.log(`[Cache SET] ${key} (TTL: ${ttl}ms)`);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
      console.log(`[Cache EXPIRED] ${key}`);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Clear specific cache entry
   */
  clear(endpoint, params = {}) {
    const key = this.generateKey(endpoint, params);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
    console.log(`[Cache CLEARED] ${key}`);
  }

  /**
   * Clear cache entries matching a pattern
   */
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    let count = 0;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key));
          this.timers.delete(key);
        }
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`[Cache CLEARED ${count} entries] Pattern: ${pattern}`);
  }

  /**
   * Clear all cache entries
   */
  clearAll() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
    console.log('[Cache CLEARED ALL]');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export default new CacheService();
