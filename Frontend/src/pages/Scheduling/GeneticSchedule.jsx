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
    Box,
    Grid,
    Card,
    CardContent,
    Slider,
    Chip,
    IconButton,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestoreIcon from "@mui/icons-material/Restore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TimelineIcon from "@mui/icons-material/Timeline";

import { useGeneticScheduleVM } from "../../viewmodels/Scheduling/useGeneticScheduleVM";

const GeneticSchedule = () => {
    const {
        targetDate,
        setTargetDate,
        scheduleResults,
        loading,
        error,
        executionTime,
        totalDelay,
        
        populationSize,
        setPopulationSize,
        generations,
        setGenerations,
        crossoverRate,
        setCrossoverRate,
        mutationRate,
        setMutationRate,
        cranes,
        setCranes,
        
        algorithmParameters,
        dockSchedules,
        
        generateSchedule,
        resetParameters,
        getImprovementMetrics
    } = useGeneticScheduleVM();

    const [hasGenerated, setHasGenerated] = useState(false);
    const [showParameters, setShowParameters] = useState(true);
    
    const improvementMetrics = getImprovementMetrics();

    const handleGenerate = () => {
        if (!targetDate) {
            alert("Please select a date");
            return;
        }
        setHasGenerated(true);
        generateSchedule();
    };

    const formatTime = (seconds) => {
        if (seconds < 1) {
            return `${(seconds * 1000).toFixed(2)} ms`;
        }
        return `${seconds.toFixed(2)} s`;
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
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: "var(--color-primary-light)",
                        fontWeight: 600,
                        fontSize: "var(--font-size-heading)",
                    }}
                >
                    Genetic Algorithm Schedule
                </Typography>
                
                <Chip
                    label={`${scheduleResults.length} vessels scheduled`}
                    color="primary"
                    variant="outlined"
                    icon={<TimelineIcon />}
                />
            </Box>

            {/* Parameters Accordion */}
            <Accordion 
                expanded={showParameters}
                onChange={() => setShowParameters(!showParameters)}
                sx={{ mb: 3 }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon fontSize="small" />
                        Genetic Algorithm Parameters
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={3}>
                        {/* Date Selection */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField
                                    type="date"
                                    label="Target Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    size="small"
                                />
                            </FormControl>
                        </Grid>

                        {/* Population Size */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2">Population Size: {populationSize}</Typography>
                                    <Tooltip title="Number of solutions in each generation">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Box>
                                <Slider
                                    value={populationSize}
                                    onChange={(e, value) => setPopulationSize(value)}
                                    min={10}
                                    max={500}
                                    step={10}
                                    marks={[
                                        { value: 10, label: '10' },
                                        { value: 250, label: '250' },
                                        { value: 500, label: '500' }
                                    ]}
                                />
                            </FormControl>
                        </Grid>

                        {/* Generations */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2">Generations: {generations}</Typography>
                                    <Tooltip title="Number of generations to evolve">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Box>
                                <Slider
                                    value={generations}
                                    onChange={(e, value) => setGenerations(value)}
                                    min={10}
                                    max={500}
                                    step={10}
                                    marks={[
                                        { value: 10, label: '10' },
                                        { value: 250, label: '250' },
                                        { value: 500, label: '500' }
                                    ]}
                                />
                            </FormControl>
                        </Grid>

                        {/* Cranes */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2">Cranes: {cranes}</Typography>
                                    <Tooltip title="Number of cranes for parallel processing">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Box>
                                <Slider
                                    value={cranes}
                                    onChange={(e, value) => setCranes(value)}
                                    min={1}
                                    max={8}
                                    step={1}
                                    marks={[
                                        { value: 1, label: '1' },
                                        { value: 4, label: '4' },
                                        { value: 8, label: '8' }
                                    ]}
                                />
                            </FormControl>
                        </Grid>

                        {/* Crossover Rate */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2">Crossover Rate: {crossoverRate.toFixed(2)}</Typography>
                                    <Tooltip title="Probability of crossover between parents">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Box>
                                <Slider
                                    value={crossoverRate}
                                    onChange={(e, value) => setCrossoverRate(value)}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 0.5, label: '0.5' },
                                        { value: 1, label: '1' }
                                    ]}
                                />
                            </FormControl>
                        </Grid>

                        {/* Mutation Rate */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body2">Mutation Rate: {mutationRate.toFixed(2)}</Typography>
                                    <Tooltip title="Probability of mutation in offspring">
                                        <InfoIcon fontSize="small" color="action" />
                                    </Tooltip>
                                </Box>
                                <Slider
                                    value={mutationRate}
                                    onChange={(e, value) => setMutationRate(value)}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 0.5, label: '0.5' },
                                        { value: 1, label: '1' }
                                    ]}
                                />
                            </FormControl>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleGenerate}
                                    startIcon={<PlayArrowIcon />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        backgroundColor: "var(--color-primary)",
                                        ":hover": { backgroundColor: "var(--color-primary-dark)" },
                                    }}
                                >
                                    Run Genetic Algorithm
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    onClick={resetParameters}
                                    startIcon={<RestoreIcon />}
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                    }}
                                >
                                    Reset Parameters
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Performance Metrics */}
            {(executionTime !== null || totalDelay > 0) && (
                <Card sx={{ mb: 3, backgroundColor: "var(--color-background)" }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Total Delay
                                </Typography>
                                <Typography variant="h5" color={totalDelay > 0 ? "error" : "success"}>
                                    {totalDelay} hours
                                </Typography>
                            </Grid>
                            
                            {executionTime !== null && (
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Execution Time
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatTime(executionTime)}
                                    </Typography>
                                </Grid>
                            )}
                            
                            {improvementMetrics && (
                                <>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Delay Reduction
                                        </Typography>
                                        <Typography variant="h5" color="success.main">
                                            {improvementMetrics.delayReduction || 0} hours
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Improvement
                                        </Typography>
                                        <Typography variant="h5" color="success.main">
                                            {improvementMetrics.percentageImprovement || 0}%
                                        </Typography>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Loading Indicator */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2, alignSelf: 'center' }}>
                        Evolving solutions... Generation {Math.min(generations, Math.floor(Math.random() * generations) + 1)}/{generations}
                    </Typography>
                </Box>
            )}

            {/* Error Display */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        backgroundColor: "var(--color-error)",
                        color: "var(--color-text-light)",
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* No Results */}
            {hasGenerated && !loading && scheduleResults.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    No vessels scheduled for the selected date with current parameters.
                </Alert>
            )}

            {/* Results Table */}
            {scheduleResults.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Delay (h)</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Cranes Used</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Crane Code</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Staff</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
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
                                    <TableCell>{row.start}</TableCell>
                                    <TableCell>{row.end}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.delay} 
                                            size="small"
                                            color={row.delay === 0 ? "success" : "warning"}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{row.dock}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.cranes} 
                                            size="small"
                                            color={row.cranes > 1 ? "primary" : "default"}
                                        />
                                    </TableCell>
                                    <TableCell>{row.crane}</TableCell>
                                    <TableCell>{row.staff}</TableCell>
                                    <TableCell>
                                        {row.warning ? (
                                            <Tooltip title={row.warning}>
                                                <Chip 
                                                    label="Warning" 
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Chip 
                                                label="OK" 
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dock-wise Summary */}
            {Object.keys(dockSchedules).length > 0 && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Dock-wise Schedule Summary
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(dockSchedules).map(([dockId, dockInfo]) => (
                                <Grid item xs={12} md={6} key={dockId}>
                                    <Paper sx={{ p: 2, backgroundColor: "var(--color-background)" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {dockInfo.dock || dockInfo.dockName} ({dockId})
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Vessels: {dockInfo.vessels ? dockInfo.vessels.length : 0}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Crane: {dockInfo.craneCode || dockInfo.crane || "Not assigned"}
                                        </Typography>
                                        {dockInfo.area && (
                                            <Typography variant="body2" color="textSecondary">
                                                Storage Area: {dockInfo.area.storageAreaType || "Not assigned"}
                                            </Typography>
                                        )}
                                        {algorithmParameters && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="textSecondary">
                                                    Parameters: Pop={algorithmParameters.populationSize}, 
                                                    Gen={algorithmParameters.generations}, 
                                                    Cross={algorithmParameters.crossoverRate.toFixed(2)}, 
                                                    Mut={algorithmParameters.mutationRate.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default GeneticSchedule;