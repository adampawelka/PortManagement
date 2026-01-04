import React from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  // ✅ NUEVAS IMPORTACIONES AÑADIDAS:
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import { useUsersManagementVM } from "../../viewmodels/Users/useUsersManagementVM";
import "../../styles/UserManagement.css";

const UsersManagementPage = () => {
  const {
    users,
    roles,
    selectedUser,
    selectedRole,
    showRoleModal,
    loading,
    error,
    setSelectedRole,
    setSelectedUser,
    setShowRoleModal,
    handleAssignRole,
    handleGenerateActivationToken,
    handleDeactivate,
    handleReactivate,
  } = useUsersManagementVM();

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        backgroundColor: "var(--color-surface)",
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--font-family-base)",
        color: "var(--color-text-dark)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
          fontSize: "var(--font-size-heading)",
        }}
      >
        User Management ({users.length})
      </Typography>

      {/* ... (Todo el bloque de carga y alertas sigue igual) ... */}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto", color: "var(--color-primary)" }} />
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && users.length === 0 && !error && <Alert severity="info" sx={{ mb: 2 }}>No users found.</Alert>}

      {users.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "var(--shadow-sm)" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                <TableCell className="um-th">Name</TableCell>
                <TableCell className="um-th">Email</TableCell>
                <TableCell className="um-th">Role</TableCell>
                <TableCell className="um-th">Status</TableCell>
                <TableCell className="um-th" align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`um-chip ${user.role === "Administrator" ? "chip-admin" : "chip-default"}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`um-chip ${user.status === "Active" ? "chip-active" : "chip-inactive"}`}>
                      {user.status}
                    </span>
                  </TableCell>

                  <TableCell align="right">
                    <div className="um-action-buttons">
                      {/* ✅ ESTO YA ESTÁ PERFECTO */}
                      <Button
                        variant="contained"
                        className="um-btn primary"
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.role);
                          setShowRoleModal(true);
                        }}
                      >
                        Change Role
                      </Button>

                      {user.status === "Deactivated" && (
                        <>
                          <Button variant="contained" className="um-btn success" onClick={() => handleGenerateActivationToken(user.id)}>
                            Activate
                          </Button>
                          <Button variant="contained" className="um-btn success" onClick={() => handleReactivate(user.id)}>
                            Reactivate
                          </Button>
                        </>
                      )}

                      {user.status === "Active" && (
                        <Button variant="contained" className="um-btn danger" onClick={() => handleDeactivate(user.id)}>
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showRoleModal && (
        <div className="um-modal-overlay">
          <div className="um-modal" style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
            <h2>Assign Role</h2>

            <p>User: <strong>{selectedUser?.name}</strong></p>
            <p>Email: <strong>{selectedUser?.email}</strong></p>

            <div className="um-modal-input" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <FormControl fullWidth>
                  <InputLabel id="role-select-label">Select Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={selectedRole || ""} // Asegura que no sea null
                    label="Select Role"
                    onChange={(e) => setSelectedRole(e.target.value)}
                    sx={{ backgroundColor: "white" }}
                  >
                    {/* ✅ CORRECCIÓN AQUÍ: Usamos el map correctamente */}
                    {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </div>

            <div className="um-modal-buttons">
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedRole}
                onClick={handleAssignRole}
                fullWidth
                sx={{ mb: 1 }}
              >
                Assign Role
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UsersManagementPage;