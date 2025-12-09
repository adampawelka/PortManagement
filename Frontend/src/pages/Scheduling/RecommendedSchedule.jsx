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
                {/* Date */}
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

                {/* Algorithm selector */}
                <FormControl size="small" sx={{ width: 250 }}>
                    <InputLabel sx={{ fontSize: "0.85rem" }}>
                        Algorithm Override
                    </InputLabel>
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

                {/* Button */}
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
                    <strong>Selected Algorithm:</strong> {algorithm} <br />
                    <em>{reason}</em>
                    {executionTime && <div>Execution Time: {executionTime}s</div>}
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

            {!loading && results.length === 0 && !error && algorithm && (
                <Alert
                    severity="info"
                    aria-live="polite"
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
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Vessel</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Dock</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Crane</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Start</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>End</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Staff</TableCell>
                                <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>Area</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        "&:hover": { backgroundColor: "var(--color-background)" }
                                    }}
                                >
                                    <TableCell>{row.vessel}</TableCell>
                                    <TableCell>{row.dock}</TableCell>
                                    <TableCell>{row.crane}</TableCell>
                                    <TableCell>{row.start}</TableCell>
                                    <TableCell>{row.end}</TableCell>
                                    <TableCell>{row.staff}</TableCell>
                                    <TableCell>{row.area}</TableCell>
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
