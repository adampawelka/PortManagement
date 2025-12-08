import { useState, useCallback } from 'react';
import { searchDocks } from '../../services/dockService';
import { getVesselTypes } from '../../services/vesselTypeService';

export const useSearchDocksVM = (apiFetch) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // mapuje allowedVesselTypes z ID na obiekty { id, name }
 const mapVesselTypeObjects = async (docks) => {
  try {
    const vesselTypes = await getVesselTypes(apiFetch);
    const vesselTypeMap = vesselTypes.reduce((acc, type) => {
      acc[type.id.toString()] = { id: type.id, name: type.name };
      return acc;
    }, {});

    return docks.map(dock => ({
      ...dock,
      allowedVesselTypes: (dock.allowedVesselTypes || []).map(item => {
        if (typeof item === 'object' && item.name) {
          // Already has name, use it
          return item;
        } else {
          // Assume it's an ID and map it
          const key = item.toString();
          return vesselTypeMap[key] || { id: item, name: 'Unknown' };
        }
      }),
    }));
  } catch (err) {
    console.error('Failed to fetch vessel types:', err);
    return docks; // fallback
  }
};


  // helper do renderowania nazw
  const renderAllowedVesselTypes = (types) => {
    if (!types || types.length === 0) return 'No restrictions';
    return types.map(t => t.name || 'Unknown Type').join(', ');
  };

  const fetchDocks = useCallback(
    async (searchParams) => {
      setLoading(true);
      setMessage(null);
      setResults([]);

      try {
        const data = await searchDocks(apiFetch, searchParams);
        const dataArray = Array.isArray(data) ? data : (data ? [data] : []);

        if (dataArray.length === 0) {
          setMessage({ type: 'info', text: 'No docks found matching your search.' });
          setResults([]);
          return;
        }

        const docksWithNames = await mapVesselTypeObjects(dataArray);
        setResults(docksWithNames);
      } catch (err) {
        setMessage({ type: 'error', text: `Search failed: ${err.message}` });
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  return { results, loading, message, fetchDocks, renderAllowedVesselTypes };
};
