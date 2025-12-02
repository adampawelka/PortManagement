import React, { useState, useCallback } from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
const DOCKS_SEARCH_API = `${API_ENDPOINT}/Docks/search`; // Endpoint confirmado

const SearchDockPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // Usamos useAuth0, siguiendo el patrón de SearchVesselPage
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
                // Manejo de errores detallado, incluyendo errores de validación 400
                const validationErrors = response.status === 400 && errorJson.errors ? Object.values(errorJson.errors).flat() : [];
                errorText = validationErrors.length > 0 ? validationErrors.join(' | ') : (errorJson.Message || errorJson.title || errorText);
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
        if (!trimmedTerm) {
            setMessage({ type: 'warning', text: 'Please enter a search term (Name or Location).' });
            setLoading(false);
            return;
        }
        
        // Construimos la URL usando el endpoint /Docks/search y el parámetro 'name'
        const searchUrl = `${DOCKS_SEARCH_API}?name=${encodeURIComponent(trimmedTerm)}`;
        
        try {
            // El backend debería devolver una lista de Docks filtrados
            const data = await fetchProtected(searchUrl); 

            // Se asegura de que los datos sean tratados como un array
            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);

            if (dataArray.length === 0) {
                setMessage({ type: 'info', text: `No docks found matching '${trimmedTerm}'.` });
            }
            setResults(dataArray);
            
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
            maxWidth={false} 
            sx={{ mt: 4, backgroundColor: '#ffffff', p: 4, borderRadius: 2, boxShadow: 3, width: '100%', mx: 'auto'}}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Search Docks
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Depth (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Length (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Max Draft (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID (Guid)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((dock) => (
                                <TableRow key={dock.id}> 
                                    <TableCell>{dock.dockName || 'N/A'}</TableCell>
                                    <TableCell>{dock.dockLocation || 'N/A'}</TableCell>
                                    <TableCell>{dock.depth}</TableCell>
                                    <TableCell>{dock.length}</TableCell>
                                    <TableCell>{dock.maxDraft}</TableCell>
                                    <TableCell>{dock.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SearchDockPage;