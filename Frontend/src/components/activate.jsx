import React, { useEffect, useState } from 'react';
import { 
  Container, Paper, Typography, CircularProgress, 
  Box, Button, Alert 
} from '@mui/material';
import { CheckCircle, XCircle, Loader2, MailOpen } from 'lucide-react';
import { useApi } from '/Users/guille/Documents/GitHub/LEI-SEM5-PI-2025-26-3DL-E-04/Frontend/src/services/api.js';

/**
 * Este componente debe estar mapeado a la ruta que pones en el correo.
 * Ejemplo de URL: /activate-account?token=XXXX&email=user@test.com
 */
export default function AccountActivation() {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [apiFetch] = useApi();

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
      
      // Simulación de llamada a tu servicio/API
      // Reemplaza esto con: await userService.activateAccount(token)
      const response = await apiFetch('http://localhost:5000/api/Users/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activationToken, IamUserId })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'El enlace ha expirado o es inválido.');
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
              Verificando tu cuenta...
            </Typography>
            <Typography color="text.secondary">
              Estamos procesando tu solicitud de activación. No cierres esta ventana.
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Box sx={{ py: 2 }}>
            <CheckCircle size={80} color="#2e7d32" style={{ margin: '0 auto' }} />
            <Typography variant="h4" sx={{ mt: 3, fontWeight: 'bold', color: '#2e7d32' }}>
              ¡Cuenta Activada!
            </Typography>
            <Typography sx={{ mt: 2, mb: 4, color: 'text.secondary' }}>
              Tu correo ha sido verificado correctamente. Ya puedes acceder a todas las funciones de la plataforma.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={() => window.location.href = '/login'}
              sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              Ir al Inicio de Sesión
            </Button>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ py: 2 }}>
            <XCircle size={80} color="#d32f2f" style={{ margin: '0 auto' }} />
            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold', color: '#d32f2f' }}>
              Error en la activación
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
              Contactar Soporte
            </Button>
          </Box>
        )}

      </Paper>
    </Container>
  );
}