import React, { useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
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
    InputLabel,
    Box
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
        if (!date) return alert("Please select a date");
        if (mode === "single" && !algorithm) return alert("Please select an algorithm");

        setHasGenerated(true);
        generate();
    };

    const handleModeChange = (e) => {
        const newMode = e.target.value;
        setMode(newMode);
        setAlgorithm(newMode === "multi" ? "multi_crane" : "");
    };

    const singleCraneAlgorithms = [
        { value: "optimal", label: "Optimal" },
        { value: "heuristic_edt", label: "EDT – Early Departure Time" },
        { value: "heuristic_spt", label: "SPT – Shortest Processing Time" },
        { value: "heuristic_dynamic_mst", label: "Dynamic MST – Minimum Slack Time" },
    ];

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                p: 4,
                borderRadius: "var(--radius-lg)",
                fontFamily: "var(--font-family-base)",
                background: "linear-gradient(135deg, #f4f0ff 0%, #ffffff 60%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
        >
            {/* ========================= HEADER ========================= */}
            <Typography
                variant="h4"
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: "var(--font-size-heading)",
                }}
            >
                Operational Plans ({plans.length})
            </Typography>

            {/* ========================= CONTROL BAR ========================= */}
            <Paper
                sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: "var(--radius-md)",
                    background: "linear-gradient(180deg, #ffffff 0%, #f7f4ff 100%)",
                    border: "1px solid rgba(46,13,122,0.08)",
                    boxShadow: "0 3px 14px rgba(46,13,122,0.08)",
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
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
                        sx={{ backgroundColor: "white" }}
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
                        sx={{ backgroundColor: "white" }}
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
                        sx={{ backgroundColor: "white" }}
                    >
                        {mode === "single"
                            ? singleCraneAlgorithms.map(a => (
                                <MenuItem key={a.value} value={a.value}>
                                    {a.label}
                                </MenuItem>
                            ))
                            : <MenuItem value="multi_crane">Multi-Crane Scheduler</MenuItem>
                        }
                    </Select>
                </FormControl>

                {/* Button */}
                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    sx={{
                        px: 3,
                        height: 40,
                        whiteSpace: "nowrap",
                        backgroundColor: "var(--color-primary)",
                        ":hover": { backgroundColor: "var(--color-primary-dark)" },
                    }}
                >
                    Generate
                </Button>
            </Paper>

            {/* ========================= EXECUTION TIME ========================= */}
            {executionTime && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Execution Time: {executionTime}s
                </Alert>
            )}

            {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {hasGenerated && !loading && plans.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No operation plans found.
                </Alert>
            )}

            {/* ========================= RESULTS ========================= */}
            {plans.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        mt: 4,
                    }}
                >
                    {plans.map((plan, index) => (
                        <Paper
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: 760,
                                p: 3,
                                mb: 4,
                                borderRadius: "var(--radius-lg)",
                                background: "linear-gradient(180deg, #ffffff 0%, #f7f4ff 100%)",
                                border: "1px solid rgba(46,13,122,0.08)",
                                boxShadow: "0 6px 22px rgba(46,13,122,0.08)",
                            }}
                        >
                            {/* -------- HEADER -------- */}
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    color: "var(--color-primary)",
                                    fontSize: "1.15rem",
                                    mb: 0.5,
                                }}
                            >
                                {plan.vesselName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "var(--font-size-small)",
                                    opacity: 0.65,
                                    mb: 2,
                                }}
                            >
                                VVN {plan.vvnId}
                            </Typography>

                            {/* -------- RESOURCES -------- */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1.5,
                                        color: "var(--color-primary-light)",
                                        fontSize: "var(--font-size-base)"
                                    }}
                                >
                                    Resources
                                </Typography>

                                <Box
                                    sx={{
                                        background: "var(--color-surface)",
                                        borderRadius: "var(--radius-md)",
                                        padding: "var(--spacing-md)",
                                        border: "1px solid rgba(46,13,122,0.12)",
                                        boxShadow: "0 2px 8px rgba(46,13,122,0.08)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "160px 1fr",
                                            rowGap: "var(--spacing-sm)",
                                            columnGap: "var(--spacing-md)",
                                            fontSize: "var(--font-size-small)",
                                            color: "var(--color-text-dark)",
                                        }}
                                    >
                                        <Box sx={{ fontWeight: 600, opacity: 0.8 }}>Dock</Box>
                                        <Box>{plan.dock}</Box>

                                        <Box sx={{ fontWeight: 600, opacity: 0.8 }}>Crane</Box>
                                        <Box>{plan.crane}</Box>

                                        <Box sx={{ fontWeight: 600, opacity: 0.8 }}>Area</Box>
                                        <Box>{plan.area}</Box>
                                    </Box>
                                </Box>
                            </Box>


                            {/* -------- OPERATIONS -------- */}
                            <Box>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: "var(--color-primary-light)",
                                    }}
                                >
                                    Operations
                                </Typography>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Start</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>End</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {plan.operations.map((op, i) => (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    backgroundColor: "var(--color-background)",
                                                    "& td": {
                                                        borderBottom: "none"
                                                    },
                                                }}
                                            >
                                                <TableCell>{op.start}</TableCell>
                                                <TableCell>{op.end}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default OperationalPlans;
