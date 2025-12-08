// src/viewmodels/useStorageAreasPageVM.js
import { useState, useEffect } from 'react';
import { getStorageAreas } from '../../services/storageAreaService'; // Importing the service

export const useStorageAreasListVM = () => {
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
      const data = await getStorageAreas(); // Fetch storage areas using the service

      // Ensure the data is an array
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

  // Helper function to render dock distances in the table
  const renderDockDistances = (dockDistances) => {
    if (!dockDistances || dockDistances.length === 0) return 'No dock distance info';

    return (
      <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
        <List dense disablePadding>
          {dockDistances.map((d, index) => (
            <ListItem key={d.dockId || index} sx={{ py: 0, px: 0.5 }}>
              <ListItemText 
                primary={`${d.dockName || 'N/A'}: ${d.distance || 0}m`} 
                primaryTypographyProps={{ style: { fontSize: '0.7rem' } }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return {
    storageAreas,
    loading,
    error,
    renderDockDistances,
  };
};
