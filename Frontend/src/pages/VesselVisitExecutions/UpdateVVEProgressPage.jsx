import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
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
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useUpdateVVEProgressVM } from
  "../../viewmodels/VesselVisitExecutions/useUpdateVVEProgressVM";

const UpdateVVEProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useUpdateVVEProgressVM(id);

  const [newOp, setNewOp] = useState({
    plannedOperationId: "",
    resourceId: "",
    actualStart: new Date(),
    status: "STARTED",
  });

  const [editOp, setEditOp] = useState(null);

  useEffect(() => {
    vm.fetchVVEAndOperations();
  }, [vm, id]);


  if (vm.loading) return <CircularProgress />;
  if (vm.error) return <Alert severity="error">{vm.error}</Alert>;
  if (!vm.vve) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5">
            Update VVE: {vm.vve.vvnId}
          </Typography>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Box>

        {vm.success && <Alert severity="success">{vm.success}</Alert>}

        {/* Executed operations */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="h6">Executed Operations</Typography>
            <Button
              variant="contained"
              color="success"
              onClick={vm.markAllAsCompleted}
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
                {vm.executedOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>{op.plannedOperationId}</TableCell>
                    <TableCell>{op.resourceId}</TableCell>
                    <TableCell>
                      {new Date(op.actualStart).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip label={op.status} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => setEditOp(op)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Create operation */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Add Executed Operation</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Planned Operation ID"
                fullWidth
                value={newOp.plannedOperationId}
                onChange={(e) =>
                  setNewOp({ ...newOp, plannedOperationId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Resource ID"
                fullWidth
                value={newOp.resourceId}
                onChange={(e) =>
                  setNewOp({ ...newOp, resourceId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <DateTimePicker
                label="Start time"
                value={newOp.actualStart}
                onChange={(v) => setNewOp({ ...newOp, actualStart: v })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => vm.createExecutedOperation(newOp)}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Edit dialog */}
        <Dialog open={!!editOp} onClose={() => setEditOp(null)}>
          {editOp && (
            <>
              <DialogTitle>Edit operation</DialogTitle>
              <DialogContent>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={editOp.status}
                  onChange={(e) =>
                    setEditOp({ ...editOp, status: e.target.value })
                  }
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
                  onClick={() =>
                    vm.updateExecutedOperation(editOp.id, {
                      status: editOp.status,
                    })
                  }
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
