import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Box
} from "@mui/material";
import { useVVEListVM } from "../../viewmodels/VesselVisitExecutions/useVVEListVM";

const VVEListPage = () => {
  const { vveList, loading, error } = useVVEListVM();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: 4, 
        backgroundColor: 'var(--color-surface)', 
        p: 4, 
        borderRadius: 'var(--radius-md)', 
        boxShadow: 3,
        fontFamily: 'var(--font-family-base)',
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'var(--color-primary-light)', 
            fontWeight: 600,
            fontSize: 'var(--font-size-heading)', 
          }}
        >
          Vessel Visit Executions ({vveList.length})
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/vve/add")}
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
          }}
        >
          Create VVE
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, color: 'var(--color-text-light)', backgroundColor: 'var(--color-error)' }}
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      {!loading && vveList.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ mb: 2, backgroundColor: 'var(--color-info)', color: 'var(--color-text-dark)' }}
          aria-live="polite"
        >
          No vessel visit executions found.
        </Alert>
      )}

      {vveList.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="vve table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>VVE ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>VVN ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Dock</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Actual Arrival</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Actual Berth</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vveList.map(vve => {
                const vveId = vve.id || vve.vveId; // Support both id and vveId for compatibility
                return (
                  <TableRow key={vveId} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                    <TableCell>{vveId}</TableCell>
                    <TableCell>{vve.vvnId}</TableCell>
                    <TableCell>{vve.dockId || "-"}</TableCell>
                    <TableCell>{vve.status}</TableCell>
                    <TableCell>{vve.createdBy}</TableCell>
                    <TableCell>{formatDate(vve.actualArrivalTime)}</TableCell>
                    <TableCell>{formatDate(vve.actualBerthTime)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/vve/${vveId}/update`)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default VVEListPage;
