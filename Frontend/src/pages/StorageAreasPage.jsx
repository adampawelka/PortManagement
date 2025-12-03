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
    List, 
    ListItem,
    ListItemText // Importado para listas internas
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Ajusta esta URL si tu API corre en un puerto diferente
const API_URL = 'http://localhost:5000/api'; 
const STORAGE_AREAS_API = `${API_URL}/StorageAreas`;

// Estilo para las celdas que contienen listas de información
const listCellStyle = {
    maxHeight: 120, 
    overflowY: 'auto', 
    p: 0.5,
    fontSize: '0.7rem' // Fuente más pequeña para las listas internas
};

const StorageAreasPage = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    
    const [storageAreas, setStorageAreas] = useState([]);
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
            
            // Endpoint para listar áreas de almacenamiento
            const response = await fetch(STORAGE_AREAS_API, {
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
            
            setStorageAreas(dataArray);

        } catch (error) {
            console.error('Error fetching storage areas:', error);
            setError(`Failed to load storage areas: ${error.message}`);
            setStorageAreas([]);
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para renderizar la lista de distancias a muelles
    const renderDockDistances = (dockDistances) => {
        if (!dockDistances || dockDistances.length === 0) return 'No dock distance info';
        
        return (
            <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                <List dense disablePadding>
                    {dockDistances.map((d, index) => (
                        <ListItem key={d.dockId || index} sx={{ py: 0, px: 0.5 }}>
                            <ListItemText 
                                // Mostrar el nombre del muelle y la distancia
                                primary={`${d.dockName || 'N/A'}: ${d.distance || 0}m`} 
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
            maxWidth="xl" // Aumentamos a 'xl' para acomodar la nueva columna
            sx={{ 
                mt: 4, 
                backgroundColor: '#ffffff', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Storage Areas List ({storageAreas.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && storageAreas.length === 0 && !error && (
                <Alert severity="info">No storage areas found.</Alert>
            )}

            {/* --- TABLA DE ÁREAS DE ALMACENAMIENTO --- */}
            {storageAreas.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                {/* Columnas basadas en el DTO de StorageArea */}
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Max Capacity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Current Occupancy</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Dock Distances</TableCell> {/* Nueva columna */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {storageAreas.map((area, index) => (
                                <TableRow key={area.id || area.storageAreaName || index}> 
                                    <TableCell>{area.id || 'N/A'}</TableCell>
                                    <TableCell>{area.storageAreaLocation || 'N/A'}</TableCell>
                                    <TableCell>{area.storageAreaType || 'General'}</TableCell>
                                    <TableCell>{area.maxCapacity || 0}</TableCell>
                                    <TableCell>{area.currentOccupancy || 0}</TableCell>
                                    <TableCell sx={listCellStyle}>
                                        {renderDockDistances(area.dockDistances)}
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

export default StorageAreasPage;