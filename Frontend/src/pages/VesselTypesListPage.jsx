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
const VESSEL_TYPES_API = `${API_URL}/VesselTypes`;

// --- SIMULACIÓN DE AUTH0 ---
const useAuth0Simulation = () => {
    const getAccessTokenSilently = async () => {
        return "fake-auth0-token-12345"; 
    };
    return { getAccessTokenSilently, user: { name: 'Simulated User' } };
};
// ----------------------------

// Estilo para las celdas que contienen listas de información
const listCellStyle = {
    maxHeight: 120, 
    overflowY: 'auto', 
    p: 0.5,
    fontSize: '0.7rem' // Fuente más pequeña para las listas internas
};

const VesselTypePage = () => {
    // Determinar si usar el hook real de Auth0 o la simulación
    const authContext = typeof useAuth0 === 'function' ? useAuth0() : useAuth0Simulation();
    const { getAccessTokenSilently } = authContext;
    
    const [vesselTypes, setVesselTypes] = useState([]);
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
            
            // Endpoint para listar tipos de buques
            const response = await fetch(VESSEL_TYPES_API, {
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
            
            setVesselTypes(dataArray);

        } catch (error) {
            console.error('Error fetching vessel types:', error);
            setError(`Failed to load vessel types: ${error.message}`);
            setVesselTypes([]);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para renderizar los constraints
    const renderConstraints = (constraints) => {
        if (!constraints) return 'N/A';
        const items = [
            `Max Rows: ${constraints.maxRows || 'N/A'}`,
            `Max Bays: ${constraints.maxBays || 'N/A'}`,
            `Max Tiers: ${constraints.maxTiers || 'N/A'}`,
        ];

        return (
            <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                <List dense disablePadding>
                    {items.map((text, index) => (
                        <ListItem key={index} sx={{ py: 0, px: 0.5 }}>
                            <ListItemText 
                                primary={text} 
                                primaryTypographyProps={{ style: { fontSize: '0.7rem' } }} 
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
                Vessel Types List ({vesselTypes.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && vesselTypes.length === 0 && !error && (
                <Alert severity="info">No vessel types found.</Alert>
            )}

            {/* --- TABLA DE TIPOS DE BUQUES --- */}
            {vesselTypes.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Dimensions</TableCell> {/* Nueva columna */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vesselTypes.map((type, index) => (
                                <TableRow key={type.id || type.name || index}> 
                                    <TableCell>{type.id || index + 1}</TableCell>
                                    <TableCell>{type.name || 'N/A'}</TableCell>
                                    <TableCell>{type.description || 'N/A'}</TableCell>
                                    <TableCell>{type.capacity || 0}</TableCell>
                                    <TableCell sx={listCellStyle}>
                                        {renderConstraints(type.constraints)}
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

export default VesselTypePage;