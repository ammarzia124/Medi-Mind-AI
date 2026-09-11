import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { colors } from '../../theme/designTokens';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: colors.primary[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          color: colors.primary.main,
          '& .MuiSvgIcon-root': {
            fontSize: 40,
          },
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{ fontWeight: 600, mb: 1 }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {description}
      </Typography>

      {/* Action Button */}
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
