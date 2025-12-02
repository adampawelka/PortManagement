import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';

const UserManagement = () => {
  const { apiFetch } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    'Administrator',
    'PortAuthorityOfficer',
    'ShippingAgentRepresentative',
    'LogisticsOperator'
  ];

  useEffect(() => {
    loadUsers();
  }, [apiFetch]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const response = await apiFetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRole)
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign role');
      }
      
      alert('Role assigned successfully!');
      setShowRoleModal(false);
      setSelectedUser(null);
      setSelectedRole('');
      loadUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role');
    }
  };

  const handleGenerateActivationToken = async (userId) => {
    if (!window.confirm('Generate activation token and send email?')) return;

    try {
      const response = await apiFetch(`/api/users/${userId}/activation-token`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to send activation email');
      }
      
      alert('Activation email sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send activation email');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return;

    try {
      const response = await apiFetch(`/api/users/${userId}/deactivate`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }
      
      alert('User deactivated!');
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to deactivate user');
    }
  };

  const handleReactivate = async (userId) => {
    if (!window.confirm('Reactivate this user?')) return;

    try {
      const response = await apiFetch(`/api/users/${userId}/reactivate`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to reactivate user');
      }
      
      alert('User reactivated!');
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reactivate user');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{user.name}</td>
              <td style={{ padding: '12px' }}>{user.email}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: user.role === 'Administrator' ? '#e3f2fd' : '#f5f5f5',
                  fontSize: '0.9em'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: user.status === 'Active' ? '#c8e6c9' : '#ffcdd2',
                  fontSize: '0.9em'
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'right' }}>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedRole(user.role);
                    setShowRoleModal(true);
                  }}
                  style={{
                    padding: '6px 12px',
                    marginRight: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Assign Role
                </button>
                
                {user.status === 'Deactivated' && (
                  <>
                    <button
                      onClick={() => handleGenerateActivationToken(user.id)}
                      style={{
                        padding: '6px 12px',
                        marginRight: '8px',
                        cursor: 'pointer',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Send Activation
                    </button>
                    <button
                      onClick={() => handleReactivate(user.id)}
                      style={{
                        padding: '6px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                    >
                      Reactivate
                    </button>
                  </>
                )}
                
                {user.status === 'Active' && (
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    style={{
                      padding: '6px 12px',
                      cursor: 'pointer',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            minWidth: '400px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2>Assign Role</h2>
            <p>User: <strong>{selectedUser?.name}</strong></p>
            <p>Email: <strong>{selectedUser?.email}</strong></p>

            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Select Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAssignRole}
                disabled={!selectedRole}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: selectedRole ? '#2196F3' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: selectedRole ? 'pointer' : 'not-allowed'
                }}
              >
                Assign Role
              </button>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;