import React from "react";
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { useApi } from "../../services/api";
import { usePendingUsersManagementVM } from "../../viewmodels/Users/usePendingUsersManagementVM";
import "../../styles/PendingUsersManagement.css";

const PendingUsersManagementPage = () => {
  const { apiFetch } = useApi();

  const {
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
  } = usePendingUsersManagementVM(apiFetch);

  const dialogTexts =
    dialogAction === "APPROVE"
      ? {
          title: "Approve user",
          text: `Approve ${userToProcess?.email}?`,
          confirm: "Approve",
        }
      : dialogAction === "REJECT"
      ? {
          title: "Reject request",
          text: `Reject ${userToProcess?.email}?`,
          confirm: "Reject",
        }
      : null;

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
        Pending Users ({pendingUsers.length})
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 2,
            color:
              message.type === "success"
                ? "var(--color-text-dark)"
                : "var(--color-text-light)",
            backgroundColor:
              message.type === "success"
                ? "var(--color-success-bg)"
                : "var(--color-error-bg)",
          }}
        >
          {message.text}
        </Alert>
      )}

      {loading && (
        <CircularProgress
          sx={{
            display: "block",
            margin: "20px auto",
            color: "var(--color-primary)",
          }}
        />
      )}

      {!loading && pendingUsers.length === 0 && !message && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            backgroundColor: "var(--color-info-bg)",
            color: "var(--color-text-dark)",
          }}
        >
          No pending users found.
        </Alert>
      )}

      {pendingUsers.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "var(--color-background)" }}>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>IamUserId</TableCell>
                <TableCell>Assign Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell className="mono">{user.iamUserId}</TableCell>

                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Role</InputLabel>
                      <Select
                        label="Role"
                        value={roles[user.id]}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        {[
                          "Administrator",
                          "LogisticsOperator",
                          "ShippingAgentRepresentative",
                          "PortAuthorityOfficer",
                          "None",
                        ].map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Approve user">
                        <Button
                          className="btn-approve"
                          size="small"
                          disabled={processing[user.id]}
                          onClick={() => openDialog(user, "APPROVE")}
                        >
                          Approve
                        </Button>
                      </Tooltip>

                      <Tooltip title="Reject request">
                        <Button
                          className="btn-reject"
                          size="small"
                          disabled={processing[user.id]}
                          onClick={() => openDialog(user, "REJECT")}
                        >
                          Reject
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DIALOG */}
      {dialogTexts && (
        <Dialog open={dialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTexts.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogTexts.text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button
              className={
                dialogAction === "APPROVE" ? "btn-approve" : "btn-reject"
              }
              onClick={() =>
                dialogAction === "APPROVE"
                  ? approveUser()
                  : rejectUser(userToProcess)
              }
            >
              {dialogTexts.confirm}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default PendingUsersManagementPage;
