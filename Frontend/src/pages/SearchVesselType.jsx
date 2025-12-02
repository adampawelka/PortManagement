import React, { useState, useCallback } from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
// Usamos el endpoint de búsqueda especializado
const VESSEL_TYPES_SEARCH_API = `${API_ENDPOINT}/VesselTypes/search`;

const SearchVesselTypePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // Hook de Auth0 para obtener el token
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
            setMessage({ type: 'warning', text: 'Please enter a search term (Name or Description).' });
            setLoading(false);
            return;
        }
        
        // Construimos la URL usando el parámetro 'name' para buscar por nombre del tipo de buque
        const searchUrl = `${VESSEL_TYPES_SEARCH_API}?name=${encodeURIComponent(trimmedTerm)}`;
        
        try {
            // El backend debería devolver una lista de tipos de buques filtrados
            const data = await fetchProtected(searchUrl); 

            // Se asegura de que los datos sean tratados como un array
            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);

            if (dataArray.length === 0) {
                setMessage({ type: 'info', text: `No vessel types found matching '${trimmedTerm}'.` });
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
            maxWidth="lg" 
            sx={{ mt: 4, backgroundColor: '#ffffff', p: 4, borderRadius: 2, boxShadow: 3 }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Search Vessel Types
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
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Capacity (TEUs)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Constraints (R/B/T)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID (Guid)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((type) => (
                                // Asumo que el DTO incluye Name, Description, Capacity y Constraints
                                <TableRow key={type.Id}> 
                                    <TableCell>{type.name || 'N/A'}</TableCell>
                                    <TableCell>{type.description || 'N/A'}</TableCell>
                                    <TableCell>{type.capacity || 0}</TableCell>
                                    <TableCell>
                                        {/* Accediendo al objeto anidado OperationalConstraints */}
                                        {type.constraints ? 
                                            `R:${type.constraints.maxRows} / B:${type.constraints.maxBays} / T:${type.constraints.maxTiers}`
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>{type.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SearchVesselTypePage;