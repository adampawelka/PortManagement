import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, Alert, CircularProgress, Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Asumo que usas react-router-dom

const API_URL = 'http://localhost:5000/api/Users/activate';

const ActivateUserPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); 
  const [status, setStatus] = useState('pending'); // pending, success, error
  
  // Dependencias de Auth0: Necesarias para obtener el token JWT y forzar el login
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation(); // Hook para acceder a la URL
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // 1. Obtener los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const iamId = queryParams.get('iamId');

    // Si faltan parámetros, mostramos un error
    if (!token || !iamId) {
      setMessage({ type: 'error', text: 'Activation link is missing required parameters (token or iamId).' });
      setStatus('error');
      setLoading(false);
      return;
    }
    
    // Si el usuario no está autenticado, no podemos obtener el token JWT para la API.
    // Esto es NECESARIO por la lógica de seguridad en UsersController.cs
    if (!isAuthenticated) {
        setMessage({ 
            type: 'warning', 
            text: 'You must be logged in with Auth0 to activate your account. Click below to log in.',
            requiresLogin: true
        });
        setStatus('pending'); // Esperando el inicio de sesión
        setLoading(false);
        return;
    }

    const activateUser = async () => {
        setLoading(true);
        setStatus('pending');

        // DTO que espera el Backend: { ActivationToken: "...", IamUserId: "..." }
        const activateDto = {
            activationToken: token,
            iamUserId: iamId,
        };
        
        try {
            // Obtenemos el token JWT necesario para la seguridad de la API
            const apiToken = await getAccessTokenSilently();
            
            // 2. Llamada POST al endpoint de activación
            const response = await fetch(API_URL, { 
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(activateDto)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Account successfully activated! You can now use the application.' });
                setStatus('success');
            } else {
                // Manejo de errores de negocio (ej: token expirado, token inválido)
                const errorData = await response.json(); 
                setMessage({ 
                    type: 'error', 
                    text: `Activation failed: ${errorData.Message || 'Invalid or expired activation token. Please contact support.'}` 
                });
                setStatus('error');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error or token failure during activation.' });
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Si está autenticado, procede a activar
    if (isAuthenticated) {
        activateUser();
    }

  }, [location.search, getAccessTokenSilently, isAuthenticated]); // Re-ejecutar si la URL o el estado Auth0 cambian

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    loginWithRedirect({
        appState: {
            // Después del login, vuelve a la misma URL (con los parámetros token/iamId)
            returnTo: window.location.pathname + window.location.search
        }
    });
  };

  const renderContent = () => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography>Processing activation...</Typography>
            </Box>
        );
    }
    
    // Si se requiere iniciar sesión
    if (message && message.requiresLogin) {
        return (
            <>
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Login with Auth0
                </Button>
            </>
        );
    }

    // Muestra el mensaje de éxito o error
    return (
        <Alert severity={status}>
            {message?.text}
        </Alert>
    );
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Account Activation</Typography>
      {renderContent()}
    </Container>
  );
};

export default ActivateUserPage;