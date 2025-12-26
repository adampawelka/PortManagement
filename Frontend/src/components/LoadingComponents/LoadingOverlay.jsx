import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

/**
 * Full-page loading overlay component
 * @param {Object} props
 * @param {boolean} props.open - Whether overlay is visible
 * @param {string} props.message - Optional message to display
 */
const LoadingOverlay = ({ open = false, message = null }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" size={60} />
        {message && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;

