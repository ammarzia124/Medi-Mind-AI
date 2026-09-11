import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { colors } from '../../theme/designTokens';

interface SeverityIndicatorProps {
  severity: 'low' | 'moderate' | 'high' | number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  showLabel = true,
  size = 'medium',
}) => {
  // Convert numeric severity to label
  const getSeverityLabel = (sev: 'low' | 'moderate' | 'high' | number): string => {
    if (typeof sev === 'number') {
      if (sev <= 2) return 'Low';
      if (sev <= 3) return 'Moderate';
      return 'High';
    }
    return sev.charAt(0).toUpperCase() + sev.slice(1);
  };

  const getSeverityColor = (sev: 'low' | 'moderate' | 'high' | number): string => {
    if (typeof sev === 'number') {
      if (sev <= 2) return colors.success.main;
      if (sev <= 3) return colors.warning.main;
      return colors.error.main;
    }
    switch (sev) {
      case 'low': return colors.success.main;
      case 'moderate': return colors.warning.main;
      case 'high': return colors.error.main;
      default: return colors.grey[500];
    }
  };

  const getIcon = (sev: 'low' | 'moderate' | 'high' | number) => {
    if (typeof sev === 'number') {
      if (sev <= 2) return <CheckCircleIcon />;
      if (sev <= 3) return <WarningIcon />;
      return <ErrorIcon />;
    }
    switch (sev) {
      case 'low': return <CheckCircleIcon />;
      case 'moderate': return <WarningIcon />;
      case 'high': return <ErrorIcon />;
      default: return <WarningIcon />;
    }
  };

  const sizes = {
    small: { icon: 16, fontSize: '0.75rem', chipSize: 'small' as const },
    medium: { icon: 20, fontSize: '0.875rem', chipSize: 'medium' as const },
    large: { icon: 24, fontSize: '1rem', chipSize: 'medium' as const },
  };

  const currentSize = sizes[size];
  const color = getSeverityColor(severity);
  const label = getSeverityLabel(severity);
  const Icon = getIcon(severity);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {/* Icon */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          '& .MuiSvgIcon-root': {
            fontSize: currentSize.icon,
          },
        }}
      >
        {Icon}
      </Box>

      {/* Label */}
      {showLabel && (
        <Typography
          variant="body2"
          sx={{
            fontSize: currentSize.fontSize,
            fontWeight: 600,
            color: color,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default SeverityIndicator;
