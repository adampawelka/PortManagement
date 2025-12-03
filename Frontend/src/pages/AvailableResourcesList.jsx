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
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Ajusta esta URL si tu API corre en un puerto diferente
const API_URL = 'http://localhost:5000/api'; 
const RESOURCES_API = `${API_URL}/Resources`;


const AvailableResourcesPage = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    
    const [resources, setResources] = useState([]);
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
            
            // Endpoint para listar recursos disponibles
            const response = await fetch(RESOURCES_API, {
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
            
            setResources(dataArray);

        } catch (error) {
            console.error('Error fetching resources:', error);
            setError(`Failed to load resources: ${error.message}`);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                mt: 4, 
                backgroundColor: '#ffffff', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Available Resources List ({resources.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && resources.length === 0 && !error && (
                <Alert severity="info">No available resources found.</Alert>
            )}

            {/* --- TABLA DE RECURSOS --- */}
            {resources.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                {/* Columnas basadas en el DTO de Resource */}
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>SetUp Time (min)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.map((resource, index) => (
                                // Asumiendo que 'id' es la clave única
                                <TableRow key={resource.id }> 
                                    <TableCell>{resource.id || 'N/A'}</TableCell>
                                    <TableCell>{resource.code || 'N/A'}</TableCell>
                                    <TableCell>{resource.description || 'General'}</TableCell>
                                    <TableCell>{resource.type || 0}</TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                // Ejemplo de formato condicional basado en el estado
                                                color: resource.status === 'active' ? 'green' : 
                                                       resource.status === 'inactive' ? 'red' : 
                                                       resource.status === 'maintenance' ? 'orange' : 'gray' 
                                            }}
                                        >
                                            {resource.status || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{resource.capacity || 'N/A'}</TableCell>
                                    <TableCell>{resource.setupTime || 'N/A'}</TableCell>
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

export default AvailableResourcesPage;