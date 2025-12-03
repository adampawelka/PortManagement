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
    ListItemText,
    ListItem,
    Box, 
    List 
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

// Ajusta esta URL si tu API corre en un puerto diferente
const API_URL = 'http://localhost:5000/api'; 
const NOTIFICATIONS_API = `${API_URL}/VesselVisitNotifications`;

// --- SIMULACIÓN DE AUTH0 PARA COMPILACIÓN AUTÓNOMA ---
// (Necesaria si el componente se ejecuta fuera del contexto de Auth0 para evitar errores)
const useAuth0Simulation = () => {
    const getAccessTokenSilently = async () => {
        return "fake-auth0-token-12345"; 
    };
    return { getAccessTokenSilently, user: { name: 'Simulated User' } };
};
// ----------------------------------------------------

// Función de ayuda para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return 'Invalid Date';
    }
};

const ListNotificationsPage = () => {
    // Usamos el hook de Auth0 (o la simulación si no está disponible)
    const authContext = typeof useAuth0 === 'function' ? useAuth0() : useAuth0Simulation();
    const { getAccessTokenSilently, user } = useAuth0();
    
    const [notifications, setNotifications] = useState([]);
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
            
            // Endpoint para listar notificaciones (se asume que es una lista GET sin parámetros)
            const response = await fetch(NOTIFICATIONS_API, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || response.statusText);
            }
            
            const data = await response.json();
            
            const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
            
            setNotifications(dataArray);

        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`Failed to load notifications: ${error.message}`);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const listCellStyle = {
        maxHeight: 120, 
        overflowY: 'auto', 
        p: 0.5,
        fontSize: '0.7rem' // Fuente más pequeña para las listas internas
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
                Vessel Visit Notifications List ({notifications.length})
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && notifications.length === 0 && !error && (
                <Alert severity="info">No vessel visit notifications found.</Alert>
            )}

            {/* --- TABLA CON DETALLES DEL DTO VVN --- */}
            {notifications.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                {/* Columnas basadas en el DTO VVN */}
                                <TableCell sx={{ fontWeight: 'bold' }}>Vessel Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Vessel IMO</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Submitted By</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ETD</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Notification ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Rejection Reason</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Assigned Dock</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cargo Manifest</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Crew members</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notifications.map((n) => (
                                <TableRow key={n.Id}> 
                                    <TableCell>{n.vesselName || 'N/A'}</TableCell>
                                    <TableCell>{n.vesselIMO || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                color: n.status === 'Submitted' ? 'orange' : 
                                                       n.status === 'Approved' ? 'green' : 
                                                       n.status === 'Rejected' ? 'red' : 'gray' 
                                            }}
                                        >
                                            {n.status || 'State'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{n.submittedByName || 'N/A'}</TableCell>
                                    <TableCell>{formatDate(n.eta)}</TableCell>
                                    <TableCell>{formatDate(n.etd)}</TableCell>
                                    <TableCell>{n.id}</TableCell>
                                    <TableCell>{n.rejectionReason || 'Notification not Rejected'}</TableCell>   
                                    <TableCell>{n.assignedDockId || 'No dock'}</TableCell>
                                    <TableCell sx={listCellStyle}>
                                        <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                                            <List dense disablePadding>
                                                {/* Iterar sobre todos los manifiestos para extraer los ContainerIds */}
                                                {n.cargoManifests && n.cargoManifests.length > 0 ? (
                                                    // Usamos flatMap para obtener una lista plana de todos los ContainerIds
                                                    n.cargoManifests.flatMap(manifest => manifest.containerIdentifiers || [])
                                                        .map((containerIdentifier, index) => (
                                                            <ListItem key={index} sx={{ py: 0, px: 0.5 }}>
                                                                <ListItemText 
                                                                    primary={containerIdentifier.substring(0, 8) + '...'} 
                                                                    primaryTypographyProps={{ style: { fontSize: '0.7rem' } }} 
                                                                />
                                                            </ListItem>
                                                        ))
                                                ) : (
                                                    <ListItem sx={{ py: 0, px: 0.5 }}>No cargo info</ListItem>
                                                )}
                                            </List>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={listCellStyle}>
                                        <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                                            <List dense disablePadding>
                                                {n.crewMembers && n.crewMembers.length > 0 ? (
                                                    n.crewMembers.map((member, index) => (
                                                        <ListItem key={index} sx={{ py: 0, px: 0.5 }}>
                                                            <ListItemText 
                                                                primary={member.name || `Member ${index + 1}`} 
                                                                primaryTypographyProps={{ style: { fontSize: '0.7rem' } }} 
                                                            />
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <ListItem sx={{ py: 0, px: 0.5 }}>No crew info</ListItem>
                                                )}
                                            </List>
                                        </Box>
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

export default ListNotificationsPage;