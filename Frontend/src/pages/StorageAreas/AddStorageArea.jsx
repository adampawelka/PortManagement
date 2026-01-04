import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Alert, TextField, Button, 
  CircularProgress, Paper, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useAddStorageAreaVM } from '../../viewmodels/StorageAreas/useAddStorageAreaVM';
import { useApi } from '../../services/api';
import { getDocks } from '../../services/dockService';
import { useNavigate } from 'react-router-dom';

const AddStorageAreaPage = () => {
  const navigate = useNavigate();
  const { apiFetch } = useApi();
  const { addNewStorageArea, loading: submitting, message } = useAddStorageAreaVM();

  const [docks, setDocks] = useState([]);
  const [docksLoading, setDocksLoading] = useState(true);

  const [formData, setFormData] = useState({
    storageAreaLocation: '',
    storageAreaType: '',
    maxCapacity: '',
    currentOccupancy: '',
  });

  const [dockDistances, setDockDistances] = useState([]);
  const [newDockDistance, setNewDockDistance] = useState({ dockId: '', distance: '' });

  // Fetch docks on component mount
  useEffect(() => {
    const fetchDocks = async () => {
      try {
        setDocksLoading(true);
        const data = await getDocks(apiFetch);
        setDocks(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        console.error('Error fetching docks:', err);
        setDocks([]);
      } finally {
        setDocksLoading(false);
      }
    };
    fetchDocks();
  }, [apiFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDockDistance = () => {
    if (newDockDistance.dockId && newDockDistance.distance) {
      const selectedDock = docks.find(d => d.id === newDockDistance.dockId);
      setDockDistances(prev => [...prev, { 
        dockId: newDockDistance.dockId,
        dockName: selectedDock?.dockName || 'Unknown',
        distance: newDockDistance.distance 
      }]);
      setNewDockDistance({ dockId: '', distance: '' });
    }
  };

  const removeDockDistance = (index) => {
    setDockDistances(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storageAreaLocation || !formData.storageAreaType || !formData.maxCapacity) {
      alert('Please fill in all required fields');
      return;
    }

    const storageAreaDto = {
      storageAreaLocation: formData.storageAreaLocation,
      storageAreaType: formData.storageAreaType,
      maxCapacity: parseInt(formData.maxCapacity, 10),
      currentOccupancy: formData.currentOccupancy ? parseInt(formData.currentOccupancy, 10) : 0,
      dockDistances: dockDistances.map(d => ({
        dockId: d.dockId,
        distance: parseFloat(d.distance)
      }))
    };

    try {
      await addNewStorageArea(storageAreaDto);
      setFormData({
        storageAreaLocation: '',
        storageAreaType: '',
        maxCapacity: '',
        currentOccupancy: '',
      });
      setDockDistances([]);
      // Navigate back after success
      setTimeout(() => navigate('/storage-areas/list'), 1500);
    } catch (error) {
      // Error message is handled by the VM
    }
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: 4, 
        mb: 4,
        backgroundColor: 'var(--color-surface)', 
        p: 4, 
        borderRadius: 'var(--radius-md)', 
        boxShadow: 3,
        fontFamily: 'var(--font-family-base)',
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ color: 'var(--color-primary-light)', fontWeight: 600, mb: 3, fontSize: 'var(--font-size-large)' }}
      >
        Add New Storage Area
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Basic Storage Area Info */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-background)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--color-text-dark)' }}>
            Storage Area Details
          </Typography>

          <TextField
            label="Location"
            name="storageAreaLocation"
            value={formData.storageAreaLocation}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            placeholder="e.g., Warehouse A, Zone 1"
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              name="storageAreaType"
              value={formData.storageAreaType}
              label="Type"
              onChange={handleChange}
            >
              <MenuItem value="Warehouse">Warehouse</MenuItem>
              <MenuItem value="Yard">Yard</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Max Capacity (units)"
            name="maxCapacity"
            type="number"
            value={formData.maxCapacity}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Current Occupancy (units)"
            name="currentOccupancy"
            type="number"
            value={formData.currentOccupancy}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
        </Paper>

        {/* Dock Distances */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-background)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'var(--color-text-dark)' }}>
            Dock Distances
          </Typography>

          {dockDistances.length > 0 && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
              {dockDistances.map((dock, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">
                    {dock.dockName}: {dock.distance} meters
                  </Typography>
                  <Button 
                    variant="text" 
                    color="error" 
                    size="small"
                    onClick={() => removeDockDistance(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth size="small" disabled={docksLoading}>
              <InputLabel>Dock</InputLabel>
              <Select
                value={newDockDistance.dockId}
                label="Dock"
                onChange={(e) => setNewDockDistance(prev => ({ ...prev, dockId: e.target.value }))}
              >
                <MenuItem value="">-- Select Dock --</MenuItem>
                {docks.map((dock) => (
                  <MenuItem key={dock.id} value={dock.id}>
                    {dock.dockName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Distance (meters)"
              type="number"
              value={newDockDistance.distance}
              onChange={(e) => setNewDockDistance(prev => ({ ...prev, distance: e.target.value }))}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
            <Button
              variant="outlined"
              onClick={addDockDistance}
              disabled={!newDockDistance.dockId || !newDockDistance.distance}
              sx={{ minWidth: 120 }}
            >
              Add Dock
            </Button>
          </Box>
        </Paper>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          fullWidth
          sx={{ 
            mt: 3, 
            py: 1.5, 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
          }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Storage Area'}
        </Button>
      </form>
    </Container>
  );
};

export default AddStorageAreaPage;