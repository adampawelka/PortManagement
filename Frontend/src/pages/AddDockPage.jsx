import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Simulado
import { Container, TextField, Button, Typography, CircularProgress, Alert, FormControl, Select, MenuItem, InputLabel, OutlinedInput, Box, Chip } from '@mui/material';
// import "../styles/App.css"; // Eliminado

const API_ENDPOINT = 'http://localhost:5000/api';
// 1. CORRECCIÓN: Usar el endpoint de Tipos de Buques, no Buques individuales.
const VESSEL_TYPES_API = `${API_ENDPOINT}/VesselTypes`; 
const DOCKS_API = `${API_ENDPOINT}/Docks`;

// DTO fields: DockName, DockLocation, Depth, Length, MaxDraft, AllowedVesselTypes
const initialFormState = {
    dockName: '',
    dockLocation: '',
    depth: '', 
    length: '', 
    maxDraft: '', 
    // 2. CORRECCIÓN: Añadir estado para los IDs de tipos de buques seleccionados.
    selectedVesselTypeIds: [], 
};

const AddDockPage = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    // Cambiamos el nombre de la variable para ser más claro: types, no vessels.
    const [vesselTypes, setVesselTypes] = useState([]); 
    
    // Función simulada para obtener el token
    const { getAccessTokenSilently, user } = useAuth0(); 

    const fetchProtected = useCallback(async (url) => {
        const token = await getAccessTokenSilently();
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                // CORRECCIÓN: Fetch Vessel Types data
                const vesselTypesData = await fetchProtected(VESSEL_TYPES_API);

                // Asumo que cada tipo de buque tiene un 'Id' (Guid) y 'Name'
                setVesselTypes(vesselTypesData);
                
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load initial data (Vessel Types list).' });
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [fetchProtected]);
        
    // 3. CORRECCIÓN: Lógica para manejar cambios, incluido el multi-select.
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'selectedVesselTypeIds') {
            // Manejo de la selección múltiple (MUI devuelve el array de valores)
            setFormData(prev => ({
                ...prev,
                [name]: typeof value === 'string' ? value.split(',') : value,
            }));
        } else {
            // Manejo de inputs de texto/número
            setFormData({ 
                ...formData, 
                [name]: value 
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!formData.dockName) {
            setMessage({ type: 'error', text: 'Dock Name is required.' });
            setLoading(false);
            return;
        }

        // 4. CORRECCIÓN: El DTO incluye los IDs seleccionados.
        const dockDto = {
            DockName: formData.dockName,
            DockLocation: formData.dockLocation,
            Depth: parseFloat(formData.depth) || 0.0,
            Length: parseFloat(formData.length) || 0.0,
            MaxDraft: parseFloat(formData.maxDraft) || 0.0,
            // Usamos el array de IDs del estado
            AllowedVesselTypes: formData.selectedVesselTypeIds, 
        };
        
        try {
            const token = await getAccessTokenSilently();
            
            const response = await fetch(DOCKS_API, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dockDto)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Dock created successfully!' });
                setFormData(initialFormState);
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
                p: 3, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 600 }}>
                Add New Dock
            </Typography>
            
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Dock Name" 
                    name="dockName" 
                    value={formData.dockName} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                />
                <TextField 
                    label="Location" 
                    name="dockLocation" 
                    value={formData.dockLocation} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                />
                
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Dimensions (Double/Decimal):</Typography>
                <TextField 
                    label="Depth (m)" 
                    name="depth" 
                    type="number" 
                    inputProps={{ step: "0.01" }}
                    value={formData.depth} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Navigable depth of the water (e.g., 15.5)"
                />
                <TextField 
                    label="Length (m)" 
                    name="length" 
                    type="number" 
                    inputProps={{ step: "0.01" }}
                    value={formData.length} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Total usable length of the dock face"
                />
                <TextField 
                    label="Max Draft (m)" 
                    name="maxDraft" 
                    type="number" 
                    inputProps={{ step: "0.01" }}
                    value={formData.maxDraft} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Maximum allowed vessel draft"
                />

                {/* 5. CORRECCIÓN: Componente Multi-Select para AllowedVesselTypes */}
                <FormControl fullWidth margin="normal" required disabled={loading} sx={{ mt: 2 }}>
                    <InputLabel id="vessel-types-select-label">Allowed Vessel Types</InputLabel>
                    <Select
                        labelId="vessel-types-select-label"
                        name="selectedVesselTypeIds"
                        multiple // Habilita la selección múltiple
                        value={formData.selectedVesselTypeIds}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Allowed Vessel Types" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => {
                                    const type = vesselTypes.find(v => v.id === value);
                                    // Asumo que el DTO del tipo de buque tiene 'id' y 'name'
                                    return <Chip key={value} label={type ? type.name : 'Unknown Type'} />;
                                })}
                            </Box>
                        )}
                    >
                        {vesselTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name} 
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading} 
                    sx={{ mt: 4, py: 1.5, backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }} 
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Dock'}
                </Button>
            </form>
        </Container>
    );
};

export default AddDockPage;