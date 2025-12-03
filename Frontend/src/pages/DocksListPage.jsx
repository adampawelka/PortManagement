import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    CircularProgress, 
    Alert, 
    Paper, 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody,
    Box, 
    List, // Importado para listas internas
    ListItem,
    ListItemText
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Ajusta esta URL si tu API corre en un puerto diferente
const API_URL = 'http://localhost:5000/api'; 
const DOCKS_API = `${API_URL}/Docks`;

// Estilo para las celdas que contienen listas de información
const listCellStyle = {
    maxHeight: 120, 
    overflowY: 'auto', 
    p: 0.5,
    fontSize: '0.7rem' // Fuente más pequeña para las listas internas
};

const DocksListPage = () => {
   
    const { getAccessTokenSilently, user } = useAuth0();
    
    const [docks, setDocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessTokenSilently();
            
            // Endpoint para listar muelles (Docks)
            const response = await fetch(DOCKS_API, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || response.statusText);
            }
            
            const data = await response.json();
            
            // Asegurarse de que la data es un array
            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
            
            setDocks(dataArray);

        } catch (error) {
            console.error('Error fetching docks:', error);
            setError(`Failed to load docks: ${error.message}`);
            setDocks([]);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para renderizar la lista de tipos de buques permitidos
    const renderAllowedVesselTypes = (types) => {
        if (!types || types.length === 0) return 'No restrictions';
        
        return (
            <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                <List dense disablePadding>
                    {types.map((type, index) => (
                        <ListItem key={type.id || index} sx={{ py: 0, px: 0.5 }}>
                            <ListItemText 
                                // Mostrar solo el nombre del tipo de buque
                                primary={type.name || 'Unknown Type'} 
                                primaryTypographyProps={{ style: { fontSize: '0.7rem', fontWeight: 'bold' } }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    };

    return (
        <Container 
            maxWidth="lg" // Aumentamos a 'lg' para acomodar la nueva columna
            sx={{ 
                mt: 4, 
                backgroundColor: '#ffffff', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Docks List ({docks.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && docks.length === 0 && !error && (
                <Alert severity="info">No docks found.</Alert>
            )}

            {/* --- TABLA DE MUELLES (DOCKS) --- */}
            {docks.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Length (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Depth (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Maximun Draft (m)</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Allowed Vessel Types</TableCell> {/* Nueva columna */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {docks.map((dock, index) => (
                                <TableRow key={dock.id || dock.dockName || index}> 
                                    <TableCell>{dock.id || 'N/A'}</TableCell>
                                    <TableCell>{dock.dockName || 'N/A'}</TableCell>
                                    <TableCell>{dock.dockLocation || 'N/A'}</TableCell>
                                    <TableCell>{dock.length || 'N/A'}</TableCell>
                                    <TableCell>{dock.depth || 'N/A'}</TableCell>
                                    <TableCell>{dock.maxDraft || 'N/A'}</TableCell>
                                    <TableCell sx={listCellStyle}>
                                        {renderAllowedVesselTypes(dock.allowedVesselTypes)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* ---------------------------------- */}
        </Container>
    );
};

export default DocksListPage;