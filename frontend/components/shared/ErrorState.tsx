import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { colors } from '../../theme/designTokens';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showDetails?: boolean;
  details?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  showDetails = false,
  details,
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
      {/* Error Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: `${colors.error.main}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          color: colors.error.main,
          '& .MuiSvgIcon-root': {
            fontSize: 40,
          },
        }}
      >
        <ErrorIcon />
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

      {/* Message */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {message}
      </Typography>

      {/* Details (collapsible) */}
      {showDetails && details && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            maxWidth: 500, 
            textAlign: 'left',
            '& .MuiAlert-message': {
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            },
          }}
        >
          <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Error Details
          </AlertTitle>
          {details}
        </Alert>
      )}

      {/* Retry Button */}
      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
