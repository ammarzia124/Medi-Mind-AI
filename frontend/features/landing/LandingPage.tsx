import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid,
  Stack,
  Paper
} from '@mui/material';
import { 
  Favorite as HeartIcon,
  Science as LabIcon,
  Medication as MedicationIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Accessibility as AccessibilityIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme/designTokens';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <HeartIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Symptom Checker' : 'علامات چیکر',
      description: language === 'en'
        ? 'Understand your symptoms and get guidance on what to do next'
        : 'اپنی علامات سمجھیں اور جانیں کہ آگے کیا کرنا ہے',
      color: colors.primary.main,
    },
    {
      icon: <LabIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Lab Report Reader' : 'لیب رپورٹ ریڈر',
      description: language === 'en'
        ? 'Get clear explanations of your lab results in simple language'
        : 'آسان زبان میں اپنے لیب نتائج کی واضح وضاحت حاصل کریں',
      color: colors.info.main,
    },
    {
      icon: <MedicationIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Medication Safety' : 'ادویات کی حفاظت',
      description: language === 'en'
        ? 'Check for interactions and understand your medications'
        : 'تعامل چیک کریں اور اپنی ادویات سمجھیں',
      color: colors.success.main,
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: language === 'en' ? 'Health Timeline' : 'صحت ٹائم لائن',
      description: language === 'en'
        ? 'Track your health journey in one place'
        : 'ایک جگہ پر اپنا صحت کا سفر ٹریک کریں',
      color: colors.warning.main,
    },
  ];

  const benefits = [
    {
      icon: <ShieldIcon />,
      title: language === 'en' ? 'Private & Secure' : 'نجی اور محفوظ',
      description: language === 'en'
        ? 'Your health data is encrypted and never shared'
        : 'آپ کی صحت کا ڈیٹا خفیہ ہے اور کبھی شیئر نہیں کیا جاتا',
    },
    {
      icon: <SpeedIcon />,
      title: language === 'en' ? 'Fast & Easy' : 'تیز اور آسان',
      description: language === 'en'
        ? 'Get answers in seconds, not hours'
        : 'سیکنڈوں میں جوابات حاصل کریں، گھنٹوں میں نہیں',
    },
    {
      icon: <AccessibilityIcon />,
      title: language === 'en' ? 'Accessible' : 'قابل رسائی',
      description: language === 'en'
        ? 'Available in English and Urdu, designed for everyone'
        : 'انگریزی اور اردو میں دستیاب، سب کے لیے ڈیزائن کیا گیا',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.2,
                }}
              >
                {language === 'en'
                  ? 'Understand your health. Know what to do next.'
                  : 'اپنی صحت سمجھیں۔ جانیں کہ آگے کیا کرنا ہے۔'}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  fontWeight: 400,
                }}
              >
                {language === 'en'
                  ? 'MediMind AI helps you understand symptoms, lab reports, and medications — in simple language you can trust.'
                  : 'میڈی مائنڈ اے آئی آپ کو علامات، لیب رپورٹس، اور ادویات سمجھنے میں مدد کرتا ہے — آسان زبان میں جس پر آپ اعتماد کر سکتے ہیں۔'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/symptoms')}
                  sx={{
                    bgcolor: 'white',
                    color: colors.primary.main,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {language === 'en' ? 'Check Symptoms' : 'علامات چیک کریں'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {language === 'en' ? 'Go to Dashboard' : 'ڈیش بورڈ پر جائیں'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 700, mb: 2 }}
        >
          {language === 'en' ? 'Everything you need for your health' : 'آپ کی صحت کے لیے ہر چیز'}
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6, fontWeight: 400 }}
        >
          {language === 'en'
            ? 'Simple tools to help you understand and manage your health'
            : 'آپ کی صحت کو سمجھنے اور منظم کرنے میں مدد کے لیے آسان ٹولز'}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  border: `1px solid ${colors.border.main}`,
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    borderColor: feature.color,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: colors.background.subtle, py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            {language === 'en' ? 'Why choose MediMind?' : 'میڈی مائنڈ کیوں منتخب کریں؟'}
          </Typography>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: colors.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
            borderRadius: 4,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
            {language === 'en' 
              ? 'Ready to take control of your health?'
              : 'اپنی صحت کا کنٹرول لینے کے لیے تیار ہیں؟'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
            {language === 'en'
              ? 'Start using MediMind AI today — it\'s free and takes less than a minute.'
              : 'آج ہی میڈی مائنڈ اے آئی استعمال کریں — یہ مفت ہے اور ایک منٹ سے کم وقت لیتا ہے۔'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {language === 'en' ? 'Get Started' : 'شروع کریں'}
          </Button>
        </Paper>
      </Container>

      {/* Disclaimer */}
      <Container maxWidth="md">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ 
            fontStyle: 'italic',
            p: 3,
            borderTop: `1px solid ${colors.border.main}`,
          }}
        >
          {language === 'en'
            ? '⚕️ MediMind AI provides health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.'
            : '⚕️ میڈی مائنڈ اے آئی صرف تعلیمی مقاصد کے لیے صحت کی معلومات فراہم کرتا ہے۔ یہ پیشہ ورانہ طبی مشورے، تشخیص، یا علاج کا متبادل نہیں ہے۔ ہمیشہ ایک قابل صحت فراہم کنندہ سے مشورہ کریں۔'}
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingPage;
