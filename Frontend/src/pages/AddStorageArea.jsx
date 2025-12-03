import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
const STORAGE_AREAS_API = `${API_ENDPOINT}/StorageAreas`;
const DOCKS_API = `${API_ENDPOINT}/Docks`; // Nuevo endpoint para obtener la lista de Docks
const VALID_STORAGE_TYPES = ['Warehouse', 'Yard'];

// DTO fields: StorageAreaType, StorageAreaLocation, MaxCapacity, CurrentOccupancy, DockDistances
const initialFormState = {
    storageAreaType: '',
    storageAreaLocation: '',
    maxCapacity: '',
    currentOccupancy: '',
};

const AddStorageAreaPage = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    
    // Estado para almacenar la lista de Docks disponibles
    const [availableDocks, setAvailableDocks] = useState([]); 
    
    // Estado para almacenar las distancias ingresadas (DockId -> Distance)
    const [dockDistances, setDockDistances] = useState({});
    const { getAccessTokenSilently, user } = useAuth0(); 

    // Función genérica para fetches protegidos
    const fetchProtected = useCallback(async (url) => {
        const token = await getAccessTokenSilently();
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return response.json();
    }, [getAccessTokenSilently]);

    // --- Carga de Docks al iniciar ---
    useEffect(() => {
        const loadDocks = async () => {
            setLoading(true);
            try {
                // Asumo que el DTO del Dock tiene 'id' (Guid) y 'dockName' (string)
                const docksData = await fetchProtected(DOCKS_API);
                setAvailableDocks(docksData);

                // Inicializar el estado de distancias para cada dock
                const initialDistances = docksData.reduce((acc, dock) => {
                    acc[dock.id] = ''; // Usamos el ID del Dock como clave
                    return acc;
                }, {});
                setDockDistances(initialDistances);
                
            } catch (error) {
                console.error("Error loading docks:", error);
                setMessage({ type: 'error', text: 'Failed to load Docks list. Cannot submit distances.' });
            } finally {
                setLoading(false);
            }
        };
        loadDocks();
    }, [fetchProtected]);
    // ---------------------------------

    // Manejo de cambios para los campos principales del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: value 
        });
    };

    // Manejo de cambios para los campos de distancia
    const handleDistanceChange = (dockId, value) => {
        setDockDistances(prev => ({
            ...prev,
            [dockId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validación básica
        if (!formData.storageAreaType || !formData.maxCapacity || !formData.currentOccupancy) {
            setMessage({ type: 'error', text: 'Area Type, Max Capacity, and Current Occupancy are required.' });
            setLoading(false);
            return;
        }

        // 1. CONSTRUCCIÓN DEL DTO COMPLEJO DockDistances
        const dockDistancesDto = availableDocks
            .map(dock => {
                const distanceValue = dockDistances[dock.id];
                // El backend espera un 'double', lo convertimos o usamos 0.0 si está vacío/inválido
                const distance = parseFloat(distanceValue) || 0.0; 

                // Si la distancia es 0 y el campo estaba vacío, puede ser aceptable. 
                // Si requerimos que se ingrese una distancia para cada dock, añadir una validación aquí.
                // Por ahora, asumimos que 0.0 es un valor por defecto válido.

                return {
                    // DTO espera DockId (Guid) y Distance (double)
                    DockId: dock.id, 
                    Distance: distance,
                };
            });


        // Crear el DTO final con PascalCase
        const storageAreaDto = {
            StorageAreaType: formData.storageAreaType,
            StorageAreaLocation: formData.storageAreaLocation,
            MaxCapacity: parseInt(formData.maxCapacity) || 0,
            CurrentOccupancy: parseInt(formData.currentOccupancy) || 0,
            // 2. INCLUIR EL CAMPO COMPLEJO
            DockDistances: dockDistancesDto, 
        };
        
        try {
            const token = await getAccessTokenSilently();
            
            const response = await fetch(STORAGE_AREAS_API, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(storageAreaDto)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Storage Area created successfully!' });
                setFormData(initialFormState);
                // Resetear las distancias
                setDockDistances(availableDocks.reduce((acc, dock) => ({ ...acc, [dock.id]: '' }), {})); 
            } else {
                const errorData = await response.status === 400 ? await response.json() : { Message: response.statusText };
                setMessage({ type: 'error', text: `Submission failed: ${errorData.Message || response.statusText}` });
            }
        } catch (err) {
            console.error("Fetch/Auth Error:", err);
            setMessage({ type: 'error', text: 'Network error or system failure. Check API connectivity.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                mt: 4, 
                backgroundColor: '#ffffff', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom 
                align="center" 
                sx={{ 
                    color: '#007bff', 
                    fontWeight: 600, 
                    mb: 3 
                }}
            >
                Add New Storage Area
            </Typography>
            
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {/* --- SECCIÓN PRINCIPAL --- */}
                <Typography variant="h5" sx={{ mt: 2, mb: 1, color: '#333' }}>General Details</Typography>
                <FormControl fullWidth margin="normal" required variant="outlined">
                    <InputLabel id="area-type-label">Area Type</InputLabel>
                    <Select
                        labelId="area-type-label"
                        name="storageAreaType"
                        value={formData.storageAreaType}
                        label="Area Type"
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>Select Type</em>
                        </MenuItem>
                        {VALID_STORAGE_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField 
                    label="Location" 
                    name="storageAreaLocation" 
                    value={formData.storageAreaLocation} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                />
                
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Capacity (Integer):</Typography>
                <TextField 
                    label="Max Capacity (TEUs)" 
                    name="maxCapacity" 
                    type="number" 
                    inputProps={{ min: 0 }} 
                    value={formData.maxCapacity} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Maximum total container capacity in TEUs."
                />
                <TextField 
                    label="Current Occupancy (TEUs)" 
                    name="currentOccupancy" 
                    type="number" 
                    inputProps={{ min: 0 }} 
                    value={formData.currentOccupancy} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Current number of containers stored in TEUs."
                />

                {/* --- SECCIÓN DE DISTANCIAS COMPLEJAS --- */}
                <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#333' }}>
                    Distances to Docks 
                    {availableDocks.length === 0 && <span style={{ color: 'red', fontSize: '0.8em', marginLeft: '10px' }}> (Loading or No Docks Available)</span>}
                </Typography>
                
                <Grid container spacing={2}>
                    {loading ? (
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <CircularProgress size={24} />
                            <Typography variant="body1">Loading Docks...</Typography>
                        </Grid>
                    ) : (
                        availableDocks.map(dock => (
                            <Grid item xs={12} sm={6} key={dock.id}>
                                <TextField
                                    label={`Distance to: ${dock.dockName}`}
                                    type="number"
                                    inputProps={{ step: "0.01", min: 0 }}
                                    fullWidth
                                    margin="none"
                                    variant="outlined"
                                    value={dockDistances[dock.id] || ''}
                                    onChange={(e) => handleDistanceChange(dock.id, e.target.value)}
                                    helperText={`Enter distance to ${dock.dockName} (meters)`}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
                {/* -------------------------------------- */}
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading || availableDocks.length === 0} 
                    sx={{ 
                        mt: 5, 
                        py: 1.5, 
                        backgroundColor: '#28a745', 
                        '&:hover': { backgroundColor: '#1e7e34' } 
                    }} 
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Storage Area'}
                </Button>
            </form>
        </Container>
    );
};

export default AddStorageAreaPage;