import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Eliminado para solucionar el error de compilación

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
const ACTIVATE_API = `${API_ENDPOINT}/Users/activate`;

// Función para obtener parámetros de la URL (ej. ?token=XYZ)
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const FinalActivationPage = () => {
    // Usamos la simulación si no se puede usar el hook real
    const authContext = useAuth0();
    const { getAccessTokenSilently, user, isAuthenticated } = authContext;
    
    const navigate = useNavigate();
    const query = useQuery();
    
    const activationToken = query.get('token'); 
    const iamUserId = user?.sub; 

    const [status, setStatus] = useState('processing'); 
    const [message, setMessage] = useState('');
    
    // Función central para manejar fetches protegidos
    const fetchProtected = useCallback(async (url, options = {}) => {
        const token = await getAccessTokenSilently(); 
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers 
        };

        const response = await fetch(url, { ...options, headers });
        
        if (!response.ok) {
            let errorText = response.statusText;
            try {
                const errorJson = await response.json();
                errorText = errorJson.Message || errorJson.title || errorText;
            } catch (e) {
                errorText = `API returned ${response.status} (${response.statusText}).`;
            }
            throw new Error(errorText);
        }
    }, [getAccessTokenSilently]); 

    useEffect(() => {
        if (!activationToken) {
            setStatus('error');
            setMessage('Error: Activation token missing from URL.');
            return;
        }
        
        if (!isAuthenticated || !iamUserId) {
             setStatus('error');
             setMessage('Error: Please log in with Auth0 to complete the activation.');
             return;
        }

        const runActivation = async () => {
            const activationDto = {
                activationToken: activationToken,
                iamUserId: iamUserId, // Se envía el ID de Auth0
            };
            
            try {
                await fetchProtected(ACTIVATE_API, {
                    method: 'POST',
                    body: JSON.stringify(activationDto)
                });

                setStatus('success');
                setMessage('Account successfully activated! You now have access.');
                
                setTimeout(() => navigate('/'), 3000);

            } catch (err) {
                console.error("Activation Error:", err);
                setStatus('error');
                setMessage(`Activation failed: ${err.message}. The token may be expired or invalid.`);
            }
        };

        runActivation();
    }, [activationToken, iamUserId, fetchProtected, navigate, isAuthenticated]);

    // Estilo para centrar el formulario
    const containerStyle = {
        mt: 8, 
        p: 4, 
        textAlign: 'center'
    };

    const ActivationCard = () => {
        switch (status) {
            case 'processing':
                return (
                    <Box>
                        <CircularProgress size={50} sx={{ mb: 2 }} />
                        <Typography variant="h5">Activating Account...</Typography>
                        <Typography variant="body1">Verifying token and linking Auth0 ID ({iamUserId ? iamUserId.substring(0, 8) + '...' : 'N/A'}).</Typography>
                    </Box>
                );
            case 'success':
                return (
                    <Alert severity="success" icon={<Box>✅</Box>} sx={{ p: 3, fontSize: '1.2rem' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Activation Successful!</Typography>
                        {message} You will be redirected shortly.
                    </Alert>
                );
            case 'error':
                return (
                    <Alert severity="error" icon={<Box>❌</Box>} sx={{ p: 3, fontSize: '1.2rem' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Activation Failed</Typography>
                        {message}
                    </Alert>
                );
            default:
                return null;
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={containerStyle}
        >
            <Card elevation={5}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                        User Account Activation
                    </Typography>
                    <ActivationCard />
                </CardContent>
            </Card>
        </Container>
    );
};

export default FinalActivationPage;