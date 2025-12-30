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
    Button
} from "@mui/material";

import { useOptimalScheduleVM } from "../../viewmodels/Scheduling/useOptimalScheduleVM";

const OptimalSchedule = () => {
    const {
        targetDate,
        setTargetDate,
        scheduleResults,
        loading,
        error,
        executionTime,
        generateSchedule
    } = useOptimalScheduleVM();

    const [hasGenerated, setHasGenerated] = useState(false);

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
                fontFamily: "var(--font-family-base)",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: "var(--font-size-heading)",
                }}
            >
                Optimal Schedule ({scheduleResults.length})
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
                                fontSize: "0.85rem",
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: "0.85rem",
                            },
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
                        ":hover": { backgroundColor: "var(--color-primary-dark)" },
                    }}
                >
                    Generate
                </Button>
            </Paper>

            {executionTime && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    Execution Time: {executionTime}s
                </Alert>
            )}

            {loading && (
                <CircularProgress
                    sx={{ display: "block", margin: "20px auto" }}
                />
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-error)",
                        color: "var(--color-text-light)",
                    }}
                >
                    {error}
                </Alert>
            )}

            {hasGenerated && !loading && scheduleResults.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    No schedule results.
                </Alert>
            )}

            {scheduleResults.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Delay</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Crane</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scheduleResults.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "var(--color-background)",
                                        }
                                    }}
                                >
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

                                    <TableCell>{row.dock ?? "Unassigned"}</TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                !row.crane || row.crane.length === 0 ? "var(--color-warning-bg)" : "inherit"
                                        }}
                                    >
                                        {row.crane ?? "Unassigned"}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                !row.staff || row.staff.length === 0 ? "var(--color-warning-bg)" : "inherit"
                                        }}
                                    >
                                        {Array.isArray(row.staff) && row.staff.length > 0
                                            ? row.staff.map(s => s.shortName ?? s).join(", ")
                                            : "Unassigned"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default OptimalSchedule;
