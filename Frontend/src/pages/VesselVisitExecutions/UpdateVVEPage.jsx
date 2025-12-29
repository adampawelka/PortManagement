// src/pages/UpdateVVEPage.js
import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateVVEVM } from '../../viewmodels/VesselVisitExecutions/useUpdateVVEVM';

const UpdateVVEPage = () => {
  const vm = useUpdateVVEVM();
  const [vvnIdInput, setVvnIdInput] = useState(vm.vvnId || '');
  const [dockInput, setDockInput] = useState(vm.vve?.dockId || '');
  const [berthTimeInput, setBerthTimeInput] = useState(vm.vve?.actualBerthTime || null);

  useEffect(() => {
    if (vm.vvnId) {
      vm.fetchVVE();
      setDockInput(vm.vve?.dockId || '');
      setBerthTimeInput(vm.vve?.actualBerthTime || null);
    }
  }, [vm.vvnId, vm.vve]);

  const handleUpdate = (e) => {
    e.preventDefault();
    vm.setVvnId(vvnIdInput);
    vm.updateVVEInfo({ dockId: dockInput, actualBerthTime: berthTimeInput });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          backgroundColor: 'var(--color-surface)',
          p: 4,
          borderRadius: 'var(--radius-md)',
          boxShadow: 3,
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

        {vm.error && (
          <Alert
            severity="error"
            sx={{ mb: 2, backgroundColor: 'var(--color-error)', color: 'var(--color-text-light)' }}
          >
            {vm.error}
          </Alert>
        )}

        {vm.success && (
          <Alert
            severity="success"
            sx={{ mb: 2, backgroundColor: 'var(--color-success)', color: 'var(--color-text-dark)' }}
          >
            {vm.success}
          </Alert>
        )}

        <form onSubmit={handleUpdate}>
          <TextField
            label="VVN ID"
            value={vvnIdInput}
            onChange={(e) => setVvnIdInput(e.target.value)}
            required
            fullWidth
            margin="normal"
            sx={{
              input: { fontSize: 'var(--font-size-input)', color: 'var(--color-text-dark)' },
              label: { fontSize: 'var(--font-size-label)' },
            }}
          />

          <TextField
            label="Dock ID"
            value={dockInput}
            onChange={(e) => setDockInput(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              input: { fontSize: 'var(--font-size-input)', color: 'var(--color-text-dark)' },
              label: { fontSize: 'var(--font-size-label)' },
            }}
          />

          <DateTimePicker
            label="Actual Berth Time"
            value={berthTimeInput ? new Date(berthTimeInput) : null}
            onChange={(v) => setBerthTimeInput(v?.toISOString() || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                sx={{
                  input: { fontSize: 'var(--font-size-input)', color: 'var(--color-text-dark)' },
                  label: { fontSize: 'var(--font-size-label)' },
                }}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={vm.loading}
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
            }}
          >
            {vm.loading ? <CircularProgress size={24} color="inherit" /> : 'Update Vessel Visit Execution'}
          </Button>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default UpdateVVEPage;
