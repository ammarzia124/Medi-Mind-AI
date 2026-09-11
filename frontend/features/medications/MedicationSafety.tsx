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
  Container,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { MedicationInteraction } from '../../services/medicationService';
import { medicationService } from '../../services/medicationService';
import { useNavigate } from 'react-router-dom';

export const MedicationSafety: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [medications, setMedications] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState<MedicationInteraction[] | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAddMedication = () => {
    setMedications([...medications, '']);
  };

  const handleRemoveMedication = (index: number) => {
    if (medications.length === 1) {
      setMedications(['']);
    } else {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleMedicationChange = (index: number, value: string) => {
    const updated = [...medications];
    updated[index] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validMedications = medications.filter(m => m.trim());
    
    if (validMedications.length < 2) {
      setError(language === 'en' 
        ? 'Please enter at least 2 medications to check for interactions'
        : 'تعامل چیک کرنے کے لیے براہ کرم کم از کم 2 ادویات درج کریں'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setInteractions(null);
    setSummary('');

    try {
      const result = await medicationService.checkInteractions(validMedications);
      setInteractions(result.interactions);
      setSummary(result.summary);
    } catch (err) {
      setError(language === 'en'
        ? 'Failed to check interactions. Please try again.'
        : 'تعامل چیک کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMedications(['']);
    setInteractions(null);
    setSummary('');
    setError(null);
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return colors.error.main;
    if (severity >= 3) return colors.warning.main;
    return colors.info.main;
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 4) return language === 'en' ? 'High' : 'زیادہ';
    if (severity >= 3) return language === 'en' ? 'Moderate' : 'درمیانہ';
    return language === 'en' ? 'Low' : 'کم';
  };

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
          {language === 'en' ? 'Medication Safety Check' : 'ادویات کی حفاظت چیک'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'en'
            ? 'Check for potential interactions between your medications'
            : 'اپنی ادویات کے درمیان ممکنہ تعامل چیک کریں'}
        </Typography>

        {/* Input Form */}
        {!interactions && (
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Typography variant="body2" color="text.secondary">
                  {language === 'en' 
                    ? 'Enter the medications you are currently taking:'
                    : 'ادویات درج کریں جو آپ فی الحال لے رہے ہیں:'}
                </Typography>

                {medications.map((medication, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <TextField
                      fullWidth
                      value={medication}
                      onChange={(e) => handleMedicationChange(index, e.target.value)}
                      placeholder={language === 'en'
                        ? `Medication ${index + 1} (e.g., "Aspirin", "Ibuprofen")`
                        : `دوا ${index + 1} (مثلاً "ایسپرین", "آئبوپروفین")`}
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <IconButton 
                      onClick={() => handleRemoveMedication(index)}
                      disabled={loading || medications.length === 1}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMedication}
                  disabled={loading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {language === 'en' ? 'Add Another Medication' : 'دوسری دوا شامل کریں'}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  disabled={loading || medications.filter(m => m.trim()).length < 2}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading 
                    ? (language === 'en' ? 'Checking...' : 'چیک ہو رہا ہے...')
                    : (language === 'en' ? 'Check Interactions' : 'تعامل چیک کریں')
                  }
                </Button>
              </Stack>
            </form>
          </Paper>
        )}

        {/* Results */}
        {interactions && (
          <Stack spacing={3}>
            {/* Summary */}
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
                {language === 'en' ? 'Summary' : 'خلاصہ'}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {summary}
              </Typography>
            </Paper>

            {/* Interactions */}
            {interactions.length > 0 ? (
              <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {language === 'en' ? 'Potential Interactions' : 'ممکنہ تعاملات'}
                </Typography>
                <Stack spacing={2}>
                  {interactions.map((interaction, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: `1px solid ${getSeverityColor(interaction.severity)}30`,
                        bgcolor: `${getSeverityColor(interaction.severity)}05`,
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {interaction.interaction_type}
                        </Typography>
                        <Chip
                          label={getSeverityLabel(interaction.severity)}
                          size="small"
                          sx={{
                            bgcolor: getSeverityColor(interaction.severity),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>
                        {interaction.description}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: colors.info.dark }}>
                        {language === 'en' ? 'Recommendation: ' : 'سفارش: '}
                        {interaction.recommendation}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: `1px solid ${colors.success.main}30`,
                  bgcolor: `${colors.success.main}05`,
                  borderRadius: 3 
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckIcon sx={{ color: colors.success.main, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.success.dark }}>
                      {language === 'en' ? 'No Interactions Found' : 'کوئی تعامل نہیں ملا'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en'
                        ? 'No known interactions were found between your medications.'
                        : 'آپ کی ادویات کے درمیان کوئی معلوم تعامل نہیں ملا۔'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Important Note */}
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                {language === 'en'
                  ? '⚕️ This information is for educational purposes only. Always consult with your doctor or pharmacist about your medications. Do not stop or change any medications without professional guidance.'
                  : '⚕️ یہ معلومات صرف تعلیمی مقاصد کے لیے ہے۔ اپنی ادویات کے بارے میں ہمیشہ اپنے ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔ پیشہ ورانہ رہنمائی کے بغیر کوئی بھی دوا بند نہ کریں یا تبدیل نہ کریں۔'}
              </Typography>
            </Alert>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {language === 'en' ? 'Check Again' : 'دوبارہ چیک کریں'}
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

export default MedicationSafety;
