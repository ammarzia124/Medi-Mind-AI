/**
 * Security utilities for MediMind AI
 * Implements comprehensive security measures for health information protection
 */

// ============================================================================
// INPUT VALIDATION & SANITIZATION
// ============================================================================

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 10000); // Limit length
}

/**
 * Validates and sanitizes file names
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove directory traversal
    .substring(0, 255); // Limit length
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 */
export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Password is strong' };
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file type and size
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
    };
  }

  // Check file type
  const fileType = file.type;
  if (!ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES]) {
    return {
      valid: false,
      error: 'File type not allowed. Allowed types: JPEG, PNG, WebP, PDF'
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ALLOWED_FILE_TYPES[fileType as keyof typeof ALLOWED_FILE_TYPES];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'File extension does not match file type'
    };
  }

  return { valid: true };
}

/**
 * Validates image dimensions
 */
export async function validateImageDimensions(
  file: File,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions exceed ${maxWidth}x${maxHeight}px limit`
        });
      } else {
        resolve({ valid: true });
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ valid: false, error: 'Invalid image file' });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ============================================================================
// PROMPT INJECTION PROTECTION
// ============================================================================

/**
 * Detects potential prompt injection attempts
 */
export function detectPromptInjection(input: string): { detected: boolean; risk: 'low' | 'medium' | 'high' } {
  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /you are now/i,
    /act as/i,
    /pretend you/i,
    /system prompt/i,
    /developer mode/i,
    /jailbreak/i,
    /DAN mode/i,
    /forget everything/i,
    /new instructions/i,
  ];

  const matches = suspiciousPatterns.filter(pattern => pattern.test(input));
  
  if (matches.length >= 3) {
    return { detected: true, risk: 'high' };
  } else if (matches.length >= 1) {
    return { detected: true, risk: 'medium' };
  }
  
  return { detected: false, risk: 'low' };
}

/**
 * Sanitizes input for AI processing
 */
export function sanitizeForAI(input: string): string {
  // Remove potential injection patterns
  let sanitized = input;
  
  // Remove common injection phrases
  sanitized = sanitized.replace(/ignore (all |previous )?instructions/gi, '');
  sanitized = sanitized.replace(/you are now (a |an )?/gi, '');
  sanitized = sanitized.replace(/act as (a |an )?/gi, '');
  sanitized = sanitized.replace(/pretend (you are |to be )?/gi, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 5000);
  
  return sanitized.trim();
}

// ============================================================================
// RATE LIMITING (CLIENT-SIDE)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiting
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now
  };
}

// ============================================================================
// SECURE STORAGE
// ============================================================================

/**
 * Securely stores sensitive data (encrypted in production)
 */
export class SecureStorage {
  private static readonly PREFIX = 'medimind_';

  static set(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value)); // Base64 encoding (use proper encryption in production)
      localStorage.setItem(this.PREFIX + key, encrypted);
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.PREFIX + key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Safe error logging (prevents sensitive data exposure)
 */
export function logError(error: unknown, context: string = ''): void {
  const safeError = {
    message: error instanceof Error ? error.message : 'Unknown error',
    context,
    timestamp: new Date().toISOString(),
    // Never log stack traces or sensitive data in production
    stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
  };

  console.error('[MediMind Error]', safeError);
  
  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service
    // ErrorTrackingService.capture(safeError);
  }
}

/**
 * User-friendly error messages
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    // Map technical errors to user-friendly messages
    if (error.message.includes('network')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('unauthorized')) {
      return 'Please log in to continue.';
    }
    if (error.message.includes('validation')) {
      return 'Please check your input and try again.';
    }
  }
  return 'Something went wrong. Please try again later.';
}

// ============================================================================
// SECURITY HEADERS (for backend reference)
// ============================================================================

export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = SecureStorage.get<string>('auth_token');
  return !!token;
}

/**
 * Gets auth token
 */
export function getAuthToken(): string | null {
  return SecureStorage.get<string>('auth_token');
}

/**
 * Sets auth token
 */
export function setAuthToken(token: string): void {
  SecureStorage.set('auth_token', token);
}

/**
 * Clears auth token
 */
export function clearAuthToken(): void {
  SecureStorage.remove('auth_token');
}

// ============================================================================
// API SECURITY
// ============================================================================

/**
 * Creates secure API request headers
 */
export function createSecureHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Validates API response
 */
export function validateApiResponse(response: any): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  if (response.success === false) {
    return false;
  }
  
  return true;
}
