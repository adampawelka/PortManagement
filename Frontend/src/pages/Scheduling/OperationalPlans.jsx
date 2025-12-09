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
    Select,
    MenuItem,
    InputLabel
} from "@mui/material";

import { useOperationalPlansVM } from "../../viewmodels/Scheduling/useOperationalPlansVM";

const OperationalPlans = () => {
    const {
        date,
        setDate,
        algorithm,
        setAlgorithm,
        mode,
        setMode,
        plans,
        loading,
        error,
        executionTime,
        generate
    } = useOperationalPlansVM();

    const [hasGenerated, setHasGenerated] = useState(false);

    const handleGenerate = () => {
        if (!date) {
            alert("Please select a date");
            return;
        }

        if (mode === "single" && !algorithm) {
            alert("Please select an algorithm");
            return;
        }

        setHasGenerated(true);
        generate();
    };

    const handleModeChange = (e) => {
        const newMode = e.target.value;
        setMode(newMode);

        if (newMode === "multi") {
            setAlgorithm("multi_crane");
        } else {
            setAlgorithm("");
        }
    };

    const singleCraneAlgorithms = [
        <MenuItem key="optimal" value="optimal">Optimal</MenuItem>,
        <MenuItem key="heuristic_edt" value="heuristic_edt">
            EDT – Early Departure Time (heuristic)
        </MenuItem>,
        <MenuItem key="heuristic_spt" value="heuristic_spt">
            SPT – Shortest Processing Time
        </MenuItem>,
        <MenuItem key="heuristic_dynamic_mst" value="heuristic_dynamic_mst">
            Dynamic MST – Minimum Slack Time
        </MenuItem>
    ];

    const multiCraneAlgorithms = [
        <MenuItem key="multi_crane" value="multi_crane">Multi-Crane Scheduler</MenuItem>
    ];

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
            {/* Header */}
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
                Operational Plans ({plans.length})
            </Typography>

            {/* Control Bar */}
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

                {/* Mode */}
                <FormControl sx={{ width: 250 }}>
                    <InputLabel size="small">Mode</InputLabel>
                    <Select
                        size="small"
                        label="Mode"
                        value={mode}
                        onChange={handleModeChange}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                        }}
                    >
                        <MenuItem value="single">Single-Crane</MenuItem>
                        <MenuItem value="multi">Multi-Crane</MenuItem>
                    </Select>
                </FormControl>

                {/* Algorithm */}
                <FormControl sx={{ width: 260 }}>
                    <InputLabel size="small">Algorithm</InputLabel>
                    <Select
                        size="small"
                        label="Algorithm"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                        }}
                    >
                        {mode === "single" ? singleCraneAlgorithms : multiCraneAlgorithms}
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

            {/* Execution time */}
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

            {/* Loading */}
            {loading && (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            )}

            {/* Error */}
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

            {/* Empty */}
            {hasGenerated && !loading && plans.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    No operation plans found.
                </Alert>
            )}

            {/* Results */}
            {plans.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>VVN</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Crane</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Area</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Operations</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {plans.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "var(--color-background)",
                                        }
                                    }}
                                >
                                    <TableCell>{row.vvnId}</TableCell>
                                    <TableCell>{row.vesselName}</TableCell>
                                    <TableCell>{row.dock}</TableCell>
                                    <TableCell>{row.crane}</TableCell>
                                    <TableCell>{row.area}</TableCell>
                                    <TableCell>
                                        {row.operations.map((op, idx) => (
                                            <div key={idx}>
                                                {op.vessel}: {op.start} → {op.end}
                                            </div>
                                        ))}
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

export default OperationalPlans;
