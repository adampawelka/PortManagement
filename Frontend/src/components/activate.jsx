import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, CircularProgress, 
  Box, Button, Alert 
} from '@mui/material';
import { CheckCircle, XCircle, Loader2, MailOpen } from 'lucide-react';

/**
 * Este componente debe estar mapeado a la ruta que pones en el correo.
 * Ejemplo de URL: /activate?token=XXXX&iamId=user@test.com
 * 
 * NOTE: This component does NOT use useApi() because the user hasn't logged in yet.
 * The backend endpoint [AllowAnonymous] accepts plain HTTP requests without Auth0 token.
 */
export default function AccountActivation() {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Extraer parámetros de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const activationToken = queryParams.get('token');
    const IamUserId = queryParams.get('iamId');

    if (!activationToken) {
      setStatus('error');
      setErrorMsg('No se encontró un código de verificación válido en el enlace.');
      return;
    }

    // 2. Disparar la activación automáticamente
    handleAutoActivation(activationToken, IamUserId);
  }, []);

  const handleAutoActivation = async (activationToken, IamUserId) => {
    try {
      console.log(`Intentando activar cuenta para: ${IamUserId} con token: ${activationToken}`);
      
      // Use plain fetch (no Auth0) because endpoint is [AllowAnonymous]
      const response = await fetch('http://localhost:5000/api/Users/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          activationToken, 
          iamUserId: IamUserId 
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        let errorMessage = 'The link has expired or is invalid.';
        try {
          const data = await response.json();
          errorMessage = data.message || data.Message || errorMessage;
        } catch (e) {
          // Si no se puede parsear JSON, usar mensaje por defecto
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
        
        {status === 'processing' && (
          <Box sx={{ py: 4 }}>
            <Loader2 className="animate-spin" size={60} style={{ color: '#1976d2', margin: '0 auto' }} />
            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold' }}>
              Verifying your account...
            </Typography>
            <Typography color="text.secondary">
              We are processing your activation request. Please do not close this window.
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Box sx={{ py: 2 }}>
            <CheckCircle size={80} color="#2e7d32" style={{ margin: '0 auto' }} />
            <Typography variant="h4" sx={{ mt: 3, fontWeight: 'bold', color: '#2e7d32' }}>
              ¡Account activated!
            </Typography>
            <Typography sx={{ mt: 2, mb: 4, color: 'text.secondary' }}>
              Your e-mail has been verified correctly. Now you can access all platform functions.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={() => window.location.href = '/login'}
              sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              Go to Login
            </Button>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ py: 2 }}>
            <XCircle size={80} color="#d32f2f" style={{ margin: '0 auto' }} />
            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold', color: '#d32f2f' }}>
              Failed to Activate Account
            </Typography>
            <Alert severity="error" sx={{ mt: 2, mb: 4, textAlign: 'left' }}>
              {errorMsg}
            </Alert>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => window.location.href = '/contact-support'}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Contact Support
            </Button>
          </Box>
        )}

      </Paper>
    </Container>
  );
}