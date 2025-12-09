import React from "react";
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

const MultiCraneSchedule = () => {
    const {
        targetDate,
        setTargetDate,
        scheduleResults = [],
        loading,
        error,
        generateSchedule
    } = useScheduleMultiCraneVM();

    // ▶️ ważne: dopiero po kliknięciu Generate pokazujemy brak wyników
    const [hasGenerated, setHasGenerated] = React.useState(false);

    const handleGenerate = () => {
        if (!targetDate) {
            alert("Please select a date");
            return;
        }
        setHasGenerated(true);
        generateSchedule();
    };

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
                    fontSize: "var(--font-size-heading)"
                }}
            >
                Multi-Crane Scheduling ({scheduleResults?.length ?? 0})
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

            {/* LOADING */}
            {loading && (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            )}

            {/* ERROR */}
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

            {/* EMPTY (pokazujemy dopiero po kliknięciu Generate) */}
            {hasGenerated &&
                !loading &&
                !error &&
                (scheduleResults?.length ?? 0) === 0 && (
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
            {scheduleResults?.map?.((dock, idx) => (
                <Paper
                    key={idx}
                    sx={{
                        p: 3,
                        mb: 4,
                        backgroundColor: "var(--color-background)",
                        borderRadius: "var(--radius-md)"
                    }}
                >
                    {/* DOCK TITLE */}
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
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 1 }}
                        >
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

                    <Grid container spacing={3}>

                        {/* SINGLE CRANE */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 1 }}
                            >
                                Single-Crane Solution
                            </Typography>

                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: "var(--color-surface)",
                                    borderRadius: "var(--radius-sm)"
                                }}
                            >
                                <div><strong>Total Delay:</strong> {dock?.singleCrane?.delay ?? 0}h</div>
                                <div><strong>Crane Hours:</strong> {dock?.singleCrane?.craneHours ?? 0}</div>
                                <div><strong>Vessels:</strong> {dock?.singleCrane?.schedules?.length ?? 0}</div>
                            </Paper>

                            <TableContainer component={Paper} sx={{
                                borderRadius: "var(--radius-sm)",
                                display: "flex",
                                justifyContent: "center",
                                p: 2
                            }}>
                                <Table size="small" sx={{ textAlign: "center" }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                            <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Crane</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dock?.singleCrane?.schedules?.map?.((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.vessel}</TableCell>
                                                <TableCell>{row.start}</TableCell>
                                                <TableCell>{row.end}</TableCell>
                                                <TableCell>{row.crane}</TableCell>
                                                <TableCell>{row.staff}</TableCell>
                                                <TableCell>{row.area}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* MULTI-CRANE */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 1 }}
                            >
                                Multi-Crane Solution
                            </Typography>

                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: "var(--color-surface)",
                                    borderRadius: "var(--radius-sm)"
                                }}
                            >
                                <div><strong>Total Delay:</strong> {dock?.multiCrane?.delay ?? 0}h</div>
                                <div><strong>Crane Hours:</strong> {dock?.multiCrane?.craneHours ?? 0}</div>
                                <div><strong>Vessels:</strong> {dock?.multiCrane?.schedules?.length ?? 0}</div>
                            </Paper>

                            <TableContainer component={Paper} sx={{
                                borderRadius: "var(--radius-sm)",
                                display: "flex",
                                justifyContent: "center",
                                p: 2
                            }}>
                                <Table size="small" sx={{ textAlign: "center" }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                            <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Cranes</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dock?.multiCrane?.schedules?.map?.((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.vessel}</TableCell>
                                                <TableCell>{row.start}</TableCell>
                                                <TableCell>{row.end}</TableCell>
                                                <TableCell>{row.cranes}</TableCell>
                                                <TableCell>{row.staff}</TableCell>
                                                <TableCell>{row.area}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                    </Grid>
                </Paper>
            ))}

        </Container>
    );
};

export default MultiCraneSchedule;
