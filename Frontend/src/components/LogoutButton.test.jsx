import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogoutButton from './LogoutButton'; 

// Reuse the auth0 mock
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

const { useAuth0 } = await import('@auth0/auth0-react');

describe('LogoutButton', () => {
  it('should call logout function with correct return URL when clicked', () => {
    // 1. Prapre the logout spy function
    const logoutMock = vi.fn();

    // Simulate that auth0 returns user logout
    useAuth0.mockReturnValue({
      logout: logoutMock,
      isAuthenticated: true,
    });
    
    render(<LogoutButton />);

    // 2. Shoot the click event
    const button = screen.getByText(/Log out/i);
    fireEvent.click(button);

    // 3. Verify that function was correctly called
    expect(logoutMock).toHaveBeenCalledWith({
      logoutParams: { returnTo: window.location.origin },
    });
  });
});