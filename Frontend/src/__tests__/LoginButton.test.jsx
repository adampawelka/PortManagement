import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginButton from '../components/LoginButton'; 

// --- 1. Mock extern library ---
// It simulates that useAuth0 exists
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

// We import the useAuth0 mocked
const { useAuth0 } = await import('@auth0/auth0-react');


describe('LoginButton', () => {
  it('should render the "Log in" button', () => {
    // We configure Auth0 to return an empty function, simulating it isn't logged in
    useAuth0.mockReturnValue({
      loginWithRedirect: vi.fn(),
      isAuthenticated: false,
    });
    
    // We render gthe component
    render(<LoginButton />);

    // Verify that the button text is vissible
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
  });

  it('should call loginWithRedirect when clicked', () => {
    // Create a spy to verify if the function is called
    const loginMock = vi.fn();

    // Return mock spy
    useAuth0.mockReturnValue({
      loginWithRedirect: loginMock,
      isAuthenticated: false,
    });
    
    render(<LoginButton />);

    // Search the button and shot the click
    const button = screen.getByText(/Log in/i);
    fireEvent.click(button);

    // Verify that our spy was correctly called
    expect(loginMock).toHaveBeenCalledTimes(1);
  });
});