import React from 'react';
import { Button, CircularProgress } from '@mui/material';

/**
 * Button component with built-in loading state
 * @param {Object} props - All standard Button props plus:
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.loadingText - Text to show when loading (default: same as children)
 */
const LoadingButton = ({ 
  loading = false, 
  loadingText = null,
  children,
  disabled,
  ...buttonProps 
}) => {
  return (
    <Button
      {...buttonProps}
      disabled={disabled || loading}
      sx={{
        ...buttonProps.sx,
        position: 'relative',
      }}
    >
      {loading ? (
        <>
          <CircularProgress 
            size={24} 
            color="inherit" 
            sx={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-12px',
            }}
          />
          <span style={{ opacity: 0 }}>
            {loadingText || children}
          </span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;

