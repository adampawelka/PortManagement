import React, { useState } from "react";
import {
    Container, Typography, CircularProgress, Alert, Paper,
    Table, TableHead, TableRow, TableCell, TableBody,
    FormControl, TextField, Button, Box
} from "@mui/material";
import { useOperationalPlanSearchVM } from "../../viewmodels/OperationalPlans/useOperationalPlanSearchVM";

const OperationalPlanSearch = () => {
    const { plans, loading, error, search } = useOperationalPlanSearchVM();

    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!dateStart) return alert("Please select a start date.");
        if (!dateEnd) return alert("Please select an end date.");

        setHasSearched(true);
        search({ dateStart, dateEnd });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
                Operational Plans ({plans.length})
            </Typography>

            {/* Controls */}
            <Paper sx={{ p: 3, mb: 3, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                <FormControl>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="End Date"
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                </FormControl>

                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Paper>

            {/* Loading/Error */}
            {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && hasSearched && plans.length === 0 && !error && (
                <Alert severity="info" sx={{ textAlign: "center" }}>
                    No operational plans found.
                </Alert>
            )}

            {/* Results */}
            {plans.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {plans.map((plan, idx) => (
                        <Paper key={idx} sx={{ p: 2 }}>
                            <Typography sx={{ fontWeight: 600 }}>{plan.vesselName}</Typography>
                            <Typography sx={{ mb: 1 }}>VVN {plan.vvnId}</Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Start</TableCell>
                                        <TableCell>End</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plan.operations.map((op, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{op.start}</TableCell>
                                            <TableCell>{op.end}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default OperationalPlanSearch;
