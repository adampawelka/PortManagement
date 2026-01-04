import React, { useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    FormControl,
    TextField,
    Button,
    Grid
} from "@mui/material";

import { useScheduleMultiCraneVM } from "../../viewmodels/Scheduling/useMultiCraneScheduleVM";

const getUncoveredHoursWithDate = (schedules) => {
    if (!schedules || schedules.length === 0) return null;

    const covered = new Set();

    schedules.forEach(s => {
        let start = s.startHour != null ? s.startHour : null;
        let end = s.endHour != null ? s.endHour : null;
        if (start === null || end === null) return;

        if (start <= end) {
            for (let h = start; h <= end; h++) covered.add(h);
        } else {
            // Zakres przechodzi przez północ
            for (let h = start; h < start + 24; h++) covered.add(h);
        }
    });

    const allHours = Array.from({ length: 24 * 3 }, (_, i) => i); // np. 3 dni na wszelki wypadek
    const uncovered = allHours.filter(h => !covered.has(h));
    if (uncovered.length === 0) return null;

    return uncovered
        .map(h => {
            const dayOffset = Math.floor(h / 24);
            const hour = h % 24;
            return dayOffset > 0 ? `${hour}(+${dayOffset})` : `${hour}`;
        })
        .join(", ");
};

const MultiCraneSchedule = () => {
    const {
        targetDate,
        setTargetDate,
        scheduleResults,
        loading,
        error,
        generateSchedule
    } = useScheduleMultiCraneVM();

    const [hasGenerated, setHasGenerated] = useState(false);

    const handleGenerate = () => {
        if (!targetDate) {
            alert("Please select a date");
            return;
        }
        setHasGenerated(true);
        generateSchedule();
    };

    const safeResults = scheduleResults ?? [];

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
            {/* HEADER */}
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: 3,
                    letterSpacing: 0.3,
                    fontSize: "var(--font-size-heading)"
                }}
            >
                Multi-Crane Scheduling ({safeResults.length})
            </Typography>

            {/* CONTROLS */}
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
                            "& .MuiInputBase-input": {
                                padding: "6px 10px",
                                fontSize: "0.85rem"
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.85rem"
                            }
                        }}
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    sx={{
                        py: 1,
                        px: 3,
                        fontSize: "0.85rem",
                        backgroundColor: "var(--color-primary)",
                        height: 40,
                        whiteSpace: "nowrap",
                        ":hover": { backgroundColor: "var(--color-primary-dark)" }
                    }}
                >
                    Generate
                </Button>
            </Paper>

            {/* LOADING / ERRORS */}
            {loading && (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-error)",
                        color: "var(--color-text-light)"
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* GLOBAL NOTE */}
            {hasGenerated && !loading && safeResults.length > 0 && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)"
                    }}
                >
                    <strong>Note:</strong> "Unassigned" means that the staff or crane could not be assigned due to insufficient resources.
                </Alert>
            )}

            {hasGenerated && !loading && safeResults.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)"
                    }}
                >
                    No results.
                </Alert>
            )}

            {/* RESULTS */}
            {safeResults.map((dock, idx) => (
                <Paper
                    key={idx}
                    sx={{
                        p: 3,
                        mb: 4,
                        backgroundColor: "var(--color-background)",
                        borderRadius: "var(--radius-md)"
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            color: "var(--color-primary-light)",
                            fontWeight: 600
                        }}
                    >
                        Dock: {dock?.dockName ?? "Unknown"}
                    </Typography>

                    {/* IMPROVEMENT SUMMARY */}
                    <Paper
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: "var(--radius-sm)",
                            backgroundColor:
                                dock?.improvement?.delayReduction > 0
                                    ? "rgba(0,200,0,0.15)"
                                    : "rgba(180,180,180,0.15)"
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Optimization Summary
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <strong>Delay Reduction:</strong>{" "}
                                {dock?.improvement?.delayReduction ?? 0}h
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <strong>Improvement:</strong>{" "}
                                {dock?.improvement?.percentageImprovement ?? 0}%
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <strong>Additional Crane-Hours:</strong>{" "}
                                {dock?.improvement?.additionalCraneHours ?? 0}
                            </Grid>
                        </Grid>
                    </Paper>

                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        alignItems="flex-start"
                        sx={{ width: "100%", mt: 1 }}
                    >
                        {["singleCrane", "multiCrane"].map((type) => {
                            const schedules = dock?.[type]?.schedules ?? [];
                            const uncoveredHours = getUncoveredHoursWithDate(schedules);

                            return (
                                <Grid
                                    key={type}
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center"
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            width: "100%",
                                            maxWidth: 700,
                                            p: 2,
                                            mb: 2,
                                            backgroundColor: "var(--color-surface)",
                                            borderRadius: "var(--radius-sm)"
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            {type === "singleCrane" ? "Single-Crane Solution" : "Multi-Crane Solution"}
                                        </Typography>

                                        <div>
                                            <strong>Total Delay:</strong> {dock?.[type]?.delay ?? 0}h
                                        </div>
                                        <div>
                                            <strong>Crane Hours:</strong> {dock?.[type]?.craneHours ?? 0}
                                        </div>
                                        <div>
                                            <strong>Vessels:</strong> {schedules.length}
                                        </div>
                                    </Paper>

                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            width: "100%",
                                            maxWidth: 700,
                                            borderRadius: "var(--radius-sm)"
                                        }}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Delay [h]</TableCell>
                                                    {type === "multiCrane" && <TableCell sx={{ fontWeight: "bold" }}>Number of Cranes</TableCell>}
                                                    <TableCell sx={{ fontWeight: "bold" }}>Cranes</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {schedules.map((row, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{row.vessel}</TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor:
                                                                    row.start == null || row.start === "Unassigned" ? "var(--color-warning-bg)" : "inherit"
                                                            }}
                                                        >
                                                            {row.start ?? "Unassigned"}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor:
                                                                    row.end == null || row.end === "Unassigned" ? "var(--color-warning-bg)" : "inherit"
                                                            }}
                                                        >
                                                            {row.end ?? "Unassigned"}
                                                        </TableCell>
                                                        <TableCell>{row.delay}</TableCell>
                                                        {type === "multiCrane" && <TableCell>{row.cranes}</TableCell>}
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor:
                                                                    !row.craneCodes || row.craneCodes.length === 0 ? "var(--color-warning-bg)" : "inherit"
                                                            }}
                                                        >
                                                            {row.craneCodes?.join(", ") ?? "Unassigned"}
                                                        </TableCell>
                                                        <TableCell
                                                            sx={{
                                                                backgroundColor:
                                                                    !row.staff || row.staff.length === 0 ? "var(--color-warning-bg)" : "inherit"
                                                            }}
                                                        >
                                                            {Array.isArray(row.staff) && row.staff.length > 0
                                                                ? row.staff.map(s => s.shortName).join(", ")
                                                                : "Unassigned"}
                                                        </TableCell>
                                                        <TableCell>{row.area}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>
            ))}
        </Container>
    );
};

export default MultiCraneSchedule;
