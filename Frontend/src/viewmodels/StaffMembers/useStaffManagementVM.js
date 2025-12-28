import { useState, useCallback } from "react";
import * as StaffService from "../../services/staffMemberService";

import { useApi } from "../../services/api";

export const useStaffManagementVM = () => {
  const [staff, setStaff] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { apiFetch } = useApi();

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await StaffService.getStaffMembers(apiFetch);
      setStaff(data || []); 
    } catch (err) {
      setError(err.message || "Failed to fetch staff members");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  const handleDeactivate = useCallback(
    async (staffId) => {
      setLoading(true);
      setError("");
      try {
        await StaffService.deactivateStaffMember(apiFetch, staffId);
        setStaff((prev) =>
          prev.map((s) =>
            s.id === staffId ? { ...s, status: "Deactivated" } : s
          )
        );
      } catch (err) {
        setError(err.message || "Failed to deactivate staff member");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  const handleReactivate = useCallback(
    async (staffId) => {
      setLoading(true);
      setError("");
      try {
        await StaffService.activateStaffMember(apiFetch, staffId);
        setStaff((prev) =>
          prev.map((s) =>
            s.id === staffId ? { ...s, status: "Active" } : s
          )
        );
      } catch (err) {
        setError(err.message || "Failed to reactivate staff member");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  return {
    staff,
    loading,
    error,
    fetchStaff,
    handleDeactivate,
    handleReactivate,
  };
};
