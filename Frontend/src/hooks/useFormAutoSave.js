import { useEffect, useCallback } from 'react';

/**
 * Hook to automatically save and restore form data from localStorage
 * Prevents data loss when user navigates away to copy/paste values
 * 
 * @param {string} storageKey - Unique key for localStorage (e.g., 'add-vessel-form')
 * @param {Object} formData - Current form data state
 * @param {Function} setFormData - Function to set form data
 * @param {Object} initialFormState - Initial empty form state
 * @param {boolean} enabled - Whether auto-save is enabled (default: true)
 */
export const useFormAutoSave = (
  storageKey,
  formData,
  setFormData,
  initialFormState,
  enabled = true
) => {
  // Load saved data on mount (only once)
  useEffect(() => {
    if (!enabled) return;

    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Only restore if form is currently empty (don't overwrite if user already started)
        const isFormEmpty = Object.values(formData).every(
          value => value === '' || value === null || value === 0 || 
          (Array.isArray(value) && value.length === 0)
        );
        
        if (isFormEmpty) {
          setFormData(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Save data whenever formData changes
  useEffect(() => {
    if (!enabled) return;

    try {
      // Check if form has any data
      const hasData = Object.values(formData).some(
        value => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value.trim() !== '';
          if (typeof value === 'number') return value !== 0;
          return value !== null && value !== undefined;
        }
      );

      if (hasData) {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      } else {
        // If form is empty, remove saved data
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [formData, storageKey, enabled]);

  // Function to clear saved data (call after successful submission)
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  }, [storageKey]);

  return { clearSavedData };
};

