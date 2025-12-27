import React from "react";
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  TableContainer,
  Paper as MuiPaper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import { useAlternativeScheduleVM } from "../../viewmodels/Scheduling/useAlternativeScheduleVM";
import "../../styles/Scheduling.css";

const ALGO_LABELS = {
  heuristic: "EDT – Early Departure Time (heuristic)",
  spt: "SPT – Shortest Processing Time",
  dynamic_mst: "Dynamic MST – Minimum Slack Time"
};

const AlternativeSchedule = () => {
  const {
    targetDate,
    setTargetDate,
    selectedAlgorithm,
    setSelectedAlgorithm,
    scheduleResults,
    vesselNotifications,
    loading,
    error,
    executionTime,
    hasGenerated,
    totalDelay,
    generateSchedule
  } = useAlternativeScheduleVM();

  const handleGenerate = () => {
    if (!targetDate) {
      alert("Please select a date");
      return;
    }
    generateSchedule();
  };

  const getNotificationFor = (vesselName) =>
    vesselNotifications.find(n =>
      n.vesselName && n.vesselName.toLowerCase().replace(/\s+/g, "_") === vesselName.toLowerCase()
    );

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        backgroundColor: "var(--color-surface)",
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
        fontFamily: "var(--font-family-base)"
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
          fontSize: "var(--font-size-heading)"
        }}
      >
        Heuristic Scheduling ({scheduleResults.length})
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "var(--color-background)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <FormControl size="small" sx={{ width: 320 }}>
          <InputLabel id="algo-label">Algorithm</InputLabel>
          <Select
            labelId="algo-label"
            value={selectedAlgorithm}
            label="Algorithm"
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            sx={{
              backgroundColor: "var(--color-surface)",
              "& .MuiSelect-select": { padding: "6px 10px", fontSize: "0.9rem" }
            }}
          >
            <MenuItem value="heuristic">{ALGO_LABELS.heuristic}</MenuItem>
            <MenuItem value="spt">{ALGO_LABELS.spt}</MenuItem>
            <MenuItem value="dynamic_mst">{ALGO_LABELS.dynamic_mst}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: 250 }}>
          <TextField
            type="date"
            size="small"
            label="Target Date"
            InputLabelProps={{ shrink: true }}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            sx={{
              backgroundColor: "var(--color-surface)",
              "& .MuiInputBase-input": { padding: "6px 10px", fontSize: "0.85rem" },
              "& .MuiInputLabel-root": { fontSize: "0.85rem" }
            }}
          />
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerate}
          sx={{
            py: 1,
            px: 3,
            fontSize: "0.9rem",
            backgroundColor: "var(--color-primary)",
            height: 40,
            whiteSpace: "nowrap",
            ":hover": { backgroundColor: "var(--color-primary-dark)" }
          }}
        >
          Generate
        </Button>
      </Paper>

      {executionTime !== null && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: "var(--color-info)",
            color: "var(--color-text-dark)"
          }}
        >
          Execution Time: {executionTime}s ({(executionTime * 1000).toFixed(3)} ms)
        </Alert>
      )}

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, backgroundColor: "var(--color-error)", color: "var(--color-text-light)" }}
        >
          {error}
        </Alert>
      )}

      {hasGenerated && !loading && scheduleResults.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{ mb: 2, backgroundColor: "var(--color-info)", color: "var(--color-text-dark)" }}
        >
          No schedule results.
        </Alert>
      )}

      {scheduleResults.length > 0 && (
        <TableContainer component={MuiPaper} sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Expected Departure</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Delay</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assigned Crane</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {scheduleResults.map((item, idx) => {
                const note = getNotificationFor(item.vessel);
                const eta = note ? new Date(note.eta).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "N/A";
                const etd = note ? new Date(note.etd).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "N/A";
                const delay = note && item.endSlot != null ? (item.endSlot - new Date(note.etd).getHours()) : null;
                const delayDisplay = delay != null ? (delay > 0 ? `${delay}h` : "On time") : "N/A";

                return (
                  <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                    <TableCell>{item.vessel}</TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>{etd}</TableCell>
                    <TableCell>{item.start}</TableCell>
                    <TableCell>{item.end}</TableCell>
                    <TableCell>{delayDisplay}</TableCell>
                    <TableCell>{item.dock}</TableCell>
                    <TableCell>{item.crane}</TableCell>
                    <TableCell>{item.staff}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div style={{ padding: 12, textAlign: "center", color: "var(--color-text-muted)" }}>
            <div>
              <strong>Total Delay:</strong> {totalDelay}h
            </div>
          </div>
        </TableContainer>
      )}
    </Container>
  );
};

export default AlternativeSchedule;
