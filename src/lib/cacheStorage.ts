/**
 * Key-Value Storage and Cache Manager (Web / MMKV equivalent)
 * High-performance storage with TTL expiration, namespace isolation, and memory cache fallback.
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class CacheStorageManager {
  private memoryCache = new Map<string, any>();
  private prefix = 'cr_explorer_cache_';

  /**
   * Set a key-value pair with TTL (Time To Live in milliseconds)
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const fullKey = this.prefix + key;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttlMs,
    };

    // 1. Save in memory
    this.memoryCache.set(fullKey, item);

    // 2. Persist to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(fullKey, JSON.stringify(item));
      }
    } catch (e) {
      console.warn('Cache storage write failed (memory fallback used):', e);
    }
  }

  /**
   * Retrieve a key-value pair if it hasn't expired
   */
  get<T>(key: string): T | null {
    const fullKey = this.prefix + key;

    // 1. Check memory cache first
    let item = this.memoryCache.get(fullKey) as CacheItem<T> | undefined;

    // 2. If not in memory, check localStorage
    if (!item && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(fullKey);
        if (raw) {
          item = JSON.parse(raw);
          if (item) {
            this.memoryCache.set(fullKey, item);
          }
        }
      } catch (e) {
        console.warn('Cache storage read failed:', e);
      }
    }

    if (!item) return null;

    // 3. Check TTL expiration
    const isExpired = Date.now() - item.timestamp > item.ttlMs;
    if (isExpired) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Delete a key
   */
  delete(key: string): void {
    const fullKey = this.prefix + key;
    this.memoryCache.delete(fullKey);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(fullKey);
      }
    } catch (e) {
      console.warn('Cache storage delete error:', e);
    }
  }

  /**
   * Clear all cached keys under this prefix
   */
  clearAll(): void {
    this.memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  }
}

export const cacheStorage = new CacheStorageManager();
