import React, { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

// Definición de Endpoints
const API_ENDPOINT = 'http://localhost:5000/api';
const RESOURCES_API = `${API_ENDPOINT}/Resources`;

// DTO fields: Code (string), Description, Type, Capacity (double), Status, SetupTime (int)
const initialFormState = {
    code: '',
    description: '',
    type: '',
    capacity: '', 
    status: '', 
    setupTime: '', 
};

const AddResourcePage = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const { getAccessTokenSilently, user } = useAuth0(); 

    const fetchProtected = useCallback(async (url) => {
            const token = await getAccessTokenSilently();
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            return response.json();
    }, [getAccessTokenSilently]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validación básica
        if (!formData.code || !formData.capacity || !formData.type) {
            setMessage({ type: 'error', text: 'Code, Type, and Capacity are required.' });
            setLoading(false);
            return;
        }

        // Crear el DTO final con PascalCase y conversión de tipos
        const resourceDto = {
            Code: formData.code,
            Description: formData.description,
            Type: formData.type,
            // Convertir a Double (flotante)
            Capacity: parseFloat(formData.capacity) || 0.0,
            Status: formData.status,
            // Convertir a Int
            SetupTime: parseInt(formData.setupTime) || 0,
        };
        
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(RESOURCES_API, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(resourceDto)
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
                p: 4, 
                borderRadius: 2, 
                boxShadow: 3 
            }}
        >
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#007bff', fontWeight: 600 }}>
                Add New Resource
            </Typography>
            
            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Code (Unique Identifier)" 
                    name="code" 
                    value={formData.code} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="This must be a unique code for the resource (e.g., CRN001)."
                />
                <TextField 
                    label="Type (e.g., Crane, Forklift, Staff)" 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                />
                <TextField 
                    label="Description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    multiline 
                    rows={2} 
                    variant="outlined"
                />
                <TextField 
                    label="Status" 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="e.g., active, maintenance, inactive" 
                />
                
                <Typography variant="h6" sx={{ mt: 3 }}>Operational Details:</Typography>
                <TextField 
                    label="Capacity (Decimal)" 
                    name="capacity" 
                    type="number" 
                    inputProps={{ step: "0.01" }} 
                    value={formData.capacity} 
                    onChange={handleChange} 
                    required 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="e.g., lifting capacity, containers per hour."
                />
                <TextField 
                    label="Setup Time (Minutes)" 
                    name="setupTime" 
                    type="number" 
                    inputProps={{ min: 0 }} 
                    value={formData.setupTime} 
                    onChange={handleChange} 
                    fullWidth 
                    margin="normal" 
                    variant="outlined"
                    helperText="Time required to prepare the resource for a task."
                />
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading} 
                    sx={{ 
                        mt: 4, 
                        py: 1.5,
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#388E3C' }
                    }} 
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Resource'}
                </Button>
            </form>
        </Container>
    );
};

export default AddResourcePage;