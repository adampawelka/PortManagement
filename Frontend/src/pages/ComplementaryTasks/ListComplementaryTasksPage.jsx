import React from "react";
import {
  Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TextField, FormControl, InputLabel, Select, MenuItem, Button, Chip, Box, 
  CircularProgress, Alert, Tooltip
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useListComplementaryTasksVM } from "../../viewmodels/ComplementaryTasks/useListComplementaryTasksVM";

const ListComplementaryTasksPage = () => {
  const { 
    tasks, loading, error, filters, hasSearched,
    handleFilterChange, handleClearFilters, handleSearchSubmit, isCriticalTask 
  } = useListComplementaryTasksVM();

  const navigate = useNavigate();

  const openEditor = (taskId) => {
    navigate(`/complementary-tasks/update/${taskId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ mb: 3, fontWeight: 600, color: 'var(--color-primary-light)' }}
      >
        Complementary Tasks Log
      </Typography>

      {/* --- PANEL DE FILTROS --- */}
      <Paper 
        component="form" 
        onSubmit={handleSearchSubmit}
        sx={{ 
          p: 2, mb: 3, 
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' 
        }}
      >
        {/* Filtro Texto: Nombre Barco */}
        <TextField 
          label="Vessel Name" 
          name="vesselName" 
          value={filters.vesselName} 
          onChange={handleFilterChange} 
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        {/* Filtro Select: Estado */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select 
            name="status" 
            value={filters.status} 
            label="Status" 
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ONGOING">Ongoing</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="PLANNED">Planned</MenuItem>
          </Select>
        </FormControl>

        {/* Filtros Fecha */}
        <TextField
          label="From"
          type="date"
          name="dateStart"
          value={filters.dateStart}
          onChange={handleFilterChange}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          name="dateEnd"
          value={filters.dateEnd}
          onChange={handleFilterChange}
          size="small"
          InputLabelProps={{ shrink: true }}
        />

        {/* Botones */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={handleClearFilters}
            sx={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dark)' }}
          >
            Clear
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              bgcolor: 'var(--color-primary)', 
              '&:hover': { bgcolor: 'var(--color-primary-dark)' } 
            }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {/* --- MENSAJES DE ERROR / ESTADO --- */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* --- TABLA DE RESULTADOS --- */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ overflowX: 'auto', boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'var(--color-background-light)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Vessel</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Responsible</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Impact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    {hasSearched ? "No tasks found matching criteria." : "Use filters to find tasks."}
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const critical = isCriticalTask(task);
                  return (
                    <TableRow 
                      key={task.id}
                      onClick={() => openEditor(task.id)}
                      hover
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openEditor(task.id); }}
                      sx={{ 
                        // HIGHLIGHT VISUAL SI ES CRÍTICA (US 4.1.15)
                        backgroundColor: critical ? '#fff3e0' : 'inherit', // Fondo naranja suave
                        '&:hover': { backgroundColor: critical ? '#ffe0b2' : 'var(--color-background)' },
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>{task.vesselName}</TableCell>
                      <TableCell>{task.categoryName}</TableCell>
                      <TableCell>{task.responsible}</TableCell>
                      <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status} 
                          color={task.status === "ONGOING" ? "primary" : "default"} 
                          size="small" 
                          variant={task.status === "ONGOING" ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        {task.suspendsOperation ? (
                          <Tooltip title="Stops Cargo Operations">
                            <Chip 
                              icon={critical ? <WarningAmberIcon /> : <EventBusyIcon />} 
                              label="Suspends Ops" 
                              color="error" 
                              size="small" 
                              // Si es crítica (Ongoing + Suspende), se ve más fuerte
                              variant={critical ? "filled" : "outlined"}
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Tooltip>
                        ) : (
                          <Chip label="Parallel" size="small" variant="outlined" sx={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default ListComplementaryTasksPage;