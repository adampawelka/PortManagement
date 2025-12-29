import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateVVEVM } from '../../viewmodels/VesselVisitExecutions/useUpdateVVEVM';

const UpdateVVEPage = () => {
  const vm = useUpdateVVEVM();

  /* =======================
     VVE INFO STATE
  ======================= */
  const [vveIdInput, setVveIdInput] = useState('');
  const [dockInput, setDockInput] = useState('');
  const [berthTimeInput, setBerthTimeInput] = useState(null);

  /* =======================
     UI CONTROL
  ======================= */
  const [activeSection, setActiveSection] = useState(null);
  // 'add' | 'edit' | null

  /* =======================
     ADD OPERATION STATE
  ======================= */
  const [newOp, setNewOp] = useState({
    plannedOperationId: '',
    resourceId: '',
    actualStart: new Date(),
    status: 'STARTED',
  });

  /* =======================
     EDIT OPERATION STATE
  ======================= */
  const [editOpId, setEditOpId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  /* =======================
     EFFECTS
  ======================= */
  useEffect(() => {
    if (vm.vveId) {
      vm.fetchVVE();
    }
  }, [vm.vveId]);

  useEffect(() => {
    if (vm.vve) {
      setDockInput(vm.vve.dockId || '');
      setBerthTimeInput(vm.vve.actualBerthTime || null);
    }
  }, [vm.vve]);

  /* =======================
     HANDLERS
  ======================= */
  const handleUpdateVVE = (e) => {
    e.preventDefault();
    vm.setVveId(vveIdInput);
    vm.updateVVEInfo({
      dockId: dockInput,
      actualBerthTime: berthTimeInput,
    });
  };

  const handleAddOperation = async () => {
    if (!newOp.plannedOperationId || !newOp.resourceId) return;

    await vm.createExecutedOperation(newOp);

    setNewOp({
      plannedOperationId: '',
      resourceId: '',
      actualStart: new Date(),
      status: 'STARTED',
    });
  };

  const handleUpdateOperation = async (id) => {
    if (!editStatus) return;

    await vm.updateExecutedOperation(id, { status: editStatus });

    setEditOpId(null);
    setEditStatus('');
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Update Vessel Visit Execution
        </Typography>

        {vm.error && <Alert severity="error">{vm.error}</Alert>}
        {vm.success && <Alert severity="success">{vm.success}</Alert>}

        {/* =======================
            UPDATE VVE INFO
        ======================= */}
        <Box component="form" onSubmit={handleUpdateVVE} mt={2}>
          <TextField
            label="VVE ID"
            value={vveIdInput}
            onChange={(e) => setVveIdInput(e.target.value)}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Dock ID"
            value={dockInput}
            onChange={(e) => setDockInput(e.target.value)}
            fullWidth
            margin="normal"
          />

          <DateTimePicker
            label="Actual Berth Time"
            value={berthTimeInput ? new Date(berthTimeInput) : null}
            onChange={(v) =>
              setBerthTimeInput(v ? v.toISOString() : null)
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={vm.loading}
          >
            {vm.loading ? (
              <CircularProgress size={24} />
            ) : (
              'Update VVE'
            )}
          </Button>
        </Box>

        {/* =======================
            ACTION BUTTONS
        ======================= */}
        <Box mt={5} display="flex" gap={2}>
          <Button
            variant={activeSection === 'add' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() =>
              setActiveSection(activeSection === 'add' ? null : 'add')
            }
          >
            Add New Executed Operation
          </Button>

          <Button
            variant={activeSection === 'edit' ? 'contained' : 'outlined'}
            fullWidth
            onClick={() =>
              setActiveSection(activeSection === 'edit' ? null : 'edit')
            }
          >
            Edit Existing Executed Operation
          </Button>
        </Box>

        {/* =======================
            ADD OPERATION
        ======================= */}
        {activeSection === 'add' && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Add Executed Operation
            </Typography>

            <TextField
              select
              label="Planned Operation"
              value={newOp.plannedOperationId}
              onChange={(e) =>
                setNewOp({
                  ...newOp,
                  plannedOperationId: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            >
              {vm.plannedOperations.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Resource"
              value={newOp.resourceId}
              onChange={(e) =>
                setNewOp({ ...newOp, resourceId: e.target.value })
              }
              fullWidth
              margin="normal"
            />

            <DateTimePicker
              label="Start Time"
              value={newOp.actualStart}
              onChange={(v) =>
                setNewOp({
                  ...newOp,
                  actualStart: v || new Date(),
                })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />

            <TextField
              select
              label="Status"
              value={newOp.status}
              onChange={(e) =>
                setNewOp({ ...newOp, status: e.target.value })
              }
              fullWidth
              margin="normal"
            >
              <MenuItem value="STARTED">STARTED</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="DELAYED">DELAYED</MenuItem>
            </TextField>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleAddOperation}
            >
              Save Executed Operation
            </Button>
          </Box>
        )}

        {/* =======================
            EDIT OPERATIONS
        ======================= */}
        {activeSection === 'edit' && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Existing Executed Operations
            </Typography>

            {vm.executedOperations.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No executed operations found for this Vessel Visit Execution.
              </Alert>
            ) : (
              vm.executedOperations.map((op) => (
                <Box
                  key={op.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    Planned Operation: {op.plannedOperationId}
                  </Typography>
                  <Typography>
                    Resource: {op.resourceId}
                  </Typography>
                  <Typography>
                    Start: {new Date(op.actualStart).toLocaleString()}
                  </Typography>

                  <TextField
                    select
                    label="Status"
                    value={editOpId === op.id ? editStatus : op.status}
                    onChange={(e) => {
                      setEditOpId(op.id);
                      setEditStatus(e.target.value);
                    }}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="STARTED">STARTED</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="DELAYED">DELAYED</MenuItem>
                  </TextField>

                  {editOpId === op.id && (
                    <Button
                      variant="contained"
                      sx={{ mt: 1 }}
                      onClick={() => handleUpdateOperation(op.id)}
                    >
                      Save Changes
                    </Button>
                  )}
                </Box>
              ))
            )}
          </Box>
        )}

      </Container>
    </LocalizationProvider>
  );
};

export default UpdateVVEPage;
