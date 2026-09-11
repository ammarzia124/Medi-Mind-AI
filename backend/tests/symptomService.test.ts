import { symptomService } from '../src/services/symptomService';

describe('SymptomService', () => {
  describe('analyzeSymptoms', () => {
    it('should analyze headache symptoms correctly', async () => {
      const result = await symptomService.analyzeSymptoms('I have a headache');
      
      expect(result).toBeDefined();
      expect(result.severity).toBe('low');
      expect(result.causes).toBeInstanceOf(Array);
      expect(result.selfCare).toBeInstanceOf(Array);
      expect(result.careNavigation).toBe('selfCare');
    });

    it('should detect emergency symptoms', async () => {
      const result = await symptomService.analyzeSymptoms('I have chest pain and difficulty breathing');
      
      expect(result).toBeDefined();
      expect(result.severity).toBe('high');
      expect(result.careNavigation).toBe('emergency');
    });

    it('should handle fever symptoms', async () => {
      const result = await symptomService.analyzeSymptoms('I have a fever');
      
      expect(result).toBeDefined();
      expect(result.severity).toBe('moderate');
      expect(result.careNavigation).toBe('routine');
    });
  });
});
