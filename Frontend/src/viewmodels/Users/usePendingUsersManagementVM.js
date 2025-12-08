import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../services/api";

import {
  getAllPendingUsers,
  deletePendingUser,
  createPendingUser,
} from "../../services/pendingUserService";

const AVAILABLE_ROLES = [
  "Administrator",
  "LogisticsOperator",
  "ShippingAgentRepresentative",
  "PortAuthorityOfficer",
  "None",
];

export function usePendingUsersManagementVM() {
  const { apiFetch } = useApi();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToProcess, setUserToProcess] = useState(null);
  const [dialogAction, setDialogAction] = useState("");

  /** LOAD USERS */
  const loadPendingUsers = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const users = await getAllPendingUsers(apiFetch);

      setPendingUsers(users);

      setRoles(
        users.reduce((acc, u) => {
          acc[u.id] = u.role || AVAILABLE_ROLES[0];
          return acc;
        }, {})
      );
    } catch (e) {
      setMessage({ type: "error", text: e.message || "Error loading users" });
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    loadPendingUsers();
  }, [loadPendingUsers]);

  /** CHANGE ROLE */
  const handleRoleChange = (userId, newRole) => {
    setRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  /** CONFIRM DIALOG */
  const openDialog = (user, action) => {
    setUserToProcess(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setUserToProcess(null);
    setDialogAction("");
    setDialogOpen(false);
  };

  /** REJECT USER */
  const rejectUser = async (user) => {
    setProcessing((prev) => ({ ...prev, [user.id]: true }));

    try {
      await deletePendingUser(user.id, apiFetch);

      setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));

      setMessage({ type: "success", text: `${user.email} rejected.` });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setProcessing((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  /** APPROVE USER */
  const approveUser = async () => {
    if (!userToProcess) return;

    closeDialog();

    const user = userToProcess;
    const role = roles[user.id];

    setProcessing((prev) => ({ ...prev, [user.id]: true }));

    try {
      await createPendingUser(user, role, apiFetch);
      await deletePendingUser(user.id, apiFetch);

      setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));

      setMessage({
        type: "success",
        text: `${user.email} approved with role ${role}.`,
      });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setProcessing((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  return {
    pendingUsers,
    roles,
    loading,
    message,
    processing,
    dialogOpen,
    userToProcess,
    dialogAction,
    handleRoleChange,
    openDialog,
    closeDialog,
    rejectUser,
    approveUser,
  };
}
