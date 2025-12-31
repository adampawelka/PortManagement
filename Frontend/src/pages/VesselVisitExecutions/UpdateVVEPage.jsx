import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- importujemy useParams
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateVVEVM } from '../../viewmodels/VesselVisitExecutions/useUpdateVVEVM';

const UpdateVVEPage = () => {
  const { vveId: paramVveId } = useParams(); 
  const vm = useUpdateVVEVM(paramVveId || ''); 

  const isVveLoaded = !!vm.vve;

  const [vveIdInput, setVveIdInput] = useState(paramVveId || '');
  const [dockInput, setDockInput] = useState('');
  const [berthTimeInput, setBerthTimeInput] = useState(null);

  const [activeSection, setActiveSection] = useState(null); // 'add' | 'edit' | null

  const [newOp, setNewOp] = useState({
    plannedOperationId: '',
    resourceId: '',
    actualStart: new Date(),
    status: 'STARTED',
  });

  const [editOpId, setEditOpId] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    if (paramVveId) {
      vm.fetchVVE();
    }
  }, [paramVveId]);

  useEffect(() => {
    if (vm.vve) {
      setDockInput(vm.vve.dockId || '');
      setBerthTimeInput(vm.vve.actualBerthTime || null);
    }
  }, [vm.vve]);

  const handleLoadVVE = async (e) => {
    e.preventDefault();
    if (!paramVveId) {
      vm.setVveId(vveIdInput);
      await vm.fetchVVE(vveIdInput);
    } else {
      await vm.fetchVVE();
    }
  };

  const handleUpdateVVE = async (e) => {
    e.preventDefault();
    if (!isVveLoaded) return;
    await vm.updateVVEInfo({ dockId: dockInput, actualBerthTime: berthTimeInput });
  };


  const handleAddOperation = async () => {
    if (!newOp.plannedOperationId || !newOp.resourceId) return;
    await vm.createExecutedOperation(newOp);
    setNewOp({ plannedOperationId: '', resourceId: '', actualStart: new Date(), status: 'STARTED' });
  };

  const handleUpdateOperation = async (id) => {
    if (!editStatus) return;
    await vm.updateExecutedOperation(id, { status: editStatus });
    setEditOpId(null);
    setEditStatus('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 'var(--radius-md)',
          boxShadow: 3,
          backgroundColor: 'var(--color-surface)',
          fontFamily: 'var(--font-family-base)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'var(--color-primary-light)',
            fontWeight: 600,
            mb: 3,
            fontSize: 'var(--font-size-heading)',
          }}
        >
          Update Vessel Visit Execution
        </Typography>

        {vm.error && <Alert severity="error" sx={{ mb: 2 }}>{vm.error}</Alert>}
        {vm.success && <Alert severity="success" sx={{ mb: 2 }}>{vm.success}</Alert>}

        {/* =======================
            VVE DETAILS FORM
        ======================= */}
        {!isVveLoaded && (
          <Box component="form" onSubmit={handleLoadVVE}>
            <TextField
              label="VVE ID"
              value={vveIdInput}
              onChange={(e) => setVveIdInput(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={!!paramVveId}
              sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={vm.loading}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-light)',
                '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
              }}
            >
              {vm.loading ? <CircularProgress size={24} color="inherit" /> : 'Load VVE'}
            </Button>
          </Box>
        )}

        {isVveLoaded && (
          <Box component="form" onSubmit={handleUpdateVVE}>


            <FormControl fullWidth margin="normal">
              <InputLabel id="dock-select-label">Dock</InputLabel>
              <Select
                labelId="dock-select-label"
                value={dockInput}
                onChange={(e) => setDockInput(e.target.value)}
                label="Dock"
                sx={{
                  "& .MuiInputBase-input": { color: "var(--color-text-dark)" },
                  "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {vm.docks.map((dock) => (
                  <MenuItem key={dock.id} value={dock.id}>
                    {dock.name || dock.id} {dock.location ? `- ${dock.location}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DateTimePicker
              label="Actual Berth Time"
              value={berthTimeInput ? new Date(berthTimeInput) : null}
              onChange={(v) => setBerthTimeInput(v ? v.toISOString() : null)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-light)',
                '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
              }}
              disabled={vm.loading}
            >
              {vm.loading ? <CircularProgress size={24} color="inherit" /> : 'Update VVE'}
            </Button>
          </Box>
        )}

        {/* =======================
            ADD / EDIT BUTTONS
        ======================= */}

        {isVveLoaded && (
          <Box mt={4} display="flex" gap={2}>
            {['add', 'edit'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'contained' : 'outlined'}
                fullWidth
                disabled={!isVveLoaded}
                sx={{
                  py: 1.5,
                  backgroundColor: activeSection === section ? 'var(--color-primary)' : 'transparent',
                  color: activeSection === section ? 'var(--color-text-light)' : 'var(--color-text-dark)',
                  '&:hover': { backgroundColor: activeSection === section ? 'var(--color-primary-dark)' : 'var(--color-surface)' },
                }}
                onClick={() => setActiveSection(activeSection === section ? null : section)}
              >
                {section === 'add' ? 'Add Executed Operation' : 'Edit Executed Operation'}
              </Button>
            ))}
          </Box>
        )}

        {/* =======================
            ADD OPERATION FORM
        ======================= */}
        {activeSection === 'add' && (
          <Box mt={4} sx={{ p: 3, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: 'var(--color-primary-light)',
                fontWeight: 600,
                mb: 3,
                fontSize: 'var(--font-size-heading)',
              }}
            >
              Add Executed Operation</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Planned Operation</InputLabel>
              <Select
                value={newOp.plannedOperationId}
                onChange={(e) => setNewOp({ ...newOp, plannedOperationId: e.target.value })}
              >
                {vm.plannedOperations.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name || p.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Resource"
              value={newOp.resourceId}
              onChange={(e) => setNewOp({ ...newOp, resourceId: e.target.value })}
              fullWidth
              margin="normal"
            />

            <DateTimePicker
              label="Start Time"
              value={newOp.actualStart}
              onChange={(v) => setNewOp({ ...newOp, actualStart: v || new Date() })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={newOp.status}
                onChange={(e) => setNewOp({ ...newOp, status: e.target.value })}
              >
                <MenuItem value="STARTED">STARTED</MenuItem>
                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                <MenuItem value="DELAYED">DELAYED</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-light)',
                '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
              }}
              onClick={handleAddOperation}
            >
              Save Operation
            </Button>
          </Box>
        )}

        {/* =======================
            EDIT OPERATION FORM
        ======================= */}
        {activeSection === 'edit' && (
          <Box mt={4}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: 'var(--color-primary-light)',
                fontWeight: 600,
                mb: 3,
                fontSize: 'var(--font-size-heading)',
              }}
            > Existing Executed Operations</Typography>

            {vm.executedOperations.length === 0 ? (
              <Alert severity="info">No executed operations found. Add one to continue.</Alert>
            ) : vm.executedOperations.map((op) => (
              <Box key={op.id} sx={{ mt: 2, p: 3, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <Typography>Planned: {op.plannedOperationId}</Typography>
                <Typography>Resource: {op.resourceId}</Typography>
                <Typography>Start: {new Date(op.actualStart).toLocaleString()}</Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    value={editOpId === op.id ? editStatus : op.status}
                    onChange={(e) => { setEditOpId(op.id); setEditStatus(e.target.value); }}
                  >
                    <MenuItem value="STARTED">STARTED</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="DELAYED">DELAYED</MenuItem>
                  </Select>
                </FormControl>

                {editOpId === op.id && (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1,
                      py: 1.5,
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-text-light)',
                      '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
                    }}
                    onClick={() => handleUpdateOperation(op.id)}
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default UpdateVVEPage;
