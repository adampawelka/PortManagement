import React from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip
} from "@mui/material";
import { useSearchVVE } from "../../viewmodels/VesselVisitExecutions/useSearchVVE";

const SearchVVEPage = () => {
  const {
    vves,
    loading,
    error,
    filters,
    handleFilterChange,
    handleClearFilters,
    handleSearchSubmit,
    formatDuration
  } = useSearchVVE();

  // Helper para colores de estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
        backgroundColor: "var(--color-surface)",
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
        Vessel Visit Execution History
      </Typography>

      {/* --- FILTER SECTION --- */}
      <Paper
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "var(--color-background)",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <TextField
          label="Vessel Name"
          name="vesselName"
          value={filters.vesselName}
          onChange={handleFilterChange}
          size="small"
          sx={{ backgroundColor: "var(--color-surface)", minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 150, backgroundColor: "var(--color-surface)" }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={filters.status}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="From Date"
          type="date"
          name="dateStart"
          value={filters.dateStart}
          onChange={handleFilterChange}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: "var(--color-surface)" }}
        />

        <TextField
          label="To Date"
          type="date"
          name="dateEnd"
          value={filters.dateEnd}
          onChange={handleFilterChange}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: "var(--color-surface)" }}
        />

        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            sx={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
          >
            Clear
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* --- ERROR MESSAGE --- */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* --- DATA TABLE --- */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {vves.length === 0 ? (
            <Alert severity="info">No execution records found matching your criteria.</Alert>
          ) : (
            <Paper sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "var(--color-background-light)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Vessel Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Arrival</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Berth</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Departure</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    
                    {/* COLUMNAS DE MÉTRICAS (US 4.1.10) */}
                    <TableCell sx={{ fontWeight: "bold", color: "var(--color-primary)" }}>Wait Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "var(--color-primary)" }}>Berth Occ.</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "var(--color-primary)" }}>Turnaround</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vves.map((vve) => (
                    <TableRow key={vve.id} hover>
                      <TableCell>{vve.vesselName || `VVN: ${vve.vvnId}`}</TableCell>
                      <TableCell>{new Date(vve.arrival).toLocaleString()}</TableCell>
                      <TableCell>{vve.berth ? new Date(vve.berth).toLocaleString() : "-"}</TableCell>
                      <TableCell>{vve.departure ? new Date(vve.departure).toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <Chip 
                          label={vve.status} 
                          size="small" 
                          color={getStatusColor(vve.status)} 
                          variant="outlined"
                        />
                      </TableCell>
                      
                      {/* CÁLCULOS DEL BACKEND VISUALIZADOS */}
                      <TableCell sx={{ fontWeight: 500 }}>
                        {formatDuration(vve.waitingTimeMinutes)}
                      </TableCell>
                      <TableCell>
                        {formatDuration(vve.berthOccupancyMinutes)}
                      </TableCell>
                      <TableCell>
                        {formatDuration(vve.totalTurnaroundMinutes)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchVVEPage;