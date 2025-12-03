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
    TableBody
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = 'http://localhost:5000/api'; 
const VESSELS_API = `${API_URL}/Vessels`;

const VesselsListPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [vessels, setVessels] = useState([]);
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
            
            // Endpoint para listar vessels (se asume que es una lista GET sin parámetros)
            const response = await fetch(VESSELS_API, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || response.statusText);
            }
            
            const data = await response.json();
            
            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
            
            setVessels(dataArray);

        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`Failed to load vessels: ${error.message}`);
            setVessels([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                mt: 4, 
                backgroundColor: '#ffffff', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                Vessels List ({vessels.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && vessels.length === 0 && !error && (
                <Alert severity="info">No vessels found.</Alert>
            )}

            {/* --- TABLA CON DETALLES DEL DTO VESSEL --- */}
            {vessels.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                {/* Columnas basadas en el DTO Vessel */}
                                <TableCell sx={{ fontWeight: 'bold' }}>Vessel Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>IMO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Vessel ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Owner ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Vessel Type ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vessels.map((vessel) => (
                                <TableRow key={vessel.id}> 
                                    <TableCell>{vessel.vesselName || 'N/A'}</TableCell>
                                    <TableCell>{vessel.imo || 'N/A'}</TableCell>
                                    <TableCell>{vessel.id || 'N/A'}</TableCell>
                                    <TableCell>{vessel.ownerId || 'N/A'}</TableCell>
                                    <TableCell>{vessel.vesselTypeId || 'N/A'}</TableCell>
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

export default VesselsListPage;