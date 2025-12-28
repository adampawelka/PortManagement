import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Alert, CircularProgress, Box, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Grid
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

const UpdateVVEProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vve, setVve] = useState(null);
  const [executedOperations, setExecutedOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newOperation, setNewOperation] = useState({
    plannedOperationId: '',
    resourceId: '',
    staffId: '',
    actualStart: new Date(),
    actualEnd: null,
    status: 'STARTED'
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch VVE details using existing endpoint
      const vveResponse = await api.get(`/vesselVisitExecutions/${id}`);
      setVve(vveResponse.data);

      // Fetch executed operations for this VVE using existing endpoint
      const opsResponse = await api.get(`/executedOperations/vve/${id}`);
      setExecutedOperations(opsResponse.data);

    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOperation = async () => {
    try {
      // Use existing POST endpoint
      await api.post('/executedOperations', {
        ...newOperation,
        vesselVisitExecutionId: id,
        actualStart: newOperation.actualStart.toISOString(),
        actualEnd: newOperation.actualEnd ? newOperation.actualEnd.toISOString() : undefined
      });

      setSuccess('Executed operation created successfully');
      setNewOperation({
        plannedOperationId: '',
        resourceId: '',
        staffId: '',
        actualStart: new Date(),
        actualEnd: null,
        status: 'STARTED'
      });

      fetchData(); // Refresh
    } catch (err) {
      setError('Failed to create operation');
    }
  };

  const handleUpdateOperation = async (opId, updates) => {
    try {
      // Use existing PUT endpoint
      await api.put(`/executedOperations/${opId}`, updates);
      setSuccess('Operation updated successfully');
      setOpenDialog(false);
      setSelectedOp(null);
      fetchData(); // Refresh
    } catch (err) {
      setError('Failed to update operation');
    }
  };

  const handleMarkAllCompleted = async () => {
    try {
      // Batch update using existing endpoints
      const updatePromises = executedOperations.map(op =>
        api.put(`/executedOperations/${op.id}`, {
          status: 'COMPLETED',
          actualEnd: new Date().toISOString()
        })
      );

      await Promise.all(updatePromises);
      setSuccess('All operations marked as completed');
      fetchData(); // Refresh
    } catch (err) {
      setError('Failed to mark all as completed');
    }
  };

  if (loading) return <CircularProgress />;
  if (!vve) return <Alert severity="error">VVE not found</Alert>;
  if (vve.status !== 'IN_PROGRESS') {
    return (
      <Alert severity="warning">
        VVE is not in progress. Current status: {vve.status}
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Update VVE Progress: {vve.vvnId}</Typography>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Executed Operations Table */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Executed Operations</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={handleMarkAllCompleted}
              disabled={executedOperations.length === 0}
            >
              Mark All Completed
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Planned Op ID</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {executedOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>{op.plannedOperationId.substring(0, 8)}...</TableCell>
                    <TableCell>{op.resourceId}</TableCell>
                    <TableCell>
                      {new Date(op.actualStart).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {op.actualEnd ? new Date(op.actualEnd).toLocaleTimeString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip label={op.status} color={
                        op.status === 'COMPLETED' ? 'success' :
                        op.status === 'STARTED' ? 'primary' : 'default'
                      } />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedOp(op);
                          setOpenDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add New Operation Form */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Add New Executed Operation</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Planned Operation ID"
                value={newOperation.plannedOperationId}
                onChange={(e) => setNewOperation({...newOperation, plannedOperationId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Resource ID"
                value={newOperation.resourceId}
                onChange={(e) => setNewOperation({...newOperation, resourceId: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Status"
                value={newOperation.status}
                onChange={(e) => setNewOperation({...newOperation, status: e.target.value})}
              >
                <MenuItem value="STARTED">Started</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="DELAYED">Delayed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Start Time"
                value={newOperation.actualStart}
                onChange={(newValue) => setNewOperation({...newOperation, actualStart: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateOperation}
                sx={{ height: '56px' }}
                disabled={!newOperation.plannedOperationId || !newOperation.resourceId}
              >
                Add Operation
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          {selectedOp && (
            <>
              <DialogTitle>Edit Operation</DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={selectedOp.status}
                      onChange={(e) => setSelectedOp({...selectedOp, status: e.target.value})}
                    >
                      <MenuItem value="STARTED">Started</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="DELAYED">Delayed</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="End Time"
                      value={selectedOp.actualEnd ? new Date(selectedOp.actualEnd) : null}
                      onChange={(newValue) => setSelectedOp({
                        ...selectedOp,
                        actualEnd: newValue ? newValue.toISOString() : null
                      })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateOperation(selectedOp.id, {
                    status: selectedOp.status,
                    actualEnd: selectedOp.actualEnd
                  })}
                >
                  Save
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default UpdateVVEProgressPage;