/**
 * Performance optimization utilities for MediMind AI
 * Implements caching, lazy loading, and optimization strategies
 */

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * In-memory cache with TTL support
 */
export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtl: number;

  constructor(defaultTtlMs: number = 5 * 60 * 1000) {
    this.defaultTtl = defaultTtlMs;
  }

  set(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instances
export const translationCache = new MemoryCache<Record<string, string>>(5 * 60 * 1000); // 5 min
export const analysisCache = new MemoryCache<any>(10 * 60 * 1000); // 10 min
export const userPreferencesCache = new MemoryCache<any>(60 * 60 * 1000); // 1 hour

// ============================================================================
// API EFFICIENCY
// ============================================================================

interface ApiRequestOptions {
  cache?: boolean;
  cacheTtl?: number;
  retries?: number;
  timeout?: number;
}

/**
 * Fetches data with caching and retry logic
 */
export async function fetchWithCache<T>(
  url: string,
  options: ApiRequestOptions = {},
  fetchOptions: RequestInit = {}
): Promise<T> {
  const {
    cache = false,
    cacheTtl = 5 * 60 * 1000,
    retries = 3,
    timeout = 30000,
  } = options;

  // Check cache first
  if (cache) {
    const cached = analysisCache.get(url);
    if (cached) {
      return cached as T;
    }
  }

  // Fetch with timeout and retry
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful response
      if (cache) {
        analysisCache.set(url, data, cacheTtl);
      }

      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on client errors (4xx)
      if (lastError.message.includes('4')) {
        break;
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error('Request failed');
}

/**
 * Debounces API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttles API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ============================================================================
// IMAGE OPTIMIZATION
// ============================================================================

/**
 * Lazy loads images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            if (target.dataset.src) {
              target.src = target.dataset.src;
              target.removeAttribute('data-src');
            }
            observer.unobserve(target);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(img);
  } else {
    // Fallback for browsers without Intersection Observer
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }
}

/**
 * Preloads critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Generates responsive image srcset
 */
export function generateSrcSet(baseUrl: string, widths: number[] = [320, 640, 960, 1280]): string {
  return widths.map(w => `${baseUrl}?w=${w} ${w}w`).join(', ');
}

// ============================================================================
// CODE SPLITTING HELPERS
// ============================================================================

/**
 * Prefetches a component for faster navigation
 */
export function prefetchComponent(loader: () => Promise<any>): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      loader();
    });
  } else {
    setTimeout(() => {
      loader();
    }, 2000);
  }
}

/**
 * Prefetches multiple components
 */
export function prefetchComponents(loaders: Array<() => Promise<any>>): void {
  loaders.forEach(loader => prefetchComponent(loader));
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

const metrics: PerformanceMetric[] = [];

/**
 * Records a performance metric
 */
export function recordMetric(name: string, value: number): void {
  metrics.push({
    name,
    value,
    timestamp: Date.now(),
  });

  // Keep only last 100 metrics
  if (metrics.length > 100) {
    metrics.shift();
  }
}

/**
 * Gets average metric value
 */
export function getAverageMetric(name: string): number | null {
  const relevantMetrics = metrics.filter(m => m.name === name);
  if (relevantMetrics.length === 0) return null;

  const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
  return sum / relevantMetrics.length;
}

/**
 * Measures function execution time
 */
export async function measureExecution<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  recordMetric(name, duration);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

// ============================================================================
// WEB VITALS
// ============================================================================

/**
 * Reports Web Vitals metrics
 */
export function reportWebVitals(): void {
  if ('performance' in window) {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          recordMetric('FCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      recordMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });

    // Report CLS on page unload
    window.addEventListener('beforeunload', () => {
      recordMetric('CLS', clsValue);
    });
  }
}

// ============================================================================
// RESOURCE PRELOADING
// ============================================================================

/**
 * Preloads critical resources
 */
export function preloadCriticalResources(): void {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Preload critical CSS
  const cssLink = document.createElement('link');
  cssLink.rel = 'preload';
  cssLink.as = 'style';
  cssLink.href = '/styles/critical.css';
  document.head.appendChild(cssLink);
}

/**
 * Prefetches next page resources
 */
export function prefetchNextPage(page: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = `/${page}`;
  document.head.appendChild(link);
}

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

/**
 * Cleans up memory on page visibility change
 */
export function setupMemoryManagement(): void {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden, clean up caches
      analysisCache.cleanup();
      translationCache.cleanup();
      userPreferencesCache.cleanup();
    }
  });

  // Cleanup on low memory (if supported)
  if ('memory' in performance) {
    const memoryInfo = (performance as any).memory;
    if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
      // Memory usage is high, clear caches
      analysisCache.clear();
      translationCache.clear();
      console.warn('[Performance] High memory usage detected, caches cleared');
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes performance optimizations
 */
export function initializePerformance(): void {
  // Report Web Vitals
  if (process.env.NODE_ENV === 'production') {
    reportWebVitals();
  }

  // Setup memory management
  setupMemoryManagement();

  // Preload critical resources
  preloadCriticalResources();

  // Prefetch common pages
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      prefetchNextPage('symptoms');
      prefetchNextPage('lab');
    });
  }
}
