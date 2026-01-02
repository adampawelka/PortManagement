import React, { useState, useMemo } from "react";
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
    Button,
    Box,
    TableSortLabel
} from "@mui/material";

import { useOperationalPlanSearchVM } from "../../viewmodels/OperationalPlans/useOperationalPlanSearchVM";

const OperationalPlanSearch = () => {
    const {
        plans,
        loading,
        error,
        search,
        filterQuery,
        setFilterQuery,
        sortField,
        sortDirection,
        setSort,
        filterOptions
    } = useOperationalPlanSearchVM();

    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [planSortField, setPlanSortField] = useState("vesselName");
    const [planSortDirection, setPlanSortDirection] = useState("asc");

    const handleSearch = () => {
        if (!dateStart || !dateEnd) return alert("Select both start and end dates.");
        setHasSearched(true);
        search({ dateStart, dateEnd });
    };

    const handleClearFilters = () => {
        setFilterQuery("");
        setDateStart("");
        setDateEnd("");
        setHasSearched(false);
    };

    // Sort plans
    const sortedPlans = useMemo(() => {
        return [...plans].sort((a, b) => {
            let aValue, bValue;
            if (planSortField === "vesselName") {
                aValue = a.vesselName.toLowerCase();
                bValue = b.vesselName.toLowerCase();
            } else if (planSortField === "start") {
                aValue = a.operations[0]?.start || "";
                bValue = b.operations[0]?.start || "";
            } else if (planSortField === "end") {
                aValue = a.operations[a.operations.length - 1]?.end || "";
                bValue = b.operations[b.operations.length - 1]?.end || "";
            }

            if (aValue < bValue) return planSortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return planSortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [plans, planSortField, planSortDirection]);

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
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: 3,
                    fontSize: "var(--font-size-heading)"
                }}
            >
                Operational Plans ({plans.length})
            </Typography>

            {/* Filters */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "var(--color-background)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    gap: "var(--spacing-md)",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}
            >
                <FormControl sx={{ width: 200 }}>
                    <TextField
                        type="date"
                        size="small"
                        label="Operation Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                            "& .MuiInputBase-input": { padding: "6px 10px", fontSize: "0.85rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" }
                        }}
                    />
                </FormControl>

                <FormControl sx={{ width: 200 }}>
                    <TextField
                        type="date"
                        size="small"
                        label="Operation End Date"
                        InputLabelProps={{ shrink: true }}
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                            "& .MuiInputBase-input": { padding: "6px 10px", fontSize: "0.85rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" }
                        }}
                    />
                </FormControl>

                <FormControl sx={{ width: 200 }}>
                    <InputLabel sx={{ fontSize: "0.85rem" }}>Filter by Vessel</InputLabel>
                    <Select
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        sx={{
                            backgroundColor: "var(--color-surface)",
                            "& .MuiSelect-select": { padding: "6px 10px", fontSize: "0.85rem" }
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {filterOptions.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        py: 1,
                        px: 3,
                        fontSize: "0.85rem",
                        backgroundColor: "var(--color-primary)",
                        ":hover": { backgroundColor: "var(--color-primary-light)" }
                    }}
                >
                    Search
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{
                        py: 1,
                        px: 3,
                        fontSize: "0.85rem",
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                        ":hover": { backgroundColor: "var(--color-primary-light)", color: "var(--color-text-light)" }
                    }}
                >
                    Clear
                </Button>
            </Paper>

            {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />}

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

            {!loading && hasSearched && plans.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info-bg)",
                        color: "var(--color-text-dark)"
                    }}
                >
                    No operational plans found.
                </Alert>
            )}

            {/* Plan Sort */}
            {plans.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <FormControl sx={{ width: 200 }}>
                        <InputLabel sx={{ fontSize: "0.85rem" }}>Sort Plans By</InputLabel>
                        <Select
                            value={planSortField}
                            onChange={(e) => setPlanSortField(e.target.value)}
                            sx={{
                                backgroundColor: "var(--color-surface)",
                                "& .MuiSelect-select": { padding: "6px 10px", fontSize: "0.85rem" }
                            }}
                        >
                            <MenuItem value="vesselName">Vessel Name</MenuItem>
                            <MenuItem value="start">Start Date</MenuItem>
                            <MenuItem value="end">End Date</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        sx={{ ml: 2, py: 1, px: 3, fontSize: "0.85rem" }}
                        onClick={() =>
                            setPlanSortDirection(planSortDirection === "asc" ? "desc" : "asc")
                        }
                    >
                        {planSortDirection === "asc" ? "Asc" : "Desc"}
                    </Button>
                </Box>
            )}

            {/* Plans Table */}
            {sortedPlans.length > 0 && sortedPlans.map((plan, idx) => (
                <Paper key={idx} sx={{ p: 2, mb: 3, borderRadius: "var(--radius-sm)", backgroundColor: "var(--color-surface)" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "var(--font-size-heading)", mb: 1 }}>
                        {plan.vesselName} (VVN {plan.vvnId})
                    </Typography>

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>
                                        <TableSortLabel
                                            active={sortField === "start"}
                                            direction={sortField === "start" ? sortDirection : "asc"}
                                            onClick={() => setSort("start")}
                                        >
                                            Start
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>End</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "var(--font-size-table-header)" }}>
                                        <TableSortLabel
                                            active={sortField === "expectedDelay"}
                                            direction={sortField === "expectedDelay" ? sortDirection : "asc"}
                                            onClick={() => setSort("expectedDelay")}
                                        >
                                            Expected Delay
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plan.operations.map((op, i) => (
                                    <TableRow key={i} sx={{ "&:hover": { backgroundColor: "var(--color-background)" } }}>
                                        <TableCell>{op.start}</TableCell>
                                        <TableCell>{op.end}</TableCell>
                                        <TableCell>{op.expectedDelay || "-"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ))}
        </Container>
    );
};

export default OperationalPlanSearch;
