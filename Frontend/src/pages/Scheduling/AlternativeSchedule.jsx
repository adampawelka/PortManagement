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

  // Tworzymy mapę vesselName -> notification
  const vesselMap = React.useMemo(() => {
    const map = {};
    vesselNotifications.forEach(n => {
      if (n.vesselName) {
        const key = n.vesselName.toLowerCase().replace(/\s+/g, "_");
        map[key] = n;
      }
    });
    return map;
  }, [vesselNotifications]);

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

      {/* Controls */}
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

      {/* Execution Time */}
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

      {/* Loading */}
      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, backgroundColor: "var(--color-error)", color: "var(--color-text-light)" }}
        >
          {error}
        </Alert>
      )}

      {/* Global info about Unassigned (crane/staff only) */}
      {hasGenerated && !loading && scheduleResults.length > 0 && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            backgroundColor: "var(--color-info)",
            color: "var(--color-text-dark)"
          }}
        >
          <strong>Note:</strong> "Unassigned" means that the crane or staff could not be assigned due to insufficient resources.
        </Alert>
      )}

      {/* No schedule results */}
      {hasGenerated && !loading && scheduleResults.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{ mb: 2, backgroundColor: "var(--color-info)", color: "var(--color-text-dark)" }}
        >
          No schedule results.
        </Alert>
      )}

      {/* Schedule Table */}
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
                <TableCell sx={{ fontWeight: "bold" }}>Delay[h]</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Assigned Crane</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {scheduleResults.map((item, idx) => {
                const vesselKey = item.vesselName; // iarti_container_X
                const note = vesselMap[vesselKey];

                const eta = note?.eta ? new Date(note.eta).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "N/A";
                const etd = note?.etd ? new Date(note.etd).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "N/A";

                let delay = null;
                if (note?.etd && item?.endSlot != null) {
                  const etdDate = new Date(note.etd);
                  const endDate = new Date(etdDate.getTime());
                  endDate.setHours(0, 0, 0, 0);
                  endDate.setHours(endDate.getHours() + item.endSlot);
                  delay = Math.max(0, Math.round((endDate - etdDate) / (1000 * 60 * 60)));
                }

                const delayDisplay = delay != null ? (delay > 0 ? `${delay}` : "On time") : "N/A";

                return (
                  <TableRow key={idx} sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                    <TableCell>{note?.vesselName ?? "N/A"}</TableCell>
                    <TableCell>{eta}</TableCell>
                    <TableCell>{etd}</TableCell>
                    <TableCell>{item.start ?? "N/A"}</TableCell>
                    <TableCell>{item.end ?? "N/A"}</TableCell>
                    <TableCell>{delayDisplay}</TableCell>
                    <TableCell>{item.dock ?? "N/A"}</TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: !item?.craneCodes || item.craneCodes.length === 0 ? "var(--color-warning-bg)" : "inherit"
                      }}
                    >
                      {item?.craneCodes?.join(", ") ?? "Unassigned"}
                    </TableCell>

                    <TableCell
                      sx={{
                        backgroundColor: !item?.staff || item.staff.length === 0 ? "var(--color-warning-bg)" : "inherit"
                      }}
                    >
                      {Array.isArray(item?.staff) && item.staff.length > 0
                        ? item.staff.map(s => s?.shortName ?? s).join(", ")
                        : "Unassigned"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div style={{ padding: 12, textAlign: "center", color: "var(--color-text-muted)" }}>
            <div>
              <strong>Total Delay:</strong> {totalDelay}
            </div>
          </div>
        </TableContainer>
      )}
    </Container>
  );
};

export default AlternativeSchedule;
