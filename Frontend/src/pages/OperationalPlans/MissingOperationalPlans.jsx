import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Paper, FormControl, TextField, 
  Button, Table, TableHead, TableRow, TableCell, 
  TableBody, CircularProgress, Alert, Box 
} from "@mui/material";
import { useMissingPlansVM } from "../../viewmodels/OperationalPlans/useMissingPlansVM";

const MissingOperationalPlans = () => {
  const { date, setDate, missingList, loading, error, hasSearched, findMissing } = useMissingPlansVM();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 3,
        fontFamily: 'var(--font-family-base)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: 'var(--color-primary-light)',
          fontWeight: 600,
          mb: 3,
          fontSize: 'var(--font-size-heading)',
        }}
      >
        Missing Operational Plans (US 4.1.5)
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: 'var(--color-background)',
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl sx={{ width: 250 }}>
          <TextField
            type="date"
            size="small"
            label="Check Date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ backgroundColor: "var(--color-surface)" }}
          />
        </FormControl>

        <Button
          variant="contained"
          onClick={findMissing}
          disabled={loading}
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            height: 40,
            '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
          }}
        >
          {loading ? "Checking..." : "Check Missing Plans"}
        </Button>
      </Paper>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2, color: 'var(--color-text-light)', backgroundColor: 'var(--color-error)' }}
        >
          {error}
        </Alert>
      )}

      {hasSearched && !loading && missingList.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ mb: 2, backgroundColor: 'var(--color-info)', color: 'var(--color-text-dark)' }}
        >
          All approved vessels for this date have an Operational Plan.
        </Alert>
      )}

      {missingList.length > 0 && (
        <>
          <Table size="small" sx={{ minWidth: 650, mb: 3, mt: 3 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Vessel Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>VVN ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missingList.map((item) => (
                <TableRow key={item.vvnId} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{item.vesselName}</TableCell>
                  <TableCell>{item.vvnId}</TableCell>
                  <TableCell>{new Date(item.eta).toLocaleString()}</TableCell>
                  <TableCell sx={{ color: "green", fontWeight: 600 }}>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/operational-plans/generate", { state: { date } })}
              sx={{ fontWeight: "bold" }}
            >
              Generate Plans for {date} (Overwrite)
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default MissingOperationalPlans;