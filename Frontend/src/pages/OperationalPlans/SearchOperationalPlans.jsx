import React, { useState, useMemo } from "react";
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
  Box,
  TableSortLabel,
  Select,
  MenuItem,
  InputLabel,
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
    filterOptions,
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

  // Sort plans before rendering
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
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Operational Plans
      </Typography>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
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

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Vessel</InputLabel>
          <Select
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            label="Filter by Vessel"
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Clear
        </Button>
      </Paper>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && hasSearched && plans.length === 0 && !error && (
        <Alert severity="info" sx={{ textAlign: "center" }}>
          No operational plans found.
        </Alert>
      )}

      {/* Plan Sort */}
      {plans.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Sort Plans By</InputLabel>
            <Select
              value={planSortField}
              onChange={(e) => setPlanSortField(e.target.value)}
              label="Sort Plans By"
            >
              <MenuItem value="vesselName">Vessel Name</MenuItem>
              <MenuItem value="start">Start Date</MenuItem>
              <MenuItem value="end">End Date</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() =>
              setPlanSortDirection(planSortDirection === "asc" ? "desc" : "asc")
            }
          >
            {planSortDirection === "asc" ? "Asc" : "Desc"}
          </Button>
        </Box>
      )}

      {/* Plans */}
      {sortedPlans.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sortedPlans.map((plan, idx) => (
            <Paper key={idx} sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>{plan.vesselName}</Typography>
              <Typography sx={{ mb: 1 }}>VVN {plan.vvnId}</Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sortDirection={sortField === "start" ? sortDirection : false}
                    >
                      <TableSortLabel
                        active={sortField === "start"}
                        direction={sortField === "start" ? sortDirection : "asc"}
                        onClick={() => setSort("start")}
                      >
                        Start
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>End</TableCell>
                    <TableCell
                      sortDirection={sortField === "expectedDelay" ? sortDirection : false}
                    >
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
                    <TableRow key={i}>
                      <TableCell>{op.start}</TableCell>
                      <TableCell>{op.end}</TableCell>
                      <TableCell>{op.expectedDelay || "-"}</TableCell>
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
