import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip,
  Alert, CircularProgress, Box, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Grid
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateVVEProgressVM } from '../../viewmodels/VesselVisitExecutions/useUpdateVVEProgressVM';

const UpdateVVEProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useUpdateVVEProgressVM(id);

  const [newOperation, setNewOperation] = useState({
    plannedOperationId: '', resourceId: '', staffId: '',
    actualStart: new Date(), actualEnd: null, status: 'STARTED'
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  useEffect(() => { vm.fetchVVEAndOperations(); }, [id]);

  if (vm.loading) return <CircularProgress />;
  if (vm.error) return <Alert severity="error">{vm.error}</Alert>;
  if (!vm.vve) return <Alert severity="error">VVE not found</Alert>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Update VVE Progress: {vm.vve.vvnId}</Typography>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Box>

        {vm.success && <Alert severity="success">{vm.success}</Alert>}
        {vm.error && <Alert severity="error">{vm.error}</Alert>}

        {/* Executed Operations Table */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Executed Operations</Typography>
            <Button variant="contained" color="success"
              onClick={vm.markAllAsCompleted}
              disabled={vm.executedOperations.length === 0}>
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
                {vm.executedOperations.map(op => (
                  <TableRow key={op.id}>
                    <TableCell>{op.plannedOperationId.substring(0, 8)}...</TableCell>
                    <TableCell>{op.resourceId}</TableCell>
                    <TableCell>{new Date(op.actualStart).toLocaleTimeString()}</TableCell>
                    <TableCell>{op.actualEnd ? new Date(op.actualEnd).toLocaleTimeString() : '-'}</TableCell>
                    <TableCell>
                      <Chip label={op.status} color={
                        op.status === 'COMPLETED' ? 'success' :
                        op.status === 'STARTED' ? 'primary' : 'default'
                      } />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => { setSelectedOp(op); setOpenDialog(true); }}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add New Operation Form */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Add New Executed Operation</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField label="Planned Operation ID" fullWidth
                value={newOperation.plannedOperationId}
                onChange={e => setNewOperation({...newOperation, plannedOperationId: e.target.value})}/>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Resource ID" fullWidth
                value={newOperation.resourceId}
                onChange={e => setNewOperation({...newOperation, resourceId: e.target.value})}/>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select fullWidth label="Status"
                value={newOperation.status}
                onChange={e => setNewOperation({...newOperation, status: e.target.value})}>
                <MenuItem value="STARTED">Started</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="DELAYED">Delayed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Start Time"
                value={newOperation.actualStart}
                onChange={newValue => setNewOperation({...newOperation, actualStart: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained"
                disabled={!newOperation.plannedOperationId || !newOperation.resourceId}
                onClick={() => vm.createExecutedOperation(newOperation)}>
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
                    <TextField select fullWidth label="Status"
                      value={selectedOp.status}
                      onChange={e => setSelectedOp({...selectedOp, status: e.target.value})}>
                      <MenuItem value="STARTED">Started</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="DELAYED">Delayed</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="End Time"
                      value={selectedOp.actualEnd ? new Date(selectedOp.actualEnd) : null}
                      onChange={newValue => setSelectedOp({...selectedOp, actualEnd: newValue ? newValue.toISOString() : null})}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button variant="contained"
                  onClick={() => vm.updateExecutedOperation(selectedOp.id, {
                    status: selectedOp.status,
                    actualEnd: selectedOp.actualEnd
                  })}>
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
