// src/pages/OperationPlans/MissingPlansPage.jsx
import React from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Box
} from '@mui/material';
import { useMissingPlansVM } from '../../viewmodels/OperationPlans/useMissingPlansVM';

const MissingPlansPage = () => {
  const { 
    selectedDate, 
    missingPlans, 
    loading, 
    generating, 
    message, 
    handleDateChange, 
    handleGenerate 
  } = useMissingPlansVM();

  return (
    <Container
      maxWidth="lg"
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
        Missing Operational Plans
      </Typography>

      {/* Selector de Fecha */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' },
            '& .MuiOutlinedInput-root': { borderColor: 'var(--color-border)' },
          }}
        />
        
        {/* Botón Global de Regenerar (Si hay items en la lista) */}
        {missingPlans.length > 0 && (
            <Button 
                variant="contained" 
                color="secondary"
                onClick={() => handleGenerate("Genetic")} // Puedes cambiar el algoritmo aquí o añadir un selector
                disabled={generating}
                sx={{ height: '56px' }}
            >
                {generating ? <CircularProgress size={24} color="inherit"/> : "Generate Plans for Date"}
            </Button>
        )}
      </Box>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      {loading ? (
        <Container sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress /> 
            <Typography sx={{mt:1}}>Checking missing plans...</Typography>
        </Container>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid var(--color-border)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'var(--color-background-light)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Vessel Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>IMO</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missingPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No missing plans found for this date. All approved vessels have a plan. ✅
                  </TableCell>
                </TableRow>
              ) : (
                missingPlans.map((vvn) => (
                  <TableRow key={vvn.vvnId} hover>
                    <TableCell>{vvn.vesselName}</TableCell>
                    <TableCell>{vvn.imo}</TableCell>
                    <TableCell>{new Date(vvn.eta).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: 'green', fontWeight: 600 }}>{vvn.status}</TableCell>
                    <TableCell>
                      {/* Botón individual (aunque la lógica del backend suele ser por día, 
                          este botón dispara la misma acción para UX) */}
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={generating}
                        onClick={() => handleGenerate("Genetic")}
                        sx={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                            '&:hover': {
                                backgroundColor: 'var(--color-primary-light)',
                                color: 'white'
                            }
                        }}
                      >
                        Assign Plan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MissingPlansPage;