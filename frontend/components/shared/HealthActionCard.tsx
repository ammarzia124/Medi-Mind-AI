import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActionArea, 
  Typography, 
  Box, 
  Chip 
} from '@mui/material';
import { colors } from '../../theme/designTokens';

interface HealthActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  severity?: 'low' | 'moderate' | 'high';
  badge?: string;
}

export const HealthActionCard: React.FC<HealthActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  severity,
  badge,
}) => {
  const severityColors = {
    low: colors.success.main,
    moderate: colors.warning.main,
    high: colors.error.main,
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          p: 0,
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              backgroundColor: alpha(colors.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: colors.primary.main,
            }}
          >
            {icon}
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            component="h3" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {description}
          </Typography>

          {/* Severity Badge */}
          {severity && (
            <Chip
              label={severity.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: `${severityColors[severity]}15`,
                color: severityColors[severity],
                fontWeight: 600,
              }}
            />
          )}
        </CardContent>
      </CardActionArea>

      {/* Optional Badge */}
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: 16,
            backgroundColor: colors.primary.main,
            color: colors.primary.contrastText,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {badge}
        </Box>
      )}
    </Card>
  );
};

// Helper function for alpha colors
const alpha = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default HealthActionCard;
