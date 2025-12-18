/**
 * Centralized error handling utility
 * Parses various error formats and returns user-friendly messages
 */

/**
 * Parse error response and return user-friendly message
 * @param {Error|Response|Object|string} error - The error to parse
 * @returns {string} User-friendly error message
 */
export const parseError = (error) => {
    // Handle Response objects (from fetch)
    if (error instanceof Response) {
      return parseResponseError(error);
    }
  
    // Handle Error objects
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('Network request failed')) {
        return 'Network error: Unable to connect to the server. Please check your internet connection.';
      }
      return error.message || 'An unexpected error occurred';
    }
  
    // Handle string errors
    if (typeof error === 'string') {
      return error;
    }
  
    // Handle object errors
    if (typeof error === 'object' && error !== null) {
      // Try common error message fields
      if (error.message) return error.message;
      if (error.error) return error.error;
      if (error.errors && Array.isArray(error.errors)) {
        return error.errors.join(', ');
      }
      if (error.errors && typeof error.errors === 'object') {
        // Handle validation errors object
        const messages = Object.values(error.errors).flat();
        return messages.join(', ');
      }
      if (error.title) return error.title;
      if (error.detail) return error.detail;
    }
  
    return 'An unexpected error occurred';
  };
  
  /**
   * Parse HTTP response error
   * @param {Response} response - The HTTP response
   * @returns {Promise<string>} User-friendly error message
   */
  const parseResponseError = async (response) => {
    // Map status codes to user-friendly messages
    const statusMessages = {
      400: 'Bad request: Please check your input and try again.',
      401: 'Unauthorized: Please log in again.',
      403: 'Forbidden: You do not have permission to perform this action.',
      404: 'Not found: The requested resource was not found.',
      409: 'Conflict: This action conflicts with existing data.',
      422: 'Validation error: Please check your input.',
      500: 'Server error: Something went wrong on the server. Please try again later.',
      502: 'Bad gateway: The server is temporarily unavailable.',
      503: 'Service unavailable: The server is temporarily unavailable.',
      504: 'Gateway timeout: The request took too long. Please try again.',
    };
  
    // Get status-specific message
    const statusMessage = statusMessages[response.status] || 
      `Error ${response.status}: ${response.statusText || 'An error occurred'}`;
  
    // Try to parse response body for more details
    try {
      const contentType = response.headers.get('content-type');
      let errorData;
  
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        if (text) {
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = { message: text };
          }
        }
      }
  
      // Extract detailed error message if available
      if (errorData) {
        if (errorData.message) {
          return `${statusMessage} ${errorData.message}`;
        }
        if (errorData.error) {
          return `${statusMessage} ${errorData.error}`;
        }
        if (errorData.errors && Array.isArray(errorData.errors)) {
          return `${statusMessage} ${errorData.errors.join(', ')}`;
        }
        if (errorData.title) {
          return `${statusMessage} ${errorData.title}`;
        }
      }
    } catch (parseError) {
      // If parsing fails, just return status message
      console.error('Error parsing response:', parseError);
    }
  
    return statusMessage;
  };
  
  /**
   * Handle API error and return user-friendly message
   * This is the main function to use in API calls
   * @param {Error|Response|Object|string} error - The error to handle
   * @returns {Promise<string>|string} User-friendly error message
   */
  export const handleApiError = async (error) => {
    if (error instanceof Response) {
      return await parseResponseError(error);
    }
    return parseError(error);
  };