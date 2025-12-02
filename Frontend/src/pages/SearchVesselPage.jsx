import React, { useState, useCallback } from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';

const SearchVesselPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const { getAccessTokenSilently, user } = useAuth0(); 
    
    // Función central para manejar fetches protegidos y errores
    const fetchProtected = useCallback(async (url) => {
        const token = await getAccessTokenSilently();
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, { headers });
        
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
        
        try {
            return await response.json();
        } catch (e) {
            return []; // Retorna array vacío si el cuerpo está vacío
        }
    }, [getAccessTokenSilently]); 

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setResults([]);

        const trimmedTerm = searchTerm.trim();
        if (!searchTerm.trim()) {
            setMessage({ type: 'warning', text: 'Please enter the vessels name.' });
            setLoading(false);
            return;
        }
        
        // Asumo que el endpoint soporta filtrado por query parameter
        const searchUrl = `${API_ENDPOINT}/Vessels/search?name=${encodeURIComponent(trimmedTerm)}`;
        // Ejemplo: http://localhost:5000/api/Vessels?query=ABC123
        try {
            // El backend debería devolver una lista de buques filtrados
            const data = await fetchProtected(searchUrl); 

            if (data.length === 0) {
                setMessage({ type: 'info', text: 'No vessels found matching your criteria.' });
            }
            setResults(data);
            
        } catch (err) {
            console.error("Search Error:", err);
            setMessage({ 
                type: 'error', 
                text: `Search failed: ${err.message}` 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="lg" 
            sx={{ mt: 4, backgroundColor: '#ffffff', p: 4, borderRadius: 2, boxShadow: 3 }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Search Vessels
            </Typography>
            
            <form onSubmit={handleSearch}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField 
                        label="Search Term (Name)" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        fullWidth 
                        variant="outlined"
                        required
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading} 
                        sx={{ minWidth: 150, py: 1.5, backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }} 
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>
                </Box>
            </form>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            {results.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>IMO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>VesselName</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>OwnerId</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>VesselTypeId</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((vessel) => (
                                // Asumo que el DTO del buque incluye IMO, Name, Type y Capacity
                                <TableRow key={vessel.id}> 
                                    <TableCell>{vessel.imo || vessel.IMO || 'N/A'}</TableCell>
                                    <TableCell>{vessel.vesselName || vessel.VesselName}</TableCell>
                                    <TableCell>{vessel.ownerId || vessel.OwnerId}</TableCell>
                                    <TableCell>{vessel.vesselTypeId || vessel.VesselTypeId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SearchVesselPage;