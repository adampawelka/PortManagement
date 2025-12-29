import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Alert, CircularProgress,
  Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useUpdateVVEVM } from "../../viewmodels/VesselVisitExecutions/useUpdateVVEVM";

const UpdateVVEPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillVvnId = location.state?.vvnId || "";
  const vm = useUpdateVVEVM(prefillVvnId);

  const [vvnInput, setVvnInput] = useState(prefillVvnId);
  const [vveUpdates, setVveUpdates] = useState({ dockId: "", actualBerthTime: "" });
  const [newOp, setNewOp] = useState({ plannedOperationId: "", resourceId: "", actualStart: new Date(), status: "STARTED" });
  const [editOp, setEditOp] = useState(null);

  useEffect(() => {
    if (vm.vvnId) vm.fetchVVE();
  }, [vm, vm.vvnId]);

  const loadVVE = () => {
    if (!vvnInput) return;
    vm.setVvnId(vvnInput);
    vm.fetchVVE(vvnInput);
  };

  if (vm.loading) return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  if (vm.error) return <Alert severity="error">{vm.error}</Alert>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Update Vessel Visit Execution</Typography>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Box>

        {!vm.vvnId && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography>Enter VVE ID to load:</Typography>
            <Box display="flex" mt={1} gap={2}>
              <TextField value={vvnInput} onChange={e => setVvnInput(e.target.value)} label="VVN ID" />
              <Button variant="contained" onClick={loadVVE}>Load</Button>
            </Box>
          </Paper>
        )}

        {vm.success && <Alert severity="success">{vm.success}</Alert>}

        {vm.vve && (
          <>
            {/* VVE Info */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6">VVE Info</Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <TextField
                    label="Dock ID"
                    fullWidth
                    value={vveUpdates.dockId || vm.vve.dockId || ""}
                    onChange={e => setVveUpdates({ ...vveUpdates, dockId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Actual Berth Time"
                    value={vveUpdates.actualBerthTime ? new Date(vveUpdates.actualBerthTime) : vm.vve.actualBerthTime ? new Date(vm.vve.actualBerthTime) : null}
                    onChange={v => setVveUpdates({ ...vveUpdates, actualBerthTime: v?.toISOString() || "" })}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={() => vm.updateVVEInfo(vveUpdates)}>Update VVE</Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Executed Operations */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="h6">Executed Operations</Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={vm.markAllOperationsCompleted}
                  disabled={!vm.executedOperations.length}
                >
                  Mark all completed
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Planned</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vm.executedOperations.map(op => (
                      <TableRow key={op.id}>
                        <TableCell>{op.plannedOperationId}</TableCell>
                        <TableCell>{op.resourceId}</TableCell>
                        <TableCell>{new Date(op.actualStart).toLocaleString()}</TableCell>
                        <TableCell><Chip label={op.status} /></TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => setEditOp(op)}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Add Executed Operation */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6">Add Executed Operation</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Planned Operation ID"
                    fullWidth
                    value={newOp.plannedOperationId}
                    onChange={e => setNewOp({ ...newOp, plannedOperationId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Resource ID"
                    fullWidth
                    value={newOp.resourceId}
                    onChange={e => setNewOp({ ...newOp, resourceId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <DateTimePicker
                    label="Start time"
                    value={newOp.actualStart}
                    onChange={v => setNewOp({ ...newOp, actualStart: v || new Date() })}
                    renderInput={params => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={() => vm.createExecutedOperation(newOp)}>Add</Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Edit Operation Dialog */}
            <Dialog open={!!editOp} onClose={() => setEditOp(null)}>
              {editOp && (
                <>
                  <DialogTitle>Edit Operation</DialogTitle>
                  <DialogContent>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={editOp.status}
                      onChange={e => setEditOp({ ...editOp, status: e.target.value })}
                    >
                      <MenuItem value="STARTED">STARTED</MenuItem>
                      <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                      <MenuItem value="DELAYED">DELAYED</MenuItem>
                    </TextField>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setEditOp(null)}>Cancel</Button>
                    <Button
                      variant="contained"
                      onClick={() => vm.updateExecutedOperation(editOp.id, { status: editOp.status })}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default UpdateVVEPage;
