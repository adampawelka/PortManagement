import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon,
  Schedule as DelayIcon,
  Cancel as CancelIcon,
  Refresh as SyncIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateVVEProgressVM } from '../../viewmodels/VesselVisitExecutions/useUpdateVVEProgressVM';

const UpdateVVEProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    vve,
    executedOperations,
    plannedOperations,
    loading,
    error,
    success,
    fetchVVEAndOperations,
    createExecutedOperation,
    updateExecutedOperation,
    markAllAsCompleted,
    syncWithPlannedOperations
  } = useUpdateVVEProgressVM(id);
  
  const [newOperation, setNewOperation] = useState({
    plannedOperationId: '',
    resourceId: '',
    staffId: '',
    actualStart: new Date(),
    actualEnd: null,
    status: 'started'
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);
  const [quickAction, setQuickAction] = useState(null);

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'default', icon: null },
    { value: 'started', label: 'Started', color: 'primary', icon: <StartIcon /> },
    { value: 'completed', label: 'Completed', color: 'success', icon: <CompleteIcon /> },
    { value: 'delayed', label: 'Delayed', color: 'warning', icon: <DelayIcon /> },
    { value: 'cancelled', label: 'Cancelled', color: 'error', icon: <CancelIcon /> }
  ];

  useEffect(() => {
    fetchVVEAndOperations();
  }, [id, fetchVVEAndOperations]);

  const handleCreateOperation = async () => {
    try {
      await createExecutedOperation(newOperation);
      setNewOperation({
        plannedOperationId: '',
        resourceId: '',
        staffId: '',
        actualStart: new Date(),
        actualEnd: null,
        status: 'STARTED'
      });
    } catch (err) {
      // Error is already handled in the VM
    }
  };

  const handleUpdateOperation = async (opId, updates) => {
    try {
      await updateExecutedOperation(opId, updates);
      setOpenDialog(false);
      setSelectedOp(null);
    } catch (err) {
      // Error is already handled in the VM
    }
  };

  const handleQuickAction = async (opId, action) => {
    setQuickAction({ opId, action });
    
    const updates = {};
    switch (action) {
      case 'start':
        updates.status = 'STARTED';
        updates.actualStart = new Date().toISOString();
        break;
      case 'complete':
        updates.status = 'COMPLETED';
        updates.actualEnd = new Date().toISOString();
        break;
      case 'delay':
        updates.status = 'DELAYED';
        break;
      default:
        return;
    }
    
    try {
      await updateExecutedOperation(opId, updates);
      setQuickAction(null);
    } catch (err) {
      setQuickAction(null);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'default';
  };

  const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : null;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!vve) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Vessel Visit Execution not found</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  if (vve.status !== 'in_progress') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          This Vessel Visit Execution is not in progress. Only in-progress VVEs can be updated.
        </Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Update VVE Progress - {vve.vvnId}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Sync with planned operations">
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                onClick={syncWithPlannedOperations}
                disabled={plannedOperations.length === 0}
              >
                Sync Planned Ops
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              color="success"
              onClick={markAllAsCompleted}
              disabled={executedOperations.length === 0}
            >
              Mark All as Completed
            </Button>
          </Box>
        </Box>

        {/* VVE Summary Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Vessel</Typography>
                <Typography variant="body1">{vve.vvnId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Arrival Time</Typography>
                <Typography variant="body1">
                  {new Date(vve.actualArrivalTime).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Dock</Typography>
                <Typography variant="body1">{vve.dockId || 'Not assigned'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip 
                  label={vve.status} 
                  color="primary"
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Executed Operations Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Executed Operations ({executedOperations.length})
          </Typography>
          
          {executedOperations.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Planned Operation</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell>Staff</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {executedOperations.map((op) => (
                    <TableRow key={op.id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {op.plannedOperationId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>{op.resourceId}</TableCell>
                      <TableCell>{op.staffId}</TableCell>
                      <TableCell>
                        {op.actualStart ? new Date(op.actualStart).toLocaleTimeString() : 'Not started'}
                      </TableCell>
                      <TableCell>
                        {op.actualEnd ? new Date(op.actualEnd).toLocaleTimeString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(op.status)}
                          label={op.status}
                          color={getStatusColor(op.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {op.status !== 'STARTED' && op.status !== 'COMPLETED' && (
                            <Tooltip title="Start Operation">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleQuickAction(op.id, 'start')}
                                disabled={quickAction?.opId === op.id}
                              >
                                <StartIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {op.status === 'STARTED' && (
                            <Tooltip title="Mark as Completed">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleQuickAction(op.id, 'complete')}
                                disabled={quickAction?.opId === op.id}
                              >
                                <CompleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {op.status !== 'DELAYED' && (
                            <Tooltip title="Mark as Delayed">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleQuickAction(op.id, 'delay')}
                                disabled={quickAction?.opId === op.id}
                              >
                                <DelayIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Edit Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedOp(op);
                                setOpenDialog(true);
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No executed operations recorded yet. Create one below or sync with planned operations.
            </Alert>
          )}
        </Paper>

        {/* Add New Operation Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Record New Executed Operation
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Planned Operation"
                value={newOperation.plannedOperationId}
                onChange={(e) => setNewOperation({...newOperation, plannedOperationId: e.target.value})}
                size="small"
              >
                <MenuItem value="">Select Planned Operation</MenuItem>
                {plannedOperations.map((op) => (
                  <MenuItem key={op.id} value={op.id}>
                    {op.operationType} - {op.resourceId} ({op.status})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Resource ID"
                value={newOperation.resourceId}
                onChange={(e) => setNewOperation({...newOperation, resourceId: e.target.value})}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Staff ID"
                value={newOperation.staffId}
                onChange={(e) => setNewOperation({...newOperation, staffId: e.target.value})}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <DateTimePicker
                label="Start Time"
                value={newOperation.actualStart}
                onChange={(newValue) => setNewOperation({...newOperation, actualStart: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Status"
                value={newOperation.status}
                onChange={(e) => setNewOperation({...newOperation, status: e.target.value})}
                size="small"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateOperation}
                disabled={!newOperation.plannedOperationId}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Planned Operations Reference */}
        {plannedOperations.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Planned Operations Reference ({plannedOperations.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell>Staff</TableCell>
                    <TableCell>Planned Start</TableCell>
                    <TableCell>Planned End</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plannedOperations.slice(0, 5).map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>
                        <Typography variant="caption">
                          {op.id.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>{op.operationType}</TableCell>
                      <TableCell>{op.resourceId}</TableCell>
                      <TableCell>{op.staffId}</TableCell>
                      <TableCell>
                        {new Date(op.plannedStart).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {new Date(op.plannedEnd).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Chip label={op.status} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {plannedOperations.length > 5 && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Showing 5 of {plannedOperations.length} planned operations
              </Typography>
            )}
          </Paper>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedOp && (
          <>
            <DialogTitle>Edit Executed Operation</DialogTitle>
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
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Actual Start Time"
                    value={selectedOp.actualStart ? new Date(selectedOp.actualStart) : null}
                    onChange={(newValue) => setSelectedOp({
                      ...selectedOp,
                      actualStart: newValue ? newValue.toISOString() : null
                    })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DateTimePicker
                    label="Actual End Time"
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
                  actualStart: selectedOp.actualStart,
                  actualEnd: selectedOp.actualEnd
                })}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </LocalizationProvider>
  );
};

export default UpdateVVEProgressPage;