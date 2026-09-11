import React from 'react';
import { Skeleton, Stack, Box } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'form' | 'profile';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
}) => {
  if (variant === 'card') {
    return (
      <Stack spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Stack>
    );
  }

  if (variant === 'list') {
    return (
      <Stack spacing={1}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
        ))}
      </Stack>
    );
  }

  if (variant === 'form') {
    return (
      <Stack spacing={3}>
        <Skeleton variant="text" width="30%" height={32} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
        <Skeleton variant="text" width="25%" height={32} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2, mt: 2 }} />
      </Stack>
    );
  }

  if (variant === 'profile') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="50%" height={32} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="30%" height={24} sx={{ mx: 'auto' }} />
        <Stack spacing={2} sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    );
  }

  return null;
};

export default LoadingSkeleton;
