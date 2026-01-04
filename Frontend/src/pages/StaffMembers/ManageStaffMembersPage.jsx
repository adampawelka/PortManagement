import React, { useEffect } from "react";
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
} from "@mui/material";
import { useStaffManagementVM } from "../../viewmodels/StaffMembers/useStaffManagementVM";
import "../../styles/UserManagement.css";

const StaffManagementPage = () => {
  const {
    staff,
    loading,
    error,
    handleDeactivate,
    handleReactivate,
    fetchStaff,
  } = useStaffManagementVM();

  useEffect(() => {
    fetchStaff();
  }, []);

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
        Staff Management ({staff.length})
      </Typography>

      {loading && (
        <CircularProgress
          sx={{ display: "block", margin: "20px auto", color: "var(--color-primary)" }}
        />
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, color: "var(--color-text-light)", backgroundColor: "var(--color-error)" }}
        >
          {error}
        </Alert>
      )}

      {!loading && staff.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{ mb: 2, backgroundColor: "var(--color-info)", color: "var(--color-text-dark)" }}
        >
          No staff members found.
        </Alert>
      )}

      {staff.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: "var(--shadow-sm)" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                <TableCell className="um-th">Mecanographic Number</TableCell>
                <TableCell className="um-th">Short Name</TableCell>
                <TableCell className="um-th">Email</TableCell>
                <TableCell className="um-th">Phone number</TableCell>
                <TableCell className="um-th">Operational Window</TableCell>
                <TableCell className="um-th">Qualifications</TableCell>
                <TableCell className="um-th">Status</TableCell>
                <TableCell className="um-th" align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {staff.map((member) => (
                <TableRow
                  key={member.id}
                  sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}
                >
                  <TableCell>{member.mecanographicNumber}</TableCell>
                  <TableCell>{member.shortName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.operationalWindow}</TableCell>
                  <TableCell>
                    {Array.isArray(member.qualifications) && member.qualifications.length > 0
                      ? member.qualifications.map(q => q.name).join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`um-chip ${member.status === "Active" ? "chip-active" : "chip-inactive"
                        }`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    {member.status === "Active" && (
                      <Button
                        variant="contained"
                        className="um-btn danger"
                        onClick={() => handleDeactivate(member.id)}
                      >
                        Deactivate
                      </Button>
                    )}
                    {member.status === "Inactive" && (
                      <Button
                        variant="contained"
                        className="um-btn success"
                        onClick={() => handleReactivate(member.id)}
                      >
                        Reactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StaffManagementPage;
