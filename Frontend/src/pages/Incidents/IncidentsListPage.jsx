import React from "react";
import { useNavigate } from "react-router-dom";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Chip,
  Grid,
} from "@mui/material";
import { Edit, Warning } from "@mui/icons-material";
import { useIncidentListVM } from "../../viewmodels/Incidents/useIncidentListVM";

const IncidentsListPage = () => {
  const navigate = useNavigate();
  const {
    incidents,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    isActive,
    getDuration,
  } = useIncidentListVM();

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "minor": return "success";
      case "major": return "warning";
      case "critical": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (incident) => {
    const duration = getDuration(incident);
    if (!duration) return "Ongoing";
    return `${duration.hours}h ${duration.minutes}m`;
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
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Incidents ({incidents.length})
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Vessel Name"
              value={filters.vesselName}
              onChange={(e) => updateFilter("vesselName", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Start Date"
              type="date"
              value={filters.dateStart}
              onChange={(e) => updateFilter("dateStart", e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="End Date"
              type="date"
              value={filters.dateEnd}
              onChange={(e) => updateFilter("dateEnd", e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Severity</InputLabel>
              <Select
                value={filters.severity}
                label="Severity"
                onChange={(e) => updateFilter("severity", e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Minor">Minor</MenuItem>
                <MenuItem value="Major">Major</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => updateFilter("status", e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
              size="small"
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && incidents.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No incidents found.
        </Alert>
      )}

      {/* Table */}
      {!loading && incidents.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => {
                const active = isActive(incident);
                return (
                  <TableRow
                    key={incident.id}
                    sx={{
                      backgroundColor: active
                        ? "rgba(255, 152, 0, 0.1)"
                        : "transparent",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell>{incident.id.slice(0, 8)}...</TableCell>
                    <TableCell>{incident.incidentTypeId}</TableCell>
                    <TableCell>{formatDate(incident.startTime)}</TableCell>
                    <TableCell>
                      {incident.endTime ? formatDate(incident.endTime) : "-"}
                    </TableCell>
                    <TableCell>{formatDuration(incident)}</TableCell>
                    <TableCell>
                      <Chip
                        label={incident.severity}
                        color={getSeverityColor(incident.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {active ? (
                        <Chip
                          icon={<Warning />}
                          label="Active"
                          color="warning"
                          size="small"
                        />
                      ) : (
                        <Chip label="Resolved" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {incident.description.length > 50
                        ? `${incident.description.substring(0, 50)}...`
                        : incident.description}
                    </TableCell>
                    <TableCell>{incident.createdBy}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/incidents/update/${incident.id}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default IncidentsListPage;

