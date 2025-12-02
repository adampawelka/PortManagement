import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

// --- CONSTANTES Y ESTADO ---
// Nuevo endpoint para obtener representantes de una ORG específica:
//const REPS_BY_ORG_API = (id) => `${API_URL}//representatives/${id}`; 
//const ORGS_API = `${API_URL}/ShippingAgents`;
const VESSELS_API = `/api/Vessels`;

const initialFormState = {
  vesselId: '', // Ahora será seleccionado
  submittedById: '', // Ahora será seleccionado
  eta: new Date().toISOString().slice(0, 16),
  etd: new Date().toISOString().slice(0, 16),
  loadunload: '',
  manifestContainers: '', 
  crewName: '',
  crewCitizenId: '',
  crewNationality: '',
};

const AddVVNPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); 
  
  // ✅ NUEVOS ESTADOS PARA EL CONTROL DE LA CASCADA
  //const [organizations, setOrganizations] = useState([]);
  //const [representatives, setRepresentatives] = useState([]); 
  const [vessels, setVessels] = useState([]); 
  //const [selectedOrgId, setSelectedOrgId] = useState(''); // ID de la Organización seleccionada
  
  const { apiFetch } = useApi();

  // 1. EFECTO INICIAL: Carga SOLO Buques
useEffect(() => {
  const loadInitialData = async () => {
    try {
      const response = await apiFetch(VESSELS_API);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vessels');
      }
      
      const vesselsData = await response.json();
      setVessels(vesselsData);
      
    } catch (error) {
      // Mensaje simplificado
      setMessage({ type: 'error', text: 'Failed to load initial data (Vessels list).' });
    } finally {
      setLoading(false);
    }
  };
  loadInitialData();
}, [apiFetch]);


  // 2. EFECTO DE CASCADA: Carga Representantes solo cuando cambia selectedOrgId
  //useEffect(() => {
    /*if (!selectedOrgId) {
        setRepresentatives([]);
        setFormData(prev => ({ ...prev, submittedById: '' }));
        return;
    }
    */   
/*
    const loadRepresentatives = async () => {
        try {
            // ✅ LLAMADA CONDICIONAL: Usamos el endpoint con el ID de la organización
            const repsData = await fetchProtected(REPS_BY_ORG_API(selectedOrgId)); 
            setRepresentatives(repsData);
            
            // Setea el primer representante por defecto
            if (repsData.length > 0) {
                setFormData(prev => ({ ...prev, submittedById: repsData[0].id }));
            } else {
                 setFormData(prev => ({ ...prev, submittedById: '' }));
            }

        } catch (err) {
            console.error('Error loading representatives:', err);
            setRepresentatives([]);
        }
    };

    loadRepresentatives();
  }, [selectedOrgId, fetchProtected]); // <-- Se activa solo cuando cambia la ORG

*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    /* Si el usuario cambia la Organización, actualizamos selectedOrgId para activar la cascada
    if (name === 'selectedOrgId') {
        setSelectedOrgId(value);
    }
        */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!formData.vesselId || !formData.submittedById) {
        setMessage({ type: 'error', text: 'Vessel and Submitter must be selected.' });
        setSubmitting(false);
        return;
    }
    
    // ... (Construcción del DTO vvnDto igual que antes) ...

    const vvnDto = {
        VesselId: formData.vesselId, // ✅ ID del buque seleccionado
        SubmittedById: formData.submittedById, // ✅ ID del representante seleccionado
        ETA: formData.eta + ':00Z', 
        ETD: formData.etd + ':00Z', 
        CargoManifests: [{ ManifestType: formData.loadunload, ContainerIdentifiers: formData.manifestContainers.split(',').map(id => id.trim()) }],
        CrewMembers: [{ Name: formData.crewName, CitizenId: formData.crewCitizenId, Nationality: formData.crewNationality }],
    };
    
    try {
        const response = await apiFetch('/api/VesselVisitNotifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vvnDto)
        });

        if (response.ok) {
            setMessage({ type: 'success', text: 'Notification submitted successfully!' });
            setFormData(initialFormState);
        } else {
            const errorData = await response.json(); 
            setMessage({ type: 'error', text: `Submission failed: ${errorData.Message || errorData.title || response.statusText}.` });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error or token failure.' });
    } finally {
        setSubmitting(false);
    }
  };

  // --- RENDERIZADO JSX ---
  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading initial data...</Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Submit New Vessel Visit Notification</Typography>
      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mt: 2 }}>Agent & Vessel Details:</Typography>
        
        
        {/* --- SELECT 1: ORGANIZACIÓN --- 
        <FormControl fullWidth margin="normal" required disabled={submitting || loading}>
            <InputLabel>Shipping Agent Organization</InputLabel>
            <Select
                name="selectedOrgId" // Importante: Usa 'selectedOrgId' para activar el handleChange especial
                value={selectedOrgId}
                label="Shipping Agent Organization"
                onChange={handleChange}
            >
                {organizations.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                        {org.legalName} ({org.taxNumber})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        
        {/* --- SELECT 2: REPRESENTANTE (DEPENDE DE LA ORGANIZACIÓN) --- 
        <FormControl fullWidth margin="normal" required disabled={submitting || !selectedOrgId}>
            <InputLabel>Submitted By (Agent Representative)</InputLabel>
            <Select
                name="submittedById"
                value={formData.submittedById}
                label="Submitted By (Agent Representative)"
                onChange={handleChange}
            >
                {representatives.length === 0 ? (
                     <MenuItem disabled>No representatives found for this organization.</MenuItem>
                ) : (
                    representatives.map((rep) => (
                        <MenuItem key={rep.id} value={rep.id}>
                            {rep.repName} ({rep.citizenId})
                        </MenuItem>
                    ))
                )}
            </Select>
        </FormControl> 
        */}

        {/* --- CAMPO MANUAL: Submitted By (ID) --- */}
        <TextField 
            label="Submitted By (Agent Representative ID)" 
            name="submittedById" 
            value={formData.submittedById} 
            onChange={handleChange} 
            required 
            fullWidth 
            margin="normal" 
            helperText="Enter the Agent Representative's GUID/ID manually."
        />
        
        {/* --- SELECT: Vessel ID --- */}
        <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="vessel-select-label">Vessel IMO/ID</InputLabel>
            <Select
                labelId="vessel-select-label"
                name="vesselId"
                value={formData.vesselId}
                label="Vessel IMO/ID"
                onChange={handleChange}
            >
                {vessels.map((v) => (
                    // Asumo que el DTO del buque tiene 'id' y 'imoNumber'
                    <MenuItem key={v.id} value={v.id}>
                        {v.imoNumber} - {v.vesselName} 
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        
        <TextField label="Estimated Time of Arrival (ETA)" name="eta" type="datetime-local" value={formData.eta} onChange={handleChange} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Estimated Time of Departure (ETD)" name="etd" type="datetime-local" value={formData.etd} onChange={handleChange} required fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        
        {/* ... (Resto de campos de Crew y Manifests) ... */}
        <Typography variant="h6" sx={{ mt: 3 }}>Cargo Manifest & Crew:</Typography>

        <TextField 
            label="Loading / Unloading"
            name="loadunload" 
            value={formData.loadunload} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            multiline rows={1}
            
        />

        <TextField 
            label="Container IDs (Comma Separated)"
            name="manifestContainers" 
            value={formData.manifestContainers} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            multiline rows={2}
            helperText="Example: ABCU1234567, XYZU9876543"
        />

        <TextField label="Crew Name" name="crewName" value={formData.crewName} onChange={handleChange} fullWidth margin="normal"  />
        <TextField label="Crew Citizen ID" name="crewCitizenId" value={formData.crewCitizenId} onChange={handleChange} fullWidth margin="normal" helperText="123456789" />
        <TextField label="Crew Nationality" name="crewNationality" value={formData.crewNationality} onChange={handleChange} fullWidth margin="normal" />
        
        
        <Button type="submit" variant="contained" disabled={submitting} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit VVN'}
        </Button>
      </form>
    </Container>
  );
};
  


export default AddVVNPage;