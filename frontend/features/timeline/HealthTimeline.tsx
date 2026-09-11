import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack,
  Alert,
  CircularProgress,
  Container,
  Chip,
  Divider
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Add as AddIcon,
  Favorite as HeartIcon,
  Science as LabIcon,
  Medication as MedicationIcon,
  EventNote as NoteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { TimelineEntry } from '../../services/timelineService';
import { timelineService } from '../../services/timelineService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SeverityIndicator } from '../../components';

export const HealthTimeline: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const data = await timelineService.getTimeline();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(language === 'en'
        ? 'Failed to load timeline. Please try again.'
        : 'ٹائم لائن لوڈ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔'
      );
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'symptom':
        return <HeartIcon />;
      case 'lab':
        return <LabIcon />;
      case 'medication':
        return <MedicationIcon />;
      case 'note':
        return <NoteIcon />;
      default:
        return <CalendarIcon />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'symptom':
        return colors.primary.main;
      case 'lab':
        return colors.info.main;
      case 'medication':
        return colors.success.main;
      case 'note':
        return colors.warning.main;
      default:
        return colors.text.secondary;
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'symptom':
        return language === 'en' ? 'Symptom' : 'علامت';
      case 'lab':
        return language === 'en' ? 'Lab Report' : 'لیب رپورٹ';
      case 'medication':
        return language === 'en' ? 'Medication' : 'دوا';
      case 'note':
        return language === 'en' ? 'Note' : 'نوٹ';
      case 'appointment':
        return language === 'en' ? 'Appointment' : 'ملاقات';
      default:
        return eventType;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = formatDate(entry.event_date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntry[]>);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ color: 'text.secondary' }}
          >
            {language === 'en' ? 'Back' : 'واپس'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              // TODO: Open add entry modal
            }}
            sx={{ borderRadius: 2 }}
          >
            {language === 'en' ? 'Add Entry' : 'اندراج شامل کریں'}
          </Button>
        </Stack>

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          {language === 'en' ? 'Health Timeline' : 'صحت ٹائم لائن'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {language === 'en'
            ? 'Track your health journey in one place'
            : 'ایک جگہ پر اپنا صحت کا سفر ٹریک کریں'}
        </Typography>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && entries.length === 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              border: `1px solid ${colors.border.main}`,
              borderRadius: 3,
            }}
          >
            <CalendarIcon sx={{ fontSize: 64, color: colors.text.secondary, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {language === 'en' ? 'No timeline entries yet' : 'ابھی تک کوئی ٹائم لائن اندراج نہیں'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {language === 'en'
                ? 'Start tracking your health by adding symptoms, lab reports, or notes'
                : 'علامات، لیب رپورٹس، یا نوٹس شامل کرکے اپنی صحت ٹریک کرنا شروع کریں'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Open add entry modal
              }}
              sx={{ borderRadius: 2 }}
            >
              {language === 'en' ? 'Add Your First Entry' : 'اپنا پہلا اندراج شامل کریں'}
            </Button>
          </Paper>
        )}

        {/* Timeline */}
        {!loading && !error && entries.length > 0 && (
          <Stack spacing={4}>
            {Object.entries(groupedEntries).map(([date, dateEntries]) => (
              <Box key={date}>
                {/* Date Header */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: colors.primary.main,
                  }}
                >
                  {date}
                </Typography>

                {/* Entries for this date */}
                <Stack spacing={2}>
                  {dateEntries.map((entry) => (
                    <Paper
                      key={entry.id}
                      elevation={0}
                      sx={{
                        p: 3,
                        border: `1px solid ${colors.border.main}`,
                        borderRadius: 3,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: getEventColor(entry.event_type),
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        {/* Icon */}
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: `${getEventColor(entry.event_type)}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getEventColor(entry.event_type),
                            flexShrink: 0,
                          }}
                        >
                          {getEventIcon(entry.event_type)}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {entry.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={getEventLabel(entry.event_type)}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getEventColor(entry.event_type)}15`,
                                    color: getEventColor(entry.event_type),
                                    fontWeight: 600,
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {formatTime(entry.event_date)}
                                </Typography>
                              </Stack>
                            </Box>
                            {entry.severity && (
                              <SeverityIndicator severity={entry.severity} size="small" />
                            )}
                          </Stack>
                          
                          {entry.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                              {entry.description}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                {/* Divider between dates */}
                <Divider sx={{ mt: 4 }} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default HealthTimeline;
