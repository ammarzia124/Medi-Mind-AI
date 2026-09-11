import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack,
  Alert,
  Chip,
  CircularProgress,
  Divider,
  Container
} from '@mui/material';
import { 
  Send as SendIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { SeverityIndicator, EmergencyAlert } from '../../components';
import { SymptomAnalysis } from '../../lib/schemas';
import { symptomService } from '../../services/symptomService';
import { useNavigate } from 'react-router-dom';

export const SymptomTriage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError(language === 'en' 
        ? 'Please describe your symptoms'
        : 'براہ کرم اپنی علامات بیان کریں'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await symptomService.analyzeSymptoms(symptoms);
      setResult(analysis);
    } catch (err) {
      setError(language === 'en'
        ? 'Failed to analyze symptoms. Please try again.'
        : 'علامات کا تجزیہ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  // Common symptoms for quick selection
  const quickSymptoms = language === 'en' 
    ? ['Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness']
    : ['سر درد', 'بخار', 'کھانسی', 'تھکاوٹ', 'متلی', 'چکر'];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ color: 'text.secondary' }}
          >
            {language === 'en' ? 'Back' : 'واپس'}
          </Button>
        </Stack>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {language === 'en' ? 'Symptom Checker' : 'علامات چیکر'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'en'
            ? 'Describe your symptoms and get guidance on what to do next'
            : 'اپنی علامات بیان کریں اور جانیں کہ آگے کیا کرنا ہے'}
        </Typography>

        {/* Input Form */}
        {!result && (
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={language === 'en'
                    ? 'Describe your symptoms... (e.g., "I have a headache and feel tired")'
                    : 'اپنی علامات بیان کریں... (مثلاً "مجھے سر درد ہے اور تھکاوٹ محسوس ہو رہی ہے")'}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Quick symptom chips */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {language === 'en' ? 'Common symptoms:' : 'عام علامات:'}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {quickSymptoms.map((symptom) => (
                      <Chip
                        key={symptom}
                        label={symptom}
                        onClick={() => setSymptoms(symptoms ? `${symptoms}, ${symptom.toLowerCase()}` : symptom.toLowerCase())}
                        disabled={loading}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: colors.primary[50],
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={loading || !symptoms.trim()}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading 
                    ? (language === 'en' ? 'Analyzing...' : 'تجزیہ ہو رہا ہے...')
                    : (language === 'en' ? 'Analyze Symptoms' : 'علامات کا تجزیہ کریں')
                  }
                </Button>
              </Stack>
            </form>
          </Paper>
        )}

        {/* Results */}
        {result && (
          <Stack spacing={3}>
            {/* Emergency Alert */}
            {result.urgency === 'emergency' && (
              <EmergencyAlert
                message={result.recommended_action}
                onClose={handleReset}
              />
            )}

            {/* Severity & Urgency */}
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {language === 'en' ? 'Severity Level' : 'شدت کی سطح'}
                  </Typography>
                  <SeverityIndicator severity={result.severity} size="large" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {language === 'en' ? 'Urgency' : 'فوری ضرورت'}
                  </Typography>
                  <Chip
                    label={result.urgency.replace('_', ' ').toUpperCase()}
                    color={
                      result.urgency === 'emergency' ? 'error' :
                      result.urgency === 'urgent' ? 'warning' :
                      result.urgency === 'doctor_soon' ? 'info' :
                      'success'
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Summary */}
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'What This May Suggest' : 'یہ کیا ظاہر کر سکتا ہے'}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {result.summary}
              </Typography>
            </Paper>

            {/* Possible Explanations */}
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'Possible Explanations' : 'ممکنہ وضاحتیں'}
              </Typography>
              <Stack spacing={1.5}>
                {result.possible_explanations.map((explanation, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                    <CheckIcon sx={{ color: colors.success.main, fontSize: 20, mt: 0.5 }} />
                    <Typography variant="body2">{explanation}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Warning Signs */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: `1px solid ${colors.warning.main}30`,
                bgcolor: `${colors.warning.main}05`,
                borderRadius: 3 
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.warning.dark }}>
                <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {language === 'en' ? 'Warning Signs — Seek Medical Care If You Notice' : 'انتباہی علامات — اگر آپ نوٹ کریں تو طبی امداد لیں'}
              </Typography>
              <Stack spacing={1.5}>
                {result.warning_signs.map((sign, index) => (
                  <Typography key={index} variant="body2" sx={{ lineHeight: 1.8 }}>
                    {sign}
                  </Typography>
                ))}
              </Stack>
            </Paper>

            {/* Recommended Action */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                border: `1px solid ${colors.info.main}30`,
                bgcolor: `${colors.info.main}05`,
                borderRadius: 3 
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.info.dark }}>
                {language === 'en' ? 'Recommended Next Step' : 'تجویز کردہ اگلا قدم'}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {result.recommended_action}
              </Typography>
            </Paper>

            {/* Self Care */}
            {result.self_care.length > 0 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: `1px solid ${colors.success.main}30`,
                  bgcolor: `${colors.success.main}05`,
                  borderRadius: 3 
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.success.dark }}>
                  {language === 'en' ? 'Self-Care Options' : 'گھریلو علاج کے اختیارات'}
                </Typography>
                <Stack spacing={1.5}>
                  {result.self_care.map((care, index) => (
                    <Typography key={index} variant="body2" sx={{ lineHeight: 1.8 }}>
                      {care}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Disclaimer */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {result.disclaimer}
            </Alert>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {language === 'en' ? 'Check Another Symptom' : 'دوسری علامت چیک کریں'}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {language === 'en' ? 'Back to Dashboard' : 'ڈیش بورڈ پر واپس'}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default SymptomTriage;
