import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack,
  Alert,
  LinearProgress,
  Container,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { LabAnalysis } from '../../lib/schemas';
import { labService } from '../../services/labService';
import { useNavigate } from 'react-router-dom';
import { validateFile } from '../../lib/security';

type ProcessingStage = 'idle' | 'uploading' | 'reading' | 'analyzing' | 'complete' | 'error';

export const LabReportReader: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [result, setResult] = useState<LabAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<number>>(new Set());

  const t = (en: string, ur: string) => language === 'en' ? en : ur;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setProcessingStage('idle');
    setResult(null);
  };

  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setError(null);
      setProcessingStage('uploading');
      setUploadProgress(0);
      setStatusMessage(t('Uploading your report...', 'آپ کی رپورٹ اپ لوڈ ہو رہی ہے...'));

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Reading stage with status messages
      setProcessingStage('reading');
      setStatusMessage(t('Reading your report...', 'آپ کی رپورٹ پڑھی جا رہی ہے...'));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStatusMessage(t('Finding test results...', 'ٹیسٹ کے نتائج تلاش کیے جا رہے ہیں...'));
      await new Promise(resolve => setTimeout(resolve, 800));

      // Analyzing stage with status messages
      setProcessingStage('analyzing');
      setStatusMessage(t('Preparing a simple explanation...', 'آسان وضاحت تیار کی جا رہی ہے...'));
      
      // Call backend API
      const analysis = await labService.analyzeLabReport(file.name);
      
      setResult(analysis);
      setProcessingStage('complete');
      setStatusMessage('');
    } catch (err) {
      setError(t(
        'Failed to analyze lab report. Please try again.',
        'لیب رپورٹ کا تجزیہ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔'
      ));
      setProcessingStage('error');
      setStatusMessage('');
    }
  };

  const toggleResultExpansion = (index: number) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckIcon sx={{ color: colors.success.main }} />;
      case 'low':
      case 'high':
        return <WarningIcon sx={{ color: colors.warning.main }} />;
      case 'critical':
        return <ErrorIcon sx={{ color: colors.error.main }} />;
      default:
        return <InfoIcon sx={{ color: colors.text.secondary }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return colors.success.main;
      case 'low':
      case 'high':
        return colors.warning.main;
      case 'critical':
        return colors.error.main;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ur: string }> = {
      normal: { en: 'Normal', ur: 'معمول' },
      low: { en: 'Low', ur: 'کم' },
      high: { en: 'High', ur: 'زیادہ' },
      critical: { en: 'Critical', ur: 'سنجیدہ' },
      unreadable: { en: 'Unreadable', ur: 'غیر پڑھنے کے قابل' }
    };
    return labels[status]?.[language] || status;
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return colors.success.main;
      case 'some_abnormal':
        return colors.warning.main;
      case 'concerning':
        return colors.error.main;
      default:
        return colors.text.secondary;
    }
  };

  // Upload Screen
  if (processingStage === 'idle' || processingStage === 'error') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {t('Lab Report Reader', 'لیب رپورٹ ریڈر')}
          </Typography>
        </Stack>

        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            border: `2px dashed ${dragActive ? colors.primary.main : colors.border.main}`,
            borderRadius: 3,
            bgcolor: dragActive ? colors.primary[50] : 'transparent',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': {
              borderColor: colors.primary.light,
              bgcolor: colors.primary[50]
            }
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
          />
          <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
            <Stack alignItems="center" spacing={2}>
              <UploadIcon sx={{ fontSize: 64, color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('Upload your lab report', 'اپنی لیب رپورٹ اپ لوڈ کریں')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('PDF, JPG, PNG • Max 10MB', 'PDF, JPG, PNG • زیادہ سے زیادہ 10MB')}
              </Typography>
            </Stack>
          </label>
        </Paper>

        {file && (
          <Paper elevation={0} sx={{ p: 3, mt: 3, border: `1px solid ${colors.border.main}`, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FileIcon sx={{ color: colors.primary.main }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <IconButton onClick={handleRemoveFile} size="small">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {file && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 3, py: 2, borderRadius: 2, fontWeight: 600 }}
          >
            {t('Analyze Report', 'رپورٹ کا تجزیہ کریں')}
          </Button>
        )}
      </Container>
    );
  }

  // Processing Screen - Enhanced Demo Flow
  if (processingStage === 'uploading' || processingStage === 'reading' || processingStage === 'analyzing') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack alignItems="center" spacing={4} sx={{ py: 8 }}>
          {processingStage === 'uploading' && (
            <>
              <UploadIcon sx={{ fontSize: 80, color: colors.primary.main, animation: 'pulse 2s infinite' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {statusMessage || t('Uploading your report...', 'آپ کی رپورٹ اپ لوڈ ہو رہی ہے...')}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  width: '100%', 
                  maxWidth: 500, 
                  height: 10, 
                  borderRadius: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.primary.main,
                  }
                }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                {uploadProgress}%
              </Typography>
            </>
          )}

          {processingStage === 'reading' && (
            <>
              <FileIcon sx={{ fontSize: 80, color: colors.primary.main, animation: 'pulse 2s infinite' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {statusMessage}
              </Typography>
              <LinearProgress 
                sx={{ 
                  width: '100%', 
                  maxWidth: 500, 
                  height: 10, 
                  borderRadius: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.primary.main,
                  }
                }} 
              />
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                {language === 'en' 
                  ? 'This usually takes a few seconds...'
                  : 'اس میں عام طور پر چند سیکنڈ لگتے ہیں...'}
              </Typography>
            </>
          )}

          {processingStage === 'analyzing' && (
            <>
              <InfoIcon sx={{ fontSize: 80, color: colors.primary.main, animation: 'pulse 2s infinite' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {statusMessage}
              </Typography>
              <LinearProgress 
                sx={{ 
                  width: '100%', 
                  maxWidth: 500, 
                  height: 10, 
                  borderRadius: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: colors.primary.main,
                  }
                }} 
              />
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                {language === 'en' 
                  ? 'Almost ready...'
                  : 'تقریباً تیار ہے...'}
              </Typography>
            </>
          )}
        </Stack>
      </Container>
    );
  }

  // Results Screen
  if (processingStage === 'complete' && result) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {t('Your Report', 'آپ کی رپورٹ')}
          </Typography>
        </Stack>

        {/* Summary Card */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            border: `2px solid ${getOverallStatusColor(result.overall_status)}`,
            borderRadius: 3 
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Chip 
                label={result.overall_status.replace('_', ' ').toUpperCase()}
                sx={{ 
                  bgcolor: getOverallStatusColor(result.overall_status),
                  color: 'white',
                  fontWeight: 700
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('In Simple Words', 'آسان الفاظ میں')}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              {result.summary.in_simple_words.map((point, idx) => (
                <Typography key={idx} variant="body1">
                  {point}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.background.subtle }}>
                  <TableCell sx={{ fontWeight: 700 }}>{t('Test', 'ٹیسٹ')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>{t('Result', 'نتیجہ')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>{t('Reference', 'حوالہ')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>{t('Status', 'حالت')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.results.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <TableRow 
                      hover
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: colors.background.subtle }
                      }}
                      onClick={() => toggleResultExpansion(idx)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {getStatusIcon(item.status)}
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.test_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.result_value} {item.result_unit}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {item.reference_range || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={getStatusLabel(item.status)}
                          size="small"
                          sx={{ 
                            bgcolor: `${getStatusColor(item.status)}20`,
                            color: getStatusColor(item.status),
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ py: 0, border: 0 }}>
                        <Collapse in={expandedResults.has(idx)} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 2, px: 3, bgcolor: colors.background.subtle }}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {t('What is this?', 'یہ کیا ہے؟')}
                                </Typography>
                                <Typography variant="body2">
                                  {item.what_is_this}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {t('Your result', 'آپ کا نتیجہ')}
                                </Typography>
                                <Typography variant="body2">
                                  {item.result_value} {item.result_unit}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {t('What does it mean?', 'اس کا کیا مطلب ہے؟')}
                                </Typography>
                                <Typography variant="body2">
                                  {item.what_it_means}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {t('What should I do?', 'مجھے کیا کرنا چاہیے؟')}
                                </Typography>
                                <Typography variant="body2">
                                  {item.what_to_do}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Language Switcher - WOW MOMENT */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            p: 3,
            border: `1px solid ${colors.border.main}`,
            borderRadius: 3,
            bgcolor: colors.background.subtle,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {language === 'en' 
              ? '🌍 See this in another language:'
              : '🌍 دوسری زبان میں دیکھیں:'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant={language === 'en' ? 'contained' : 'outlined'}
              onClick={() => language !== 'en' && window.location.reload()}
              sx={{ borderRadius: 2, minWidth: 100 }}
            >
              English
            </Button>
            <Button
              variant={language === 'ur' ? 'contained' : 'outlined'}
              onClick={() => language !== 'ur' && window.location.reload()}
              sx={{ borderRadius: 2, minWidth: 100 }}
            >
              اردو
            </Button>
          </Stack>
        </Paper>

        {/* Care Navigation - WOW MOMENT */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            p: 4,
            border: `2px solid ${colors.primary.main}`,
            borderRadius: 3,
            bgcolor: colors.primary[50],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: colors.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}
            >
              <InfoIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {t('What should I do next?', 'مجھے آگے کیا کرنا چاہیے؟')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                {result.urgency === 'self_care' && t(
                  'Your results look generally good. Continue maintaining a healthy lifestyle.',
                  'آپ کے نتائج عام طور پر اچھے لگ رہے ہیں۔ صحت مند طرز زندگی جاری رکھیں۔'
                )}
                {result.urgency === 'monitor' && t(
                  'Some results need attention. Monitor your health and consider discussing with your doctor.',
                  'کچھ نتائج کو توجہ کی ضرورت ہے۔ اپنی صحت کی نگرانی کریں اور اپنے ڈاکٹر سے بات کرنے پر غور کریں۔'
                )}
                {result.urgency === 'doctor_soon' && t(
                  'Schedule a visit with your doctor to discuss these results.',
                  'ان نتائج پر بات کرنے کے لیے اپنے ڈاکٹر کے ساتھ ملاقات شیڈول کریں۔'
                )}
                {result.urgency === 'urgent' && t(
                  'Please seek medical attention soon. Some results need professional evaluation.',
                  'براہ کرم جلد طبی امداد حاصل کریں۔ کچھ نتائج کو پیشہ ورانہ جائزے کی ضرورت ہے۔'
                )}
                {result.urgency === 'emergency' && t(
                  'Seek immediate medical attention. Some results require urgent care.',
                  'فوری طبی امداد حاصل کریں۔ کچھ نتائج کو فوری دیکھ بھال کی ضرورت ہے۔'
                )}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/symptoms')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {t('Check Symptoms', 'علامات چیک کریں')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleRemoveFile}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              {t('Analyze Another Report', 'دوسری رپورٹ کا تجزیہ کریں')}
            </Button>
          </Stack>
        </Paper>

        {/* Disclaimer */}
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          {result.disclaimer}
        </Alert>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/dashboard')}
            sx={{ borderRadius: 2 }}
          >
            {t('Back to Dashboard', 'ڈیش بورڈ پر واپس')}
          </Button>
        </Stack>
      </Container>
    );
  }

  return null;
};

export default LabReportReader;
