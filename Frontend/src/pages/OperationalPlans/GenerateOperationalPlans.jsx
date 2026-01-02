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

import { useOperationalPlansVM } from "../../viewmodels/OperationalPlans/useGenerateOperationalPlansVM";

const OperationalPlansGenerate = () => {
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
        generate,
        savePlans,
        saving,
        saveSuccess
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
        { value: "heuristic", label: "Heuristic" },
    ];

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                p: "var(--spacing-xl)",
                borderRadius: "var(--radius-lg)",
                fontFamily: "var(--font-family-base)",
                background: "linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 60%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                color: "var(--color-text-dark)"
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: "var(--spacing-lg)",
                    fontSize: "var(--font-size-heading)"
                }}
            >
                Operational Plans ({plans.length})
            </Typography>

            {/* CONTROLS PANEL */}
            <Paper
                sx={{
                    p: "var(--spacing-md)",
                    mb: "var(--spacing-xl)",
                    borderRadius: "var(--radius-md)",
                    background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-background) 100%)",
                    border: "1px solid rgba(46,13,122,0.08)",
                    boxShadow: "0 3px 14px rgba(46,13,122,0.08)",
                    display: "flex",
                    gap: "var(--spacing-md)",
                    flexWrap: "wrap",
                    justifyContent: "center"
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
                        sx={{ backgroundColor: "var(--color-surface)" }}
                    />
                </FormControl>

                <FormControl sx={{ width: 250 }}>
                    <InputLabel size="small">Mode</InputLabel>
                    <Select
                        size="small"
                        value={mode}
                        onChange={handleModeChange}
                        sx={{ backgroundColor: "var(--color-surface)" }}
                    >
                        <MenuItem value="single">Single-Crane</MenuItem>
                        <MenuItem value="multi">Multi-Crane</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ width: 260 }}>
                    <InputLabel size="small">Algorithm</InputLabel>
                    <Select
                        size="small"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        sx={{ backgroundColor: "var(--color-surface)" }}
                    >
                        {mode === "single"
                            ? singleCraneAlgorithms.map(a => (
                                <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
                            ))
                            : <MenuItem value="multi_crane">Multi-Crane Scheduler</MenuItem>
                        }
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleGenerate}
                    sx={{
                        px: "var(--spacing-md)",
                        height: 40,
                        whiteSpace: "nowrap",
                        backgroundColor: "var(--color-primary)",
                        ":hover": { backgroundColor: "var(--color-primary-light)" },
                        color: "var(--color-text-light)",
                    }}
                >
                    Generate
                </Button>
            </Paper>

            {executionTime && (
                <Alert severity="info" sx={{ mb: "var(--spacing-lg)", backgroundColor: "var(--color-info-bg)", color: "var(--color-text-dark)", fontWeight: 500 }}>
                    Execution Time: {executionTime}s
                </Alert>
            )}

            {saveSuccess && (
                <Alert severity="success" sx={{ mb: "var(--spacing-lg)", backgroundColor: "var(--color-success-bg)", color: "var(--color-text-dark)", fontWeight: 500 }}>
                    Operation plans saved successfully! You can now search for them.
                </Alert>
            )}

            {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: "var(--spacing-lg)", backgroundColor: "var(--color-error-bg)", color: "var(--color-text-dark)", fontWeight: 500 }}>
                    {error}
                </Alert>
            )}

            {hasGenerated && !loading && plans.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: "var(--spacing-lg)", backgroundColor: "var(--color-info-bg)", color: "var(--color-text-dark)", fontWeight: 500 }}>
                    No operation plans found.
                </Alert>
            )}

            {plans.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", mt: "var(--spacing-xl)" }}>
                    <Box sx={{ width: "100%", maxWidth: 760, mb: "var(--spacing-md)", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={savePlans}
                            disabled={saving || plans.length === 0}
                            sx={{
                                px: "var(--spacing-md)",
                                height: 40,
                                backgroundColor: "var(--color-primary)",
                                ":hover": { backgroundColor: "var(--color-primary-light)" },
                                color: "var(--color-text-light)",
                            }}
                        >
                            {saving ? "Saving..." : "Save Plans"}
                        </Button>
                    </Box>
                    {plans.map((plan, index) => (
                        <Paper
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: 760,
                                p: "var(--spacing-lg)",
                                mb: "var(--spacing-xl)",
                                borderRadius: "var(--radius-lg)",
                                background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-background) 100%)",
                                border: "1px solid rgba(46,13,122,0.08)",
                                boxShadow: "0 6px 22px rgba(46,13,122,0.08)"
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, color: "var(--color-primary)", fontSize: "var(--font-size-large)", mb: "var(--spacing-xs)" }}>
                                {plan.vesselName}
                            </Typography>

                            <Typography sx={{ fontSize: "var(--font-size-small)", opacity: 0.65, mb: "var(--spacing-md)" }}>
                                VVN {plan.vvnId || "N/A"}
                            </Typography>

                            {/* RESOURCES */}
                            <Box sx={{ mb: "var(--spacing-lg)" }}>
                                <Typography sx={{ fontWeight: 600, mb: "var(--spacing-sm)", textAlign: "center", color: "var(--color-primary-light)", fontSize: "var(--font-size-base)" }}>
                                    Resources
                                </Typography>

                                <Box sx={{ background: "var(--color-surface)", borderRadius: "var(--radius-md)", padding: "var(--spacing-md)", border: "1px solid rgba(46,13,122,0.12)", boxShadow: "0 2px 8px rgba(46,13,122,0.06)" }}>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "16px", columnGap: "12px", alignItems: "center", textAlign: "center", fontSize: "var(--font-size-base)" }}>
                                        <Box sx={{ opacity: 0.7, fontWeight: 600 }}>Dock</Box>
                                        <Box sx={{ fontWeight: 600, opacity: 0.9 }}>{plan.dock || "Unassigned"}</Box>

                                        <Box sx={{ opacity: 0.7, fontWeight: 600 }}>Cranes</Box>
                                        <Box sx={{ fontWeight: 600, opacity: 0.9 }}>{plan.crane || "Unassigned"}</Box>

                                        <Box sx={{ opacity: 0.7, fontWeight: 600 }}>Staff</Box>
                                        <Box sx={{ fontWeight: 600, opacity: 0.9 }}>
                                            {Array.isArray(plan.staff) && plan.staff.length > 0
                                                ? plan.staff.join(", ")
                                                : "Unassigned"}
                                        </Box>


                                    </Box>
                                </Box>
                            </Box>

                            {/* OPERATIONS */}
                            <Box>
                                <Typography sx={{ fontWeight: 600, mb: "var(--spacing-sm)", color: "var(--color-primary-light)" }}>
                                    Operations
                                </Typography>

                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Start</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>End</TableCell>
                                            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Delay [h]</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(plan.operations || []).map((op, i) => (
                                            <TableRow key={i} sx={{ backgroundColor: "var(--color-surface)", "& td": { borderBottom: "none", textAlign: "center", padding: "10px 0" } }}>
                                                <TableCell>{op.start?.toLocaleString()}</TableCell>
                                                <TableCell>{op.end?.toLocaleString()}</TableCell>

                                                <TableCell>{op.delay ?? 0}</TableCell>
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

export default OperationalPlansGenerate;
