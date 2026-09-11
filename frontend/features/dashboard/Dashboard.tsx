import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Avatar,
  Stack,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Favorite as HeartIcon,
  Science as LabIcon,
  Medication as MedicationIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowIcon,
  Notifications as AlertIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/designTokens';
import { HealthActionCard, SeverityIndicator } from '../../components';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // Mock user data - in production, this comes from auth context
  const userName = language === 'en' ? 'Sarah' : 'سارہ';
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) {
      return language === 'en' ? 'Good morning' : 'صبح بخیر';
    } else if (currentHour < 18) {
      return language === 'en' ? 'Good afternoon' : 'دوپہر بخیر';
    } else {
      return language === 'en' ? 'Good evening' : 'شام بخیر';
    }
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: '1',
      type: 'symptom',
      title: language === 'en' ? 'Headache' : 'سر درد',
      date: language === 'en' ? '2 hours ago' : '2 گھنٹے پہلے',
      severity: 'low' as const,
    },
    {
      id: '2',
      type: 'lab',
      title: language === 'en' ? 'Vitamin D Test' : 'وٹامن ڈی ٹیسٹ',
      date: language === 'en' ? 'Yesterday' : 'کل',
      severity: 'moderate' as const,
    },
  ];

  // Mock alerts
  const alerts = [
    {
      id: '1',
      type: 'medication',
      message: language === 'en' 
        ? 'Time to take your Vitamin D supplement'
        : 'آپ کا وٹامن ڈی سپلیمنٹ لینے کا وقت',
      severity: 'info' as const,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Greeting Section */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: colors.primary.main,
              width: 48,
              height: 48
            }}
          >
            {userName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {getGreeting()}, {userName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {language === 'en' 
                ? 'How can I help you today?'
                : 'میں آج آپ کی کیا مدد کر سکتا ہوں؟'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            {alerts.map((alert) => (
              <Paper
                key={alert.id}
                elevation={0}
                sx={{
                  p: 2,
                  border: `1px solid ${colors.warning.main}30`,
                  bgcolor: `${colors.warning.main}10`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <AlertIcon sx={{ color: colors.warning.main }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {alert.message}
                </Typography>
                <Button size="small" variant="outlined">
                  {language === 'en' ? 'View' : 'دیکھیں'}
                </Button>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* Main Health Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        {language === 'en' ? 'What would you like to do?' : 'آپ کیا کرنا چاہیں گے؟'}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <HealthActionCard
            icon={<HeartIcon sx={{ fontSize: 32 }} />}
            title={language === 'en' ? 'Check Symptoms' : 'علامات چیک کریں'}
            description={language === 'en' 
              ? 'Tell me what you\'re feeling'
              : 'مجھے بتائیں آپ کو کیا محسوس ہو رہا ہے'}
            onClick={() => navigate('/symptoms')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthActionCard
            icon={<LabIcon sx={{ fontSize: 32 }} />}
            title={language === 'en' ? 'Lab Reports' : 'لیب رپورٹس'}
            description={language === 'en'
              ? 'Understand your test results'
              : 'اپنے ٹیسٹ کے نتائج سمجھیں'}
            onClick={() => navigate('/lab')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthActionCard
            icon={<MedicationIcon sx={{ fontSize: 32 }} />}
            title={language === 'en' ? 'Medications' : 'ادویات'}
            description={language === 'en'
              ? 'Check interactions & safety'
              : 'تعامل اور حفاظت چیک کریں'}
            onClick={() => navigate('/medications')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <HealthActionCard
            icon={<TimelineIcon sx={{ fontSize: 32 }} />}
            title={language === 'en' ? 'Health Timeline' : 'صحت ٹائم لائن'}
            description={language === 'en'
              ? 'View your health journey'
              : 'اپنا صحت کا سفر دیکھیں'}
            onClick={() => navigate('/timeline')}
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {language === 'en' ? 'Recent Activity' : 'حالیہ سرگرمی'}
          </Typography>
          <Button 
            endIcon={<ArrowIcon />}
            onClick={() => navigate('/timeline')}
          >
            {language === 'en' ? 'View All' : 'سب دیکھیں'}
          </Button>
        </Stack>

        <Stack spacing={2}>
          {recentActivity.map((activity) => (
            <Card 
              key={activity.id}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: activity.type === 'symptom' ? colors.primary[50] : colors.info[50],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {activity.type === 'symptom' ? (
                        <HeartIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
                      ) : (
                        <LabIcon sx={{ color: colors.info.main, fontSize: 20 }} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {activity.date}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <SeverityIndicator severity={activity.severity} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'This Month' : 'اس مہینے'}
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {language === 'en' ? 'Symptoms checked' : 'علامات چیک کی گئیں'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    5
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {language === 'en' ? 'Lab reports analyzed' : 'لیب رپورٹس کا تجزیہ'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    2
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'Active Medications' : 'فعال ادویات'}
              </Typography>
              <Stack spacing={1}>
                <Chip 
                  label={language === 'en' ? 'Vitamin D' : 'وٹامن ڈی'}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label={language === 'en' ? 'Multivitamin' : 'ملٹی وٹامن'}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {language === 'en' ? 'Health Score' : 'صحت کا اسکور'}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: colors.success.main }}>
                  85
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language === 'en' ? 'Good' : 'اچھا'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
