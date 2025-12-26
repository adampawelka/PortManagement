import React, { useState } from "react";
import {
  Container, Typography, CircularProgress, Alert, Paper,
  Table, TableHead, TableRow, TableCell, TableBody,
  FormControl, TextField, Button, Box, TableSortLabel,
  Select, MenuItem, InputLabel
} from "@mui/material";
import { useOperationalPlanSearchVM } from "../../viewmodels/OperationalPlans/useOperationalPlanSearchVM";

const OperationalPlanSearch = () => {
  const {
    plans,
    loading,
    error,
    search,
    filterField,
    setFilterField,
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

  const handleSearch = () => {
    if (!dateStart || !dateEnd) return alert("Select both start and end dates.");
    setHasSearched(true);
    search({ dateStart, dateEnd });
  };

  const handleClearFilters = () => {
    setFilterQuery("");
    setFilterField("");
    setDateStart("");
    setDateEnd("");
    setHasSearched(false);
  };

  const isSortable = plans.length > 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Operational Plans
      </Typography>

      <Paper sx={{ p: 3, mb: 3, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <FormControl>
          <TextField
            label="Start Date"
            type="date"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="End Date"
            type="date"
            value={dateEnd}
            onChange={e => setDateEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>

        <Button variant="contained" onClick={handleSearch}>Search</Button>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>Clear Filters</Button>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filterField}
            onChange={e => {
              setFilterField(e.target.value);
              setFilterQuery("");
            }}
            label="Filter by"
          >
            <MenuItem value="vesselName">Vessel Name</MenuItem>
            <MenuItem value="start">Start Time</MenuItem>
            <MenuItem value="expectedDelay">Expected Delay</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter value</InputLabel>
          <Select
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            label="Filter value"
            disabled={!filterField}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && hasSearched && plans.length === 0 && !error &&
        <Alert severity="info" sx={{ textAlign: "center" }}>No operational plans found.</Alert>
      }

      {plans.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {plans.map((plan, idx) => (
            <Paper key={idx} sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>{plan.vesselName}</Typography>
              <Typography sx={{ mb: 1 }}>VVN {plan.vvnId}</Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={sortField === "start" ? sortDirection : false}>
                      {isSortable ? (
                        <TableSortLabel
                          active={sortField === "start"}
                          direction={sortField === "start" ? sortDirection : "asc"}
                          onClick={() => setSort("start")}
                        >
                          Start
                        </TableSortLabel>
                      ) : "Start"}
                    </TableCell>
                    <TableCell>End</TableCell>
                    <TableCell sortDirection={sortField === "expectedDelay" ? sortDirection : false}>
                      {isSortable ? (
                        <TableSortLabel
                          active={sortField === "expectedDelay"}
                          direction={sortField === "expectedDelay" ? sortDirection : "asc"}
                          onClick={() => setSort("expectedDelay")}
                        >
                          Expected Delay
                        </TableSortLabel>
                      ) : "Expected Delay"}
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
