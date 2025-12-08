import React from "react";
import { useUserManagementVM } from "../../viewmodels/Users/useUserManagementVM";
import "../../styles/UserManagement.css";

const UserManagement = () => {
  const {
    users,
    roles,
    selectedUser,
    selectedRole,
    showRoleModal,
    setSelectedRole,
    setSelectedUser,
    setShowRoleModal,
    handleAssignRole,
    handleGenerateActivationToken,
    handleDeactivate,
    handleReactivate,
  } = useUserManagementVM();

  return (
    <div className="um-wrapper">
      <h1>User Management</h1>

      <table className="um-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="um-actions-header">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>

              {/* ROLE CHIP */}
              <td>
                <span
                  className={`um-chip ${
                    user.role === "Administrator" ? "chip-admin" : "chip-default"
                  }`}
                >
                  {user.role}
                </span>
              </td>

              {/* STATUS CHIP */}
              <td>
                <span
                  className={`um-chip ${
                    user.status === "Active" ? "chip-active" : "chip-inactive"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="um-actions">
                <button
                  className="um-btn primary"
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedRole(user.role);
                    setShowRoleModal(true);
                  }}
                >
                  Change Role
                </button>

                {user.status === "Deactivated" && (
                  <>
                    <button
                      className="um-btn success"
                      onClick={() => handleGenerateActivationToken(user.id)}
                    >
                      Activate
                    </button>

                    <button
                      className="um-btn success"
                      onClick={() => handleReactivate(user.id)}
                    >
                      Reactivate
                    </button>
                  </>
                )}

                {user.status === "Active" && (
                  <button
                    className="um-btn danger"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showRoleModal && (
        <div className="um-modal-overlay">
          <div className="um-modal">
            <h2>Assign Role</h2>

            <p>
              User: <strong>{selectedUser?.name}</strong>
            </p>
            <p>
              Email: <strong>{selectedUser?.email}</strong>
            </p>

            <div className="um-modal-input">
              <label>Select Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">-- Select Role --</option>

                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="um-modal-buttons">
              <button
                className={`um-btn primary full ${
                  !selectedRole ? "disabled" : ""
                }`}
                disabled={!selectedRole}
                onClick={handleAssignRole}
              >
                Assign Role
              </button>

              <button
                className="um-btn secondary full"
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole("");
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
