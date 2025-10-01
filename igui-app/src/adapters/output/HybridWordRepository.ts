import { WordRepository } from "../../core/domain/WordRepository";
import { WordTranslationService } from "../../services/wordTranslationService";

interface CacheEntry {
  translation: string
  lastUsed: number
  usageCount: number
}

export class HybridWordRepository implements WordRepository {
  private cache = new Map<string, CacheEntry>()
  private readonly maxCacheSize = 200 // Maximum number of words to keep in memory
  private readonly cacheRefreshInterval = 5 * 60 * 1000 // 5 minutes
  private lastCacheRefresh = 0
  private wordTranslationService = new WordTranslationService()

  constructor() {
    this.initializeCache().catch(err => console.error('init cache error', err));
  }

  async getTranslation(word: string, fromLang: string, toLang: string): Promise<string | undefined> {
    const cacheKey = this.getCacheKey(word, fromLang, toLang)

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      // Update last used timestamp
      cached.lastUsed = Date.now()
      cached.usageCount++
      console.log(`Cache hit for: ${word} -> ${cached.translation}`)
      return cached.translation
    }

    // If not in cache, fetch from database/service
    console.log(`Cache miss for: ${word}, fetching from service...`)
    const translation = await this.wordTranslationService.getTranslation(
      word, 
      fromLang as 'spanish' | 'english', 
      toLang as 'spanish' | 'english'
    )

    if (translation) {
      // Add to cache
      this.addToCache(cacheKey, translation)
      console.log(`Added to cache: ${word} -> ${translation}`)
      return translation
    }

    return undefined
  }

  private getCacheKey(word: string, fromLang: string, toLang: string): string {
    return `${word.toLowerCase()}_${fromLang}_${toLang}`
  }

  private addToCache(key: string, translation: string): void {
    // If cache is full, remove least recently used items
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLeastRecentlyUsed()
    }

    this.cache.set(key, {
      translation,
      lastUsed: Date.now(),
      usageCount: 1
    })
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
      console.log(`Evicted from cache: ${oldestKey}`)
    }
  }

  private async initializeCache(): Promise<void> {
    try {
      console.log('Initializing cache with most used translations...')
      const mostUsed = await this.wordTranslationService.getMostUsedTranslations(100)

      for (const wordTranslation of mostUsed) {
        const cacheKey = this.getCacheKey(
          wordTranslation.word,
          wordTranslation.from_language,
          wordTranslation.to_language
        )

        this.cache.set(cacheKey, {
          translation: wordTranslation.translation,
          lastUsed: Date.now(),
          usageCount: wordTranslation.usage_count
        })
      }

      console.log(`Cache initialized with ${this.cache.size} translations`)
      this.lastCacheRefresh = Date.now()
    } catch (error) {
      console.error('Error initializing cache:', error)
      // Fallback to empty cache if database is not available
    }
  }

  // Refresh cache periodically with most used translations
  private async refreshCache(): Promise<void> {
    const now = Date.now()
    if (now - this.lastCacheRefresh < this.cacheRefreshInterval) {
      return
    }

    try {
      console.log('Refreshing cache with latest most used translations...')
      const mostUsed = await this.wordTranslationService.getMostUsedTranslations(50)

      // Add new highly used translations to cache
      for (const wordTranslation of mostUsed) {
        const cacheKey = this.getCacheKey(
          wordTranslation.word,
          wordTranslation.from_language,
          wordTranslation.to_language
        )

        if (!this.cache.has(cacheKey)) {
          this.addToCache(cacheKey, wordTranslation.translation)
        }
      }

      this.lastCacheRefresh = now
      console.log('Cache refreshed successfully')
    } catch (error) {
      console.error('Error refreshing cache:', error)
    }
  }

  // Get cache statistics for debugging
  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    const totalRequests = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.usageCount, 0)

    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: totalRequests > 0 ? (this.cache.size / totalRequests) * 100 : 0
    }
  }

  // Trigger cache refresh manually
  async forceRefreshCache(): Promise<void> {
    this.lastCacheRefresh = 0
    await this.refreshCache()
  }
}
