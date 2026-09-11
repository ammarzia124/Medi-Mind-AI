import React from 'react';
import { Alert, AlertTitle, Box, Typography, Button } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { colors } from '../../theme/designTokens';

interface EmergencyAlertProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  message,
  action,
  onClose,
}) => {
  return (
    <Alert
      severity="error"
      icon={<WarningIcon sx={{ fontSize: 32 }} />}
      sx={{
        backgroundColor: `${colors.error.main}15`,
        border: `2px solid ${colors.error.main}`,
        borderRadius: 3,
        p: 3,
        '& .MuiAlert-icon': {
          color: colors.error.main,
          mr: 2,
        },
      }}
      action={
        action ? (
          <Button
            color="error"
            size="small"
            onClick={action.onClick}
            sx={{ fontWeight: 600 }}
          >
            {action.label}
          </Button>
        ) : undefined
      }
    >
      <AlertTitle sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
        ⚠️ Emergency Medical Attention Required
      </AlertTitle>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
        {message}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: colors.error.dark }}>
        Please seek immediate medical care. Do not delay.
      </Typography>
      {onClose && (
        <Button
          size="small"
          onClick={onClose}
          sx={{ mt: 2, color: colors.error.main }}
        >
          Dismiss
        </Button>
      )}
    </Alert>
  );
};

export default EmergencyAlert;
