/**
 * Simple in-memory cache for API responses
 * Cache entries expire after 5 minutes by default
 */
class ApiCache {
  constructor(defaultTtl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.timers = new Map();
    this.defaultTtl = defaultTtl;
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
   * Get value from cache
   */
  get(url, params = {}) {
    const key = this.generateKey(url, params);
    return this.cache.get(key);
  }

  /**
   * Set value in cache with optional TTL
   */
  set(url, data, params = {}, ttl = this.defaultTtl) {
    const key = this.generateKey(url, params);
    
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store data
    this.cache.set(key, data);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Clear specific cache entry
   */
  clear(url, params = {}) {
    const key = this.generateKey(url, params);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
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

export default new ApiCache();
