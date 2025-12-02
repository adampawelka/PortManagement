import React, { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, CircularProgress, Alert, Paper, TableContainer, 
    Table, TableHead, TableRow, TableCell, TableBody, Button, Box,
    FormControl, InputLabel, Select, MenuItem, Collapse,
    Grid 
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react'; // Eliminado para solucionar el error de compilación

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
const PENDING_USERS_API = `${API_ENDPOINT}/PendingUsers`; 
const USERS_API = `${API_ENDPOINT}/Users`; // Usaremos para PUT /Users/{id}/role

// Roles fijos disponibles
const USER_ROLES = [
    'PortAuthorityOfficer',
    'ShippingAgentRepresentative',
    'LogisticsOperator',
    'Administrator',
];


// Función de ayuda para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleString();
    } catch (e) {
        return 'Invalid Date';
    }
};

const ListPendingUsersPage = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para saber qué fila se está editando
    const [editingId, setEditingId] = useState(null); 
    // Estado para guardar los datos del formulario de la fila activa
    const [formData, setFormData] = useState({ role: 'PortAuthorityOfficer' }); 

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
                const validationErrors = response.status === 400 && errorJson.errors ? Object.values(errorJson.errors).flat() : [];
                errorText = validationErrors.length > 0 ? validationErrors.join(' | ') : (errorJson.Message || errorJson.title || errorText);
            } catch (e) {
                // Captura el error si la respuesta no es JSON (como en 400/500 con texto plano)
                errorText = `API returned ${response.status} (${response.statusText}).`;
            }
            throw new Error(errorText);
        }
        
        try {
            return await response.json();
        } catch (e) {
            return options.method === 'GET' ? [] : {};
        }
    }, [getAccessTokenSilently]); 

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProtected(PENDING_USERS_API);
            setPendingUsers(Array.isArray(data) ? data : (data ? [data] : []));
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`Failed to load pending users: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Maneja el cambio en el select de la fila activa
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    // *** Lógica para promover el usuario (PUT /Users/{id}/role + DELETE /PendingUsers/{id}) ***
    const handleActivateUser = async (user) => {
        if (!formData.role) {
            setError('Please select a Role before activating.');
            return;
        }

        setLoading(true);
        setError(null);
        
        // 1. Limpieza del ID: Crucial para el error Unrecognized Guid format.
        // Aseguramos que solo el GUID (sin comillas ni espacios) se use en la URL.
        const cleanUserId = String(user.id).replace(/"/g, '').trim();
        
        // Validación final antes de la llamada
        if (cleanUserId.length < 32) {
             setError(`ID is too short. Expected GUID, got: ${cleanUserId}`);
             setLoading(false);
             return;
        }

        try {
            // 1. ASIGNAR ROL (Promueve al User)
            // Endpoint: PUT /api/Users/{id}/role
            // Nota: El URL encode es importante si el ID contiene caracteres especiales (aunque no debería para un GUID).
            const roleUpdateUrl = `${USERS_API}/${encodeURIComponent(cleanUserId)}/role`;
            
            // CORRECCIÓN: Serializar la cadena de ROL directamente, sin objeto
            await fetchProtected(roleUpdateUrl, {
                method: 'PUT',
                body: JSON.stringify(formData.role) 
            });
            
            // 2. ELIMINAR DE PENDIENTES (Limpia la lista de espera)
            // Endpoint: DELETE /api/PendingUsers/{id}
            const deleteUrl = `${PENDING_USERS_API}/${encodeURIComponent(cleanUserId)}`;
            await fetchProtected(deleteUrl, { method: 'DELETE' });
            
            // Si tiene éxito, recargamos la lista para que el usuario desaparezca
            await loadData();
            setEditingId(null);
            setFormData({ role: 'PortAuthorityOfficer' }); // Resetear formulario
            
        } catch (err) {
            console.error("Promotion Error:", err);
            setError(`Promotion failed: ${err.message}. Please check API logs for details.`);
        } finally {
            setLoading(false);
        }
    };

    // Estilo para el contenedor que contrarresta el padding de 20px del GlobalLayout
    const containerStyle = {
        ml: '-20px', mr: '-20px', p: 0, mt: 0, width: '100%', boxSizing: 'border-box'
    };

    const UserRow = ({ user }) => {
        const isEditing = editingId === user.id;
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleToggle = () => {
            setEditingId(isEditing ? null : user.id);
            setFormData({ role: user.role || 'PortAuthorityOfficer' });
            setError(null); 
        };

        const handleSubmit = async () => {
            setIsSubmitting(true);
            await handleActivateUser(user);
            setIsSubmitting(false);
        };

        // Renderizado del estado
        const StatusDisplay = () => (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
                Pending
            </span>
        );

        return (
            <>
                <TableRow key={user.id}> 
                    <TableCell>
                        <Button size="small" onClick={handleToggle}>
                            {isEditing ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </Button>
                    </TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{(user.iamUserId || 'N/A').substring(0, 8) + '...'}</TableCell> 
                    <TableCell>{formatDate(user.attemptedAt)}</TableCell> 
                    <TableCell><StatusDisplay /></TableCell>
                    <TableCell>
                        <Button 
                            variant="contained" 
                            color={isEditing ? 'error' : 'primary'}
                            size="small"
                            onClick={handleToggle}
                        >
                            {isEditing ? 'Cancel' : 'Assign Role'}
                        </Button>
                    </TableCell>
                </TableRow>
                
                {/* Fila de Edición (Colapsable) */}
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={isEditing} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1.5, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                                <Typography variant="h6" gutterBottom>Complete User Profile</Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small" required disabled={isSubmitting}>
                                            <InputLabel id="role-select-label">Assign Role</InputLabel>
                                            <Select
                                                labelId="role-select-label"
                                                name="role"
                                                value={formData.role}
                                                label="Assign Role"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Role</em>
                                                </MenuItem>
                                                {USER_ROLES.map((role) => (
                                                    <MenuItem key={role} value={role}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            disabled={isSubmitting || !formData.role} 
                                            onClick={handleSubmit} 
                                            sx={{ py: 1.5 }} 
                                            fullWidth
                                        >
                                            {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'ACTIVATE & CREATE USER'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <Container 
            maxWidth={false} 
            sx={containerStyle}
        >
            <Box sx={{ p: '20px', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#007bff', fontWeight: 600, mb: 3 }}>
                    Pending Users for Activation ({pendingUsers.length})
                </Typography>

                {loading && <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto' }} />}
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && pendingUsers.length === 0 && !error && (
                    <Alert severity="info">No pending user registrations found.</Alert>
                )}

                {pendingUsers.length > 0 && (
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableCell /> {/* Columna para el botón de expansión */}
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>IAM User ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Registration Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <UserRow key={user.id} user={user} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default ListPendingUsersPage;