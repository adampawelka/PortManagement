import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, CircularProgress, Alert,
  Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Button
} from "@mui/material";
import { useIncidentTypesListVM } from "../../viewmodels/IncidentTypes/useIncidentTypesListVM";

const IncidentTypesListPage = () => {
  const { incidentTypes, loading, error, deleteIncidentType } = useIncidentTypesListVM();
  const navigate = useNavigate();

  const formatParent = (parent) => parent?.name || "-";

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "high":
        return "var(--color-error)";      // red
      case "medium":
        return "var(--color-warning)";    // yellow/orange
      case "low":
        return "var(--color-success)";    // green
      default:
        return "var(--color-text-dark)";
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        backgroundColor: "var(--color-surface)",
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
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
        Incident Types ({incidentTypes.length})
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            color: "var(--color-text-light)",
            backgroundColor: "var(--color-error)",
          }}
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      {!loading && incidentTypes.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{ mb: 2, backgroundColor: "var(--color-info)", color: "var(--color-text-dark)" }}
          aria-live="polite"
        >
          No incident types found.
        </Alert>
      )}

      {incidentTypes.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="incident types table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                <TableCell>ID</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Parent Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {incidentTypes.map((type) => (
                <TableRow key={type.id} sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell>{type.code}</TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: getSeverityColor(type.severity),
                      }}
                    >
                      {type.severity || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatParent(type.parent)}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => navigate(`/incidentTypes/${type.id}/edit`)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => deleteIncidentType(type.id)}>
                      Delete
                    </Button>
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

export default IncidentTypesListPage;
