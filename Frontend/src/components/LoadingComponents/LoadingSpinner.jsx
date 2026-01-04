import React from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Reusable loading spinner component
 * @param {Object} props
 * @param {string} props.size - Size of spinner: 'small' | 'medium' | 'large' (default: 'medium')
 * @param {string} props.color - Color: 'primary' | 'secondary' | 'inherit' (default: 'primary')
 * @param {string} props.message - Optional message to display below spinner
 * @param {boolean} props.fullScreen - If true, centers spinner in full screen
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  message = null,
  fullScreen = false 
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56
  };

  const spinner = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }),
        ...(!fullScreen && {
          padding: 3,
        }),
      }}
    >
      <CircularProgress size={sizeMap[size]} color={color} />
      {message && (
        <Box
          sx={{
            color: 'var(--color-text-dark)',
            fontSize: 'var(--font-size-body)',
            textAlign: 'center',
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );

  return spinner;
};

export default LoadingSpinner;

