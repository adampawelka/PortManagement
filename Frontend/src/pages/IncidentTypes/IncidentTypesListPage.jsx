import React, { useState } from "react";
import {
  Container, Typography, CircularProgress, Alert,
  Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, FormControl, InputLabel, Select, MenuItem
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
    setExpandedParents(prev => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "minor": return "var(--color-success)";
      case "major": return "var(--color-warning)";
      case "critical": return "var(--color-error)";
      default: return "var(--color-text-dark)";
    }
  };

  const formatParent = (parentName) => parentName || "-";

  // Grupa: rodzice i ich dzieci
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

      {/* Filter by Parent */}
      <FormControl sx={{ mb: 3, minWidth: 250 }}>
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

      {/* Loading */}
      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}

      {/* Error */}
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

      {/* No data */}
      {!loading && incidentTypes.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            backgroundColor: "var(--color-info)",
            color: "var(--color-text-dark)"
          }}
          aria-live="polite"
        >
          No incident types found.
        </Alert>
      )}

      {/* Table */}
      {incidentTypes.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="incident types table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Parent Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(groupedData).map(({ parent, children }) => {
                if (!parent) return null;
                const isExpanded = expandedParents[parent.id] || false;

                return (
                  <React.Fragment key={parent.id}>
                    {/* Parent row */}
                    <TableRow sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                      <TableCell>
                        {children.length > 0 && (
                          <IconButton size="small" onClick={() => toggleParent(parent.id)}>
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>{parent.id}</TableCell>
                      <TableCell>{parent.code}</TableCell>
                      <TableCell>{parent.name}</TableCell>
                      <TableCell>{parent.description}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: getSeverityColor(parent.severity) }}
                        >
                          {parent.severity || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatParent(parent.parentName)}</TableCell>
                    </TableRow>

                    {/* Child rows */}
                    {isExpanded && children.map((child) => (
                      <TableRow
                        key={child.id}
                        sx={{
                          "&:hover": { backgroundColor: "var(--color-background)" },
                          backgroundColor: "var(--color-surface-alt)"
                        }}
                      >
                        <TableCell />
                        <TableCell>{child.id}</TableCell>
                        <TableCell>{child.code}</TableCell>
                        <TableCell sx={{ pl: 4 }}>{child.name}</TableCell>
                        <TableCell>{child.description}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: getSeverityColor(child.severity) }}
                          >
                            {child.severity || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatParent(child.parentName)}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default IncidentTypesListPage;
