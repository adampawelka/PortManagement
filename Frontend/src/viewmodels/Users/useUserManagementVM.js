import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../services/api";

import {
  getUsers,
  assignRole,
  generateActivationToken,
  deactivateUser,
  reactivateUser
} from "../../services/userService"; 

export const useUserManagementVM = () => {
  const { apiFetch } = useApi();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);

  const roles = [
    "Administrator",
    "PortAuthorityOfficer",
    "ShippingAgentRepresentative",
    "LogisticsOperator",
  ];

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers(apiFetch);
      setUsers(data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await assignRole(apiFetch, selectedUser.id, selectedRole);
      alert("Role assigned successfully!");
      closeRoleModal();
      loadUsers();
    } catch (err) {
      alert("Failed to assign role");
    }
  };

  const handleGenerateActivationToken = async (userId) => {
    if (!window.confirm("Generate activation token and send email?")) return;

    try {
      await generateActivationToken(apiFetch, userId);
      alert("Activation email sent!");
    } catch (err) {
      alert("Failed to send activation email");
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm("Deactivate this user?")) return;

    try {
      await deactivateUser(apiFetch, userId);
      alert("User deactivated!");
      loadUsers();
    } catch (err) {
      alert("Failed to deactivate user");
    }
  };

  const handleReactivate = async (userId) => {
    if (!window.confirm("Reactivate this user?")) return;

    try {
      await reactivateUser(apiFetch, userId);
      alert("User reactivated!");
      loadUsers();
    } catch (err) {
      alert("Failed to reactivate user");
    }
  };

  return {
    // state
    users,
    loading,
    roles,
    selectedUser,
    selectedRole,
    showRoleModal,

    // actions
    setSelectedRole,
    openRoleModal,
    closeRoleModal,

    handleAssignRole,
    handleGenerateActivationToken,
    handleDeactivate,
    handleReactivate,
  };
};
