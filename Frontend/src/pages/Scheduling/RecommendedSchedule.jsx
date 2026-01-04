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
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from "@mui/material";

import { useRecommendedScheduleVM } from "../../viewmodels/Scheduling/useRecommendedScheduleVM";

const RecommendedSchedulePage = () => {
    const [date, setDate] = useState("");
    const [overrideAlgo, setOverrideAlgo] = useState("");
    const [hasGenerated, setHasGenerated] = useState(false);

    const {
        loading,
        error,
        results,
        executionTime,
        algorithm,
        reason,
        generate
    } = useRecommendedScheduleVM();

    const handleGenerate = () => {
        if (!date) {
            alert("Please select a date");
            return;
        }
        setHasGenerated(true);
        const iso = new Date(date).toISOString().split("T")[0];
        generate(iso, overrideAlgo);
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
                Recommended Schedule ({results.length})
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
                <FormControl sx={{ width: 250 }}>
                    <TextField
                        type="date"
                        size="small"
                        label="Target Date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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

                <FormControl size="small" sx={{ width: 250 }}>
                    <InputLabel sx={{ fontSize: "0.85rem" }}>Algorithm Override</InputLabel>
                    <Select
                        value={overrideAlgo}
                        label="Algorithm Override"
                        onChange={(e) => setOverrideAlgo(e.target.value)}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                            "& .MuiSelect-select": {
                                padding: "6px 10px",
                                fontSize: "0.85rem",
                            }
                        }}
                    >
                        <MenuItem value="">Auto (Recommended)</MenuItem>
                        <MenuItem value="optimal">Optimal</MenuItem>
                        <MenuItem value="heuristic">Heuristic</MenuItem>
                        <MenuItem value="genetic">Genetic</MenuItem>
                    </Select>
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

            {/* Algorithm info */}
            {algorithm && (
                <Alert
                    severity="info"
                    aria-live="polite"
                    sx={{
                        mb: 3,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                        fontSize: "var(--font-size-body)",
                    }}
                >
                    {executionTime && <div>Execution Time: {executionTime}s</div>}
                </Alert>
            )}

            <strong>Selected Algorithm:</strong> {algorithm} <br />
            <em>{reason}</em>

            {loading && (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            )}

            {error && (
                <Alert
                    severity="error"
                    aria-live="assertive"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-error)",
                        color: "var(--color-text-light)",
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Alert dla Unassigned */}
            {hasGenerated && !loading && results.length > 0 && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    <strong>Note:</strong> "Unassigned" means that the crane or staff could not be assigned due to insufficient resources.
                </Alert>
            )}

            {/* Alert brak wyników */}
            {hasGenerated && !loading && results.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    No schedule results available.
                </Alert>
            )}

            {/* Results table */}
            {results.length > 0 && (
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
                            {results.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        "&:hover": { backgroundColor: "var(--color-background)" },
                                    }}
                                >
                                    <TableCell>{row.vessel}</TableCell>

                                    <TableCell

                                    >
                                        {row.start}
                                    </TableCell>

                                    <TableCell

                                    >
                                        {row.end}
                                    </TableCell>

                                    <TableCell>{row.delay}</TableCell>

                                    <TableCell
                                    >{row.dock}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                !row.crane || row.crane.length === 0
                                                    ? "var(--color-warning-bg)"
                                                    : "inherit"
                                        }}
                                    >
                                        {row.crane ?? "Unassigned"}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                !row.staff || row.staff.length === 0
                                                    ? "var(--color-warning-bg)"
                                                    : "inherit"
                                        }}
                                    >
                                        {row.staff && row.staff.length > 0
                                            ? row.staff.join(", ")
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

export default RecommendedSchedulePage;
