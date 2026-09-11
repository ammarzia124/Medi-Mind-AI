import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack,
  Alert,
  LinearProgress,
  Divider,
  Container,
  IconButton
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { LabAnalysis } from '../../lib/schemas';
import { labService } from '../../services/labService';
import { useNavigate } from 'react-router-dom';
import { validateFile } from '../../lib/security';

export const LabReportReader: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LabAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputText = file ? file.name : manualInput;
    
    if (!inputText.trim()) {
      setError(language === 'en' 
        ? 'Please upload a file or enter lab results'
        : 'براہ کرم فائل اپ لوڈ کریں یا لیب نتائج درج کریں'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = await labService.analyzeLabReport(inputText);
      setResult(analysis);
    } catch (err) {
      setError(language === 'en'
        ? 'Failed to analyze lab report. Please try again.'
        : 'لیب رپورٹ کا تجزیہ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setManualInput('');
    setResult(null);
    setError(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckIcon sx={{ color: colors.success.main }} />;
      case 'abnormal':
        return <WarningIcon sx={{ color: colors.warning.main }} />;
      case 'critical':
        return <ErrorIcon sx={{ color: colors.error.main }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return colors.success.main;
      case 'abnormal':
        return colors.warning.main;
      case 'critical':
        return colors.error.main;
      default:
        return colors.text.secondary;
    }
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
          {language === 'en' ? 'Lab Report Reader' : 'لیب رپورٹ ریڈر'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'en'
            ? 'Upload your lab report or enter results to get clear explanations'
            : 'واضح وضاحت حاصل کرنے کے لیے اپنی لیب رپورٹ اپ لوڈ کریں یا نتائج درج کریں'}
        </Typography>

        {/* Upload/Input Form */}
        {!result && (
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Drag and Drop Zone */}
                <Box
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  sx={{
                    border: `2px dashed ${dragActive ? colors.primary.main : colors.border.main}`,
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: dragActive ? colors.primary[50] : 'transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: colors.primary.light,
                      bgcolor: colors.primary[50],
                    },
                  }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileInputChange}
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <UploadIcon sx={{ fontSize: 48, color: colors.primary.main, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {language === 'en' ? 'Drop your lab report here' : 'اپنی لیب رپورٹ یہاں ڈراپ کریں'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'en' 
                        ? 'or click to browse (PDF, JPG, PNG - max 10MB)'
                        : 'یا براؤز کرنے کے لیے کلک کریں (PDF, JPG, PNG - زیادہ سے زیادہ 10MB)'}
                    </Typography>
                  </label>
                </Box>

                {/* File Preview */}
                {file && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      border: `1px solid ${colors.border.main}`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <FileIcon sx={{ color: colors.primary.main }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton onClick={handleRemoveFile} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                )}

                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'en' ? 'OR' : 'یا'}
                  </Typography>
                </Divider>

                {/* Manual Input */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {language === 'en' ? 'Or enter lab results manually:' : 'یا لیب نتائج دستی طور پر درج کریں:'}
                  </Typography>
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder={language === 'en'
                      ? 'Enter your lab results here...\n\nExample:\nHemoglobin: 12.5 g/dL\nCholesterol: 240 mg/dL'
                      : 'اپنے لیب نتائج یہاں درج کریں...\n\nمثال:\nہیموگلوبن: 12.5 g/dL\nکولیسٹرول: 240 mg/dL'}
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border.main}`,
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                    disabled={loading || !!file}
                  />
                </Box>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {loading && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress sx={{ mb: 1, borderRadius: 1 }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                      {language === 'en' ? 'Analyzing your lab report...' : 'آپ کی لیب رپورٹ کا تجزیہ ہو رہا ہے...'}
                    </Typography>
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || (!file && !manualInput.trim())}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading 
                    ? (language === 'en' ? 'Analyzing...' : 'تجزیہ ہو رہا ہے...')
                    : (language === 'en' ? 'Analyze Lab Report' : 'لیب رپورٹ کا تجزیہ کریں')
                  }
                </Button>
              </Stack>
            </form>
          </Paper>
        )}

        {/* Results */}
        {result && (
          <Stack spacing={3}>
            {/* Important Note */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                {result.important_note}
              </Typography>
            </Alert>

            {/* Summary */}
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'Summary' : 'خلاصہ'}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {result.summary}
              </Typography>
            </Paper>

            {/* Individual Results */}
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border.main}`, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'Results' : 'نتائج'}
              </Typography>
              <Stack spacing={2}>
                {result.results.map((labResult, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: `1px solid ${getStatusColor(labResult.status)}30`,
                      bgcolor: `${getStatusColor(labResult.status)}05`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {labResult.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {getStatusIcon(labResult.status)}
                        <Typography variant="body2" sx={{ color: getStatusColor(labResult.status), fontWeight: 600 }}>
                          {labResult.value} {labResult.unit}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {labResult.what_this_may_mean}
                    </Typography>
                  </Paper>
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
                {language === 'en' ? 'Warning Signs' : 'انتباہی علامات'}
              </Typography>
              <Stack spacing={1.5}>
                {result.warning_signs.map((sign, index) => (
                  <Typography key={index} variant="body2" sx={{ lineHeight: 1.8 }}>
                    {sign}
                  </Typography>
                ))}
              </Stack>
            </Paper>

            {/* Next Steps */}
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
                {language === 'en' ? 'Recommended Next Steps' : 'تجویز کردہ اگلے اقدامات'}
              </Typography>
              <Stack spacing={1.5}>
                {result.next_steps.map((step, index) => (
                  <Typography key={index} variant="body2" sx={{ lineHeight: 1.8 }}>
                    {step}
                  </Typography>
                ))}
              </Stack>
            </Paper>

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
                {language === 'en' ? 'Analyze Another Report' : 'دوسری رپورٹ کا تجزیہ کریں'}
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

export default LabReportReader;
