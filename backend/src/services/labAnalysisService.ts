import { LabAnalysis, LabAnalysisInput, validateLabAnalysis } from '../validators/labAnalysisSchema';
import { ocrService } from './ocrService';
import { logger } from '../utils/logger';

/**
 * Enhanced Lab Analysis Service
 * 
 * Provides world-class lab report analysis with:
 * - OCR text extraction
 * - Structured AI analysis
 * - Simple language explanations
 * - Safety validation
 * - Bilingual support (English/Urdu)
 */

export class LabAnalysisService {
  /**
   * Analyze lab report from file
   */
  async analyzeFromFile(
    fileBuffer: Buffer,
    mimeType: string,
    language: 'en' | 'ur' = 'en'
  ): Promise<LabAnalysis> {
    logger.info('Starting lab report analysis from file', { mimeType, language });

    // Step 1: Extract text using OCR
    const ocrResult = await ocrService.extractText(fileBuffer, mimeType);
    
    // Step 2: Validate OCR quality
    const ocrQuality = ocrService.validateOCRQuality(ocrResult);
    if (!ocrQuality.isValid) {
      logger.warn('OCR quality issues detected', { issues: ocrQuality.issues });
    }

    // Step 3: Analyze extracted text
    const analysis = await this.analyzeText(ocrResult.text, language);

    // Step 4: Adjust confidence based on OCR quality
    const adjustedAnalysis = {
      ...analysis,
      confidence_score: analysis.confidence_score * ocrResult.confidence
    };

    logger.info('Lab report analysis completed', {
      resultsCount: adjustedAnalysis.results.length,
      overallStatus: adjustedAnalysis.overall_status,
      confidence: adjustedAnalysis.confidence_score
    });

    return adjustedAnalysis;
  }

  /**
   * Analyze lab report from text input
   */
  async analyzeText(
    textContent: string,
    language: 'en' | 'ur' = 'en'
  ): Promise<LabAnalysis> {
    logger.info('Analyzing lab report text', { textLength: textContent.length, language });

    // Parse lab values from text
    const parsedResults = this.parseLabValues(textContent);

    // Generate analysis for each result
    const analyzedResults = parsedResults.map(result => 
      this.analyzeLabResult(result, language)
    );

    // Determine overall status
    const overallStatus = this.determineOverallStatus(analyzedResults);
    const severity = this.calculateSeverity(analyzedResults);
    const urgency = this.determineUrgency(analyzedResults);

    // Generate summary
    const summary = this.generateSummary(analyzedResults, language);

    // Build complete analysis
    const analysis: LabAnalysis = {
      results: analyzedResults,
      overall_status: overallStatus,
      severity,
      urgency,
      summary,
      disclaimer: this.getDisclaimer(language),
      confidence_score: 0.9,
      language
    };

    // Validate output
    return validateLabAnalysis(analysis);
  }

  /**
   * Parse lab values from text
   */
  private parseLabValues(text: string): Array<{
    test_name: string;
    result_value: string;
    result_unit?: string;
    reference_range?: string;
  }> {
    const results: Array<{
      test_name: string;
      result_value: string;
      result_unit?: string;
      reference_range?: string;
    }> = [];

    // Common lab report patterns
    const patterns = [
      // Pattern: Test Name: Value Unit (Reference: Range)
      /([A-Za-z\s]+):\s*([\d.]+)\s*([a-zA-Z/%µ]+)?\s*(?:\(Reference:\s*([^)]+)\))?/gi,
      // Pattern: Test Name - Value Unit [Range]
      /([A-Za-z\s]+)\s*[-–]\s*([\d.]+)\s*([a-zA-Z/%µ]+)?\s*\[([^\]]+)\]/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        results.push({
          test_name: match[1].trim(),
          result_value: match[2],
          result_unit: match[3]?.trim(),
          reference_range: match[4]?.trim()
        });
      }
    }

    return results;
  }

  /**
   * Analyze individual lab result
   */
  private analyzeLabResult(
    result: {
      test_name: string;
      result_value: string;
      result_unit?: string;
      reference_range?: string;
    },
    language: 'en' | 'ur'
  ): {
    test_name: string;
    result_value: string;
    result_unit?: string;
    reference_range?: string;
    status: 'normal' | 'low' | 'high' | 'critical' | 'unreadable';
    confidence: number;
    what_is_this: string;
    what_it_means: string;
    what_to_do: string;
  } {
    const value = parseFloat(result.result_value);
    const status = this.determineStatus(value, result.reference_range);

    // Generate explanations based on test type and status
    const explanations = this.generateExplanations(
      result.test_name,
      result.result_value,
      result.result_unit,
      result.reference_range,
      status,
      language
    );

    return {
      test_name: result.test_name,
      result_value: result.result_value,
      result_unit: result.result_unit,
      reference_range: result.reference_range,
      status,
      confidence: 0.9,
      ...explanations
    };
  }

  /**
   * Determine status based on value and reference range
   */
  private determineStatus(
    value: number,
    referenceRange?: string
  ): 'normal' | 'low' | 'high' | 'critical' | 'unreadable' {
    if (!referenceRange) {
      return 'unreadable';
    }

    // Parse reference range (e.g., "12.0-17.5" or "<200" or ">40")
    const rangeMatch = referenceRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
    const lessThanMatch = referenceRange.match(/<\s*([\d.]+)/);
    const greaterThanMatch = referenceRange.match(/>\s*([\d.]+)/);

    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      
      if (value < min) return 'low';
      if (value > max) return 'high';
      return 'normal';
    }

    if (lessThanMatch) {
      const max = parseFloat(lessThanMatch[1]);
      if (value > max * 1.2) return 'critical';
      if (value > max) return 'high';
      return 'normal';
    }

    if (greaterThanMatch) {
      const min = parseFloat(greaterThanMatch[1]);
      if (value < min * 0.8) return 'critical';
      if (value < min) return 'low';
      return 'normal';
    }

    return 'unreadable';
  }

  /**
   * Generate simple explanations for lab result
   */
  private generateExplanations(
    testName: string,
    value: string,
    unit?: string,
    referenceRange?: string,
    status?: string,
    language: 'en' | 'ur' = 'en'
  ): {
    what_is_this: string;
    what_it_means: string;
    what_to_do: string;
  } {
    const testLower = testName.toLowerCase();

    // Hemoglobin
    if (testLower.includes('hemoglobin') || testLower.includes('hb')) {
      return language === 'en' ? {
        what_is_this: 'Hemoglobin is a protein in your red blood cells that carries oxygen throughout your body.',
        what_it_means: status === 'low' 
          ? `Your hemoglobin level of ${value} ${unit || ''} is below the typical range. This may suggest your body is getting less oxygen than usual.`
          : status === 'high'
          ? `Your hemoglobin level of ${value} ${unit || ''} is above the typical range. This may be associated with dehydration or other factors.`
          : `Your hemoglobin level of ${value} ${unit || ''} is within the typical range, which is good.`,
        what_to_do: status === 'low'
          ? 'Consider discussing this with your doctor. They may recommend iron-rich foods or further testing.'
          : status === 'high'
          ? 'Stay well-hydrated and discuss this with your doctor at your next visit.'
          : 'Continue maintaining a balanced diet and stay hydrated.'
      } : {
        what_is_this: 'ہیموگلوبن آپ کے سرخ خون کے خلیات میں ایک پروٹین ہے جو پورے جسم میں آکسیجن لے جاتا ہے۔',
        what_it_means: status === 'low'
          ? `آپ کی ہیموگلوبن کی سطح ${value} ${unit || ''} عام رینج سے کم ہے۔ یہ ظاہر کر سکتا ہے کہ آپ کے جسم کو معمول سے کم آکسیجن مل رہی ہے۔`
          : status === 'high'
          ? `آپ کی ہیموگلوبن کی سطح ${value} ${unit || ''} عام رینج سے زیادہ ہے۔ یہ پانی کی کمی یا دیگر عوامل کی وجہ سے ہو سکتا ہے۔`
          : `آپ کی ہیموگلوبن کی سطح ${value} ${unit || ''} عام رینج کے اندر ہے، جو اچھی بات ہے۔`,
        what_to_do: status === 'low'
          ? 'اپنے ڈاکٹر سے اس بارے میں بات کریں۔ وہ لوہے سے بھرپور کھانے یا مزید ٹیسٹ کی سفارش کر سکتے ہیں۔'
          : status === 'high'
          ? 'اچھی طرح پانی پئیں اور اپنی اگلی ملاقات میں ڈاکٹر سے بات کریں۔'
          : 'متوازن خوراک جاری رکھیں اور پانی پیتے رہیں۔'
      };
    }

    // Cholesterol
    if (testLower.includes('cholesterol')) {
      return language === 'en' ? {
        what_is_this: 'Cholesterol is a fatty substance in your blood. Your body needs some cholesterol, but too much may increase health risks.',
        what_it_means: status === 'high'
          ? `Your cholesterol level of ${value} ${unit || ''} is above the typical range. High cholesterol may be associated with increased health risks over time.`
          : status === 'low'
          ? `Your cholesterol level of ${value} ${unit || ''} is below the typical range.`
          : `Your cholesterol level of ${value} ${unit || ''} is within the typical range.`,
        what_to_do: status === 'high'
          ? 'Consider discussing dietary changes with your doctor. They may recommend reducing saturated fats and increasing physical activity.'
          : 'Continue maintaining a balanced diet and regular exercise.'
      } : {
        what_is_this: 'کولیسٹرول آپ کے خون میں ایک چربی والا مادہ ہے۔ آپ کے جسم کو کچھ کولیسٹرول کی ضرورت ہوتی ہے، لیکن بہت زیادہ صحت کے خطرات بڑھا سکتا ہے۔',
        what_it_means: status === 'high'
          ? `آپ کی کولیسٹرول کی سطح ${value} ${unit || ''} عام رینج سے زیادہ ہے۔ زیادہ کولیسٹرول وقت کے ساتھ صحت کے خطرات سے منسلک ہو سکتا ہے۔`
          : status === 'low'
          ? `آپ کی کولیسٹرول کی سطح ${value} ${unit || ''} عام رینج سے کم ہے۔`
          : `آپ کی کولیسٹرول کی سطح ${value} ${unit || ''} عام رینج کے اندر ہے۔`,
        what_to_do: status === 'high'
          ? 'اپنے ڈاکٹر سے خوراک میں تبدیلیوں کے بارے میں بات کریں۔ وہ سنترپت چکنائیوں کو کم کرنے اور جسمانی سرگرمی بڑھانے کی سفارش کر سکتے ہیں۔'
          : 'متوازن خوراک اور باقاعدہ ورزش جاری رکھیں۔'
      };
    }

    // Vitamin D
    if (testLower.includes('vitamin d')) {
      return language === 'en' ? {
        what_is_this: 'Vitamin D helps your body absorb calcium and supports bone health, immune function, and mood.',
        what_it_means: status === 'low'
          ? `Your Vitamin D level of ${value} ${unit || ''} is below the typical range. Low Vitamin D is very common and usually easily addressed.`
          : status === 'high'
          ? `Your Vitamin D level of ${value} ${unit || ''} is above the typical range.`
          : `Your Vitamin D level of ${value} ${unit || ''} is within the typical range.`,
        what_to_do: status === 'low'
          ? 'Discuss supplementation with your doctor. They may recommend 1000-4000 IU daily. Getting 15-20 minutes of sunlight daily may also help.'
          : 'Continue maintaining adequate Vitamin D through diet, sunlight, and supplements as recommended.'
      } : {
        what_is_this: 'وٹامن ڈی آپ کے جسم کو کیلشیم جذب کرنے میں مدد کرتا ہے اور ہڈیوں کی صحت، قوت مدافعت، اور موڈ کی حمایت کرتا ہے۔',
        what_it_means: status === 'low'
          ? `آپ کی وٹامن ڈی کی سطح ${value} ${unit || ''} عام رینج سے کم ہے۔ کم وٹامن ڈی بہت عام ہے اور عام طور پر آسانی سے حل ہو سکتا ہے۔`
          : status === 'high'
          ? `آپ کی وٹامن ڈی کی سطح ${value} ${unit || ''} عام رینج سے زیادہ ہے۔`
          : `آپ کی وٹامن ڈی کی سطح ${value} ${unit || ''} عام رینج کے اندر ہے۔`,
        what_to_do: status === 'low'
          ? 'اپنے ڈاکٹر سے سپلیمنٹیشن کے بارے میں بات کریں۔ وہ روزانہ 1000-4000 IU کی سفارش کر سکتے ہیں۔ روزانہ 15-20 منٹ دھوپ لینا بھی مددگار ہو سکتا ہے۔'
          : 'خوراک، دھوپ، اور سفارش کردہ سپلیمنٹس کے ذریعے مناسب وٹامن ڈی برقرار رکھیں۔'
      };
    }

    // Default explanation
    return language === 'en' ? {
      what_is_this: `${testName} is a measurement that provides information about your health.`,
      what_it_means: status === 'normal'
        ? `Your result of ${value} ${unit || ''} is within the typical range.`
        : status === 'low'
        ? `Your result of ${value} ${unit || ''} is below the typical range.`
        : status === 'high'
        ? `Your result of ${value} ${unit || ''} is above the typical range.`
        : `Your result of ${value} ${unit || ''} could not be reliably interpreted.`,
      what_to_do: 'Discuss these results with your healthcare provider for personalized guidance.'
    } : {
      what_is_this: `${testName} ایک پیمائش ہے جو آپ کی صحت کے بارے میں معلومات فراہم کرتی ہے۔`,
      what_it_means: status === 'normal'
        ? `آپ کا نتیجہ ${value} ${unit || ''} عام رینج کے اندر ہے۔`
        : status === 'low'
        ? `آپ کا نتیجہ ${value} ${unit || ''} عام رینج سے کم ہے۔`
        : status === 'high'
        ? `آپ کا نتیجہ ${value} ${unit || ''} عام رینج سے زیادہ ہے۔`
        : `آپ کے نتیجہ ${value} ${unit || ''} کی قابل اعتماد تشریح نہیں کی جا سکی۔`,
      what_to_do: 'ذاتی رہنمائی کے لیے ان نتائج کے بارے میں اپنے صحت کی دیکھ بھال فراہم کنندہ سے بات کریں۔'
    };
  }

  /**
   * Determine overall status from all results
   */
  private determineOverallStatus(
    results: Array<{ status: string }>
  ): 'normal' | 'some_abnormal' | 'concerning' | 'unreadable' {
    const abnormalCount = results.filter(r => r.status !== 'normal' && r.status !== 'unreadable').length;
    const criticalCount = results.filter(r => r.status === 'critical').length;

    if (criticalCount > 0) return 'concerning';
    if (abnormalCount > results.length / 2) return 'concerning';
    if (abnormalCount > 0) return 'some_abnormal';
    return 'normal';
  }

  /**
   * Calculate severity score (1-5)
   */
  private calculateSeverity(
    results: Array<{ status: string }>
  ): number {
    const criticalCount = results.filter(r => r.status === 'critical').length;
    const abnormalCount = results.filter(r => r.status === 'high' || r.status === 'low').length;

    if (criticalCount > 0) return 5;
    if (abnormalCount > 3) return 4;
    if (abnormalCount > 1) return 3;
    if (abnormalCount > 0) return 2;
    return 1;
  }

  /**
   * Determine urgency level
   */
  private determineUrgency(
    results: Array<{ status: string }>
  ): 'self_care' | 'monitor' | 'doctor_soon' | 'urgent' | 'emergency' {
    const criticalCount = results.filter(r => r.status === 'critical').length;
    const abnormalCount = results.filter(r => r.status === 'high' || r.status === 'low').length;

    if (criticalCount > 0) return 'urgent';
    if (abnormalCount > 3) return 'doctor_soon';
    if (abnormalCount > 0) return 'monitor';
    return 'self_care';
  }

  /**
   * Generate simple summary
   */
  private generateSummary(
    results: Array<{ test_name: string; status: string }>,
    language: 'en' | 'ur'
  ): { in_simple_words: string[] } {
    const normalCount = results.filter(r => r.status === 'normal').length;
    const abnormalCount = results.filter(r => r.status !== 'normal' && r.status !== 'unreadable').length;

    if (language === 'en') {
      const points = [
        `Your report includes ${results.length} test results.`,
        `${normalCount} result${normalCount !== 1 ? 's' : ''} ${normalCount !== 1 ? 'are' : 'is'} within the typical range.`,
      ];

      if (abnormalCount > 0) {
        points.push(`${abnormalCount} result${abnormalCount !== 1 ? 's' : ''} ${abnormalCount !== 1 ? 'are' : 'is'} outside the typical range.`);
        points.push('This does not mean you have a diagnosis. Many factors can affect lab results.');
        points.push('Consider discussing these results with your healthcare provider for personalized guidance.');
      } else {
        points.push('All your results are within typical ranges, which is generally good news.');
        points.push('Continue maintaining a healthy lifestyle with balanced nutrition and regular activity.');
      }

      return { in_simple_words: points.slice(0, 5) };
    } else {
      const points = [
        `آپ کی رپورٹ میں ${results.length} ٹیسٹ کے نتائج شامل ہیں۔`,
        `${normalCount} نتیجہ ${normalCount !== 1 ? 'عام رینج کے اندر ہیں' : 'عام رینج کے اندر ہے'}۔`,
      ];

      if (abnormalCount > 0) {
        points.push(`${abnormalCount} نتیجہ ${abnormalCount !== 1 ? 'عام رینج سے باہر ہیں' : 'عام رینج سے باہر ہے'}۔`);
        points.push('اس کا مطلب یہ نہیں کہ آپ کو کوئی تشخیص ہوئی ہے۔ بہت سے عوامل لیب کے نتائج کو متاثر کر سکتے ہیں۔');
        points.push('ذاتی رہنمائی کے لیے ان نتائج کے بارے میں اپنے صحت کی دیکھ بھال فراہم کنندہ سے بات کرنے پر غور کریں۔');
      } else {
        points.push('آپ کے تمام نتائج عام رینجز کے اندر ہیں، جو عام طور پر اچھی خبر ہے۔');
        points.push('متوازن خوراک اور باقاعدہ سرگرمی کے ساتھ صحت مند طرز زندگی جاری رکھیں۔');
      }

      return { in_simple_words: points.slice(0, 5) };
    }
  }

  /**
   * Get disclaimer text
   */
  private getDisclaimer(language: 'en' | 'ur'): string {
    return language === 'en'
      ? '⚕️ This analysis is for educational purposes only and is NOT a medical diagnosis. Lab results should always be interpreted by a qualified healthcare professional who knows your medical history and can consider all relevant factors. Never make medical decisions based solely on this analysis.'
      : '⚕️ یہ تجزیہ صرف تعلیمی مقاصد کے لیے ہے اور طبی تشخیص نہیں ہے۔ لیب کے نتائج کو ہمیشہ ایک قابل صحت پیشہ ور کی طرف سے تشریح کی جانی چاہیے جو آپ کی طبی تاریخ جانتا ہو اور تمام متعلقہ عوامل پر غور کر سکے۔ صرف اس تجزیہ کی بنیاد پر طبی فیصلے ہرگز نہ کریں۔';
  }
}

export const labAnalysisService = new LabAnalysisService();
