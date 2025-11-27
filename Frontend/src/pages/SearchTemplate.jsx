import React, { useState, useEffect } from 'react';
import useApiFetch from '../services/apiService'; // Usamos el hook genérico
import { Container, TextField, Button, Typography, CircularProgress } from '@mui/material';

const SearchTemplate = ({ entityName, searchEndpoint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usamos el hook de API, apuntando al endpoint base (ej. /api/Docks)
  const { fetchData } = useApiFetch(searchEndpoint);

  // NOTA: Esta función se ejecuta al hacer clic, no al montar
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      alert(`Please enter a search term for ${entityName}.`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Modificamos el fetchData para incluir el término de búsqueda
      // (Asumiendo que el endpoint de búsqueda acepta un query param 'q')
      const response = await fetchData(`search?q=${searchTerm}`); 
      setResults(response);
    } catch (err) {
      setError(`Failed to fetch ${entityName}. Server error.`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{entityName} Search</Typography>
      
      {/* --- FORMULARIO DE BÚSQUEDA --- */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label={`Search by Name or IMO for ${entityName}`}
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Button 
          variant="contained" 
          onClick={handleSearch} 
          disabled={loading}
          sx={{ minWidth: '150px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
        </Button>
      </div>

      {/* --- RESULTADOS --- */}
      {error && <Typography color="error">{error}</Typography>}
      
      {results.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <Typography variant="h6">{results.length} results found.</Typography>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '15px' }}>
            {JSON.stringify(results.slice(0, 5), null, 2)}
          </pre>
          {/* Aquí iría el componente de tabla de resultados detallado */}
        </div>
      )}
      
      {(!loading && results.length === 0 && searchTerm !== '') && (
        <Typography variant="body1" sx={{ mt: 3 }}>No results found for "{searchTerm}".</Typography>
      )}

    </Container>
  );
};

export default SearchTemplate;