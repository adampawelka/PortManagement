import React, { useState } from "react";
import {
  Container, Typography, CircularProgress, Alert,
  Paper, IconButton, FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useIncidentTypesListVM } from "../../viewmodels/IncidentTypes/useIncidentTypesListVM";

const IncidentTypesListPage = () => {
  const {
    incidentTypes,
    loading,
    error,
    filterParentId,
    setFilterParentId,
    allParents
  } = useIncidentTypesListVM();

  const [expandedParents, setExpandedParents] = useState({});

  const toggleParent = (parentId) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "minor": return "var(--color-success)";
      case "major": return "var(--color-warning)";
      case "critical": return "var(--color-error)";
      default: return "var(--color-text-dark)";
    }
  };

  const groupedData = incidentTypes.reduce((acc, type) => {
    if (!type.parentId) {
      acc[type.id] = { parent: type, children: [] };
    } else {
      if (!acc[type.parentId]) acc[type.parentId] = { parent: null, children: [] };
      acc[type.parentId].children.push(type);
    }
    return acc;
  }, {});

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundColor: "var(--color-surface)",
        p: 3,
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

      {/* Filter by Parent */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Parent</InputLabel>
        <Select
          value={filterParentId || ""}
          label="Filter by Parent"
          onChange={(e) => setFilterParentId(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {allParents.map((p) => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2, color: "var(--color-text-light)", backgroundColor: "var(--color-error)" }}>
          {error}
        </Alert>
      )}
      {!loading && incidentTypes.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2, backgroundColor: "var(--color-info)", color: "var(--color-text-dark)" }}>
          No incident types found.
        </Alert>
      )}

      {/* List view */}
      {Object.values(groupedData).map(({ parent, children }) => {
        if (!parent) return null;
        const isExpanded = expandedParents[parent.id] || false;

        return (
          <Box key={parent.id} sx={{ mb: 1 }}>
            {/* Parent row */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                cursor: children.length ? "pointer" : "default",
                backgroundColor: "var(--color-surface-alt)",
                borderRadius: "var(--radius-sm)",
                mb: 0.5
              }}
            >
              {children.length > 0 && (
                <IconButton size="small" onClick={() => toggleParent(parent.id)}>
                  {isExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              <Box sx={{ ml: children.length ? 1 : 0, flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left: Basic info */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{parent.name}</Typography>
                  <Typography variant="body2">ID: {parent.id} | Code: {parent.code}</Typography>
                  {parent.parentName && <Typography variant="body2">Parent: {parent.parentName}</Typography>}
                </Box>
                {/* Right: Description */}
                <Box sx={{ ml: 2, maxWidth: '50%' }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Description:</Typography>
                  <Typography variant="body2">{parent.description}</Typography>
                </Box>
                {/* Severity */}
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: getSeverityColor(parent.severity), ml: 2 }}
                >
                  {parent.severity || "N/A"}
                </Typography>
              </Box>
            </Paper>

            {/* Children */}
            {isExpanded && children.map((child) => (
              <Paper
                key={child.id}
                elevation={0}
                sx={{
                  ml: 4,
                  mb: 0.5,
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "3px solid var(--color-primary-light)"
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{child.name}</Typography>
                    <Typography variant="body2">ID: {child.id} | Code: {child.code}</Typography>
                    {child.parentName && <Typography variant="body2">Parent: {child.parentName}</Typography>}
                  </Box>
                  <Box sx={{ ml: 2, maxWidth: '50%' }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Description:</Typography>
                    <Typography variant="body2">{child.description}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: getSeverityColor(child.severity), ml: 2 }}
                  >
                    {child.severity || "N/A"}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        );
      })}
    </Container>
  );
};

export default IncidentTypesListPage;
