import { useState, useEffect } from 'react';
import { getResources } from  '../../services/resourceService'; 
import { useApi } from '../../services/api';

export const useAvailableResourcesVM = () => {
    const { apiFetch } = useApi();  
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
            const data = await getResources(apiFetch);
            setResources(data); 
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError(`Failed to load resources: ${err.message}`);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        resources,
        loading,
        error,
    };
};
