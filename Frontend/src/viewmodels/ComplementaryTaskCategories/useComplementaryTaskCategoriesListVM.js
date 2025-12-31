import { useState, useEffect, useCallback } from 'react';
import { useApiOEM } from '../../services/api';
import { getComplementaryTaskCategories, generateMockComplementaryTaskCategories } from '../../services/complementaryTaskCategoryService';

export const useComplementaryTaskCategoriesListVM = () => {
  const { apiOemFetch } = useApiOEM();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    const useMock = false; 

    if (useMock) {
      try {
        const mockData = generateMockComplementaryTaskCategories();
        await new Promise((r) => setTimeout(r, 300)); // symulacja opóźnienia
        setCategories(mockData);
      } catch (err) {
        setError('Failed to fetch mock data');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const list = await getComplementaryTaskCategories(apiOemFetch);
      setCategories(list);
    } catch (err) {
      setError(err.message || 'Failed to fetch data from server. Using mock data.');
      // fallback na mock data
      const mockData = generateMockComplementaryTaskCategories();
      setCategories(mockData);
    } finally {
      setLoading(false);
    }
  }, [apiOemFetch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
};
