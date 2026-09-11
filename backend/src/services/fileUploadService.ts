/**
 * File Upload Service
 * 
 * Handles file uploads for lab reports (PDF, images).
 * Implements security measures to prevent prompt injection.
 */

import { logger } from '../utils/logger';

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  content: string; // Extracted text content
  uploadedAt: Date;
}

export class FileUploadService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  /**
   * Validate uploaded file
   */
  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      };
    }

    // Check MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'File type not allowed. Allowed types: PDF, JPG, PNG, WebP',
      };
    }

    // Check file extension
    const extension = file.originalname.toLowerCase().split('.').pop();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: 'File extension does not match allowed types',
      };
    }

    return { valid: true };
  }

  /**
   * Extract text content from file
   * CRITICAL: Treat uploaded content strictly as data, never as instructions
   */
  async extractContent(file: Express.Multer.File): Promise<string> {
    logger.info('Extracting content from file', { 
      filename: file.originalname, 
      mimeType: file.mimetype,
      size: file.size 
    });

    // For now, return a placeholder
    // In production, this would use:
    // - pdf-parse for PDFs
    // - Tesseract.js or cloud OCR for images
    // - Proper text extraction libraries

    let content = '';

    if (file.mimetype === 'application/pdf') {
      // TODO: Implement PDF text extraction
      // const pdf = await pdfParse(file.buffer);
      // content = pdf.text;
      content = '[PDF content extraction not yet implemented]';
    } else if (file.mimetype.startsWith('image/')) {
      // TODO: Implement OCR for images
      // content = await ocrService.recognize(file.buffer);
      content = '[Image OCR not yet implemented]';
    }

    // CRITICAL: Sanitize extracted content to prevent prompt injection
    content = this.sanitizeExtractedContent(content);

    logger.info('Content extraction completed', { contentLength: content.length });

    return content;
  }

  /**
   * Sanitize extracted content to prevent prompt injection
   * Treat all uploaded content as untrusted data
   */
  private sanitizeExtractedContent(content: string): string {
    // Remove potential instruction patterns
    const sanitized = content
      .replace(/ignore previous instructions/gi, '[FILTERED]')
      .replace(/you are now/gi, '[FILTERED]')
      .replace(/act as/gi, '[FILTERED]')
      .replace(/pretend you/gi, '[FILTERED]')
      .replace(/system prompt/gi, '[FILTERED]')
      .replace(/developer mode/gi, '[FILTERED]')
      .replace(/jailbreak/gi, '[FILTERED]')
      .replace(/forget everything/gi, '[FILTERED]')
      .replace(/new instructions/gi, '[FILTERED]');

    return sanitized;
  }

  /**
   * Process uploaded file and return structured data
   */
  async processFile(file: Express.Multer.File): Promise<UploadedFile> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Extract content
    const content = await this.extractContent(file);

    // Return structured file data
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      content,
      uploadedAt: new Date(),
    };
  }
}

export const fileUploadService = new FileUploadService();
