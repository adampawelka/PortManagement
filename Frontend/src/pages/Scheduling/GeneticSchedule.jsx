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
    InputLabel,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Slider,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tabs,
    Tab
} from "@mui/material";
import { 
    Info as InfoIcon, 
    Timeline as TimelineIcon, 
    Settings as SettingsIcon,
    ExpandMore as ExpandMoreIcon,
    Refresh as RefreshIcon,
    Psychology as PsychologyIcon,
    Speed as SpeedIcon,
    Dock as DockIcon,
    Schedule as ScheduleIcon
} from "@mui/icons-material";

import { useGeneticScheduleVM } from "../../viewmodels/Scheduling/useGeneticScheduleVM";

const GeneticSchedule = () => {
    const {
        targetDate,
        setTargetDate,
        algorithmType,
        setAlgorithmType,
        geneticParams,
        updateGeneticParam,
        resetGeneticParams,
        scheduleResults,
        loading,
        error,
        performanceMetrics,
        generateGeneticSchedule,
        getDockSummary
    } = useGeneticScheduleVM();

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const handleGenerate = () => {
        if (!targetDate) {
            alert("Please select a date");
            return;
        }
        setHasGenerated(true);
        generateGeneticSchedule();
    };

    const formatTime = (seconds) => {
        if (!seconds || seconds === "N/A" || seconds === 0) return "0s";
        if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
        if (seconds < 60) return `${seconds.toFixed(2)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(0);
        return `${mins}m ${secs}s`;
    };

    const dockSummary = getDockSummary();

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
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <PsychologyIcon sx={{ fontSize: 40, color: "var(--color-primary)" }} />
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "var(--color-primary-light)",
                                fontWeight: 600,
                                fontSize: "var(--font-size-heading)",
                            }}
                        >
                            Genetic Algorithm Scheduler
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Evolutionary optimization for vessel scheduling
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    icon={<TimelineIcon />}
                    label={`${scheduleResults.length} Vessels Scheduled`}
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {/* Control Panel */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: "var(--color-background)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <Grid container spacing={3}>
                    {/* Basic Controls */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <TextField
                                type="date"
                                size="small"
                                label="Target Date"
                                InputLabelProps={{ shrink: true }}
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                fullWidth
                                helperText="Select date for scheduling"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel shrink>Algorithm Mode</InputLabel>
                            <Select
                                size="small"
                                value={algorithmType}
                                onChange={(e) => setAlgorithmType(e.target.value)}
                                label="Algorithm Mode"
                            >
                                <MenuItem value="single">Single Crane</MenuItem>
                                <MenuItem value="multi">Multi-Crane</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button
                                variant="contained"
                                onClick={handleGenerate}
                                disabled={loading}
                                sx={{
                                    py: 1,
                                    px: 4,
                                    fontSize: "0.9rem",
                                    backgroundColor: "var(--color-primary)",
                                    ":hover": { backgroundColor: "var(--color-primary-dark)" },
                                    flex: 1
                                }}
                                startIcon={<SpeedIcon />}
                            >
                                {loading ? "Optimizing..." : "Run Genetic Algorithm"}
                            </Button>

                            <Tooltip title="Reset Parameters">
                                <IconButton
                                    onClick={resetGeneticParams}
                                    color="default"
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Advanced Parameters">
                                <IconButton
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    color={showAdvanced ? "primary" : "default"}
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>

                {/* Advanced Parameters */}
                {showAdvanced && (
                    <Box mt={3} pt={2} borderTop="1px solid var(--color-border)">
                        <Typography variant="h6" gutterBottom>
                            Genetic Algorithm Parameters
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Population Size</InputLabel>
                                    <Slider
                                        value={geneticParams.populationSize}
                                        onChange={(e, value) => updateGeneticParam("populationSize", value)}
                                        min={10}
                                        max={200}
                                        step={10}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Current: {geneticParams.populationSize}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Generations</InputLabel>
                                    <Slider
                                        value={geneticParams.generations}
                                        onChange={(e, value) => updateGeneticParam("generations", value)}
                                        min={50}
                                        max={500}
                                        step={50}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Current: {geneticParams.generations}
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Crossover Rate (%)</InputLabel>
                                    <Slider
                                        value={geneticParams.crossoverRate * 100} // Show as percentage
                                        onChange={(e, value) => updateGeneticParam("crossoverRate", value)}
                                        min={50}
                                        max={95}
                                        step={5}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Current: {Math.round(geneticParams.crossoverRate * 100)}%
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Mutation Rate (%)</InputLabel>
                                    <Slider
                                    value={geneticParams.mutationRate * 100} // Show as percentage
                                    onChange={(e, value) => updateGeneticParam("mutationRate", value)}
                                    min={1}
                                    max={50}
                                    step={1}
                                    valueLabelDisplay="auto"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Current: {Math.round(geneticParams.mutationRate * 100)}%
                                </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2.4}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Max Time (s)</InputLabel>
                                    <Slider
                                        value={geneticParams.maxTime}
                                        onChange={(e, value) => updateGeneticParam("maxTime", value)}
                                        min={1}
                                        max={60}
                                        step={1}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Current: {geneticParams.maxTime}s
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        {/* Desired Delay */}
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel shrink>Desired Max Delay (hours)</InputLabel>
                                    <Slider
                                        value={geneticParams.desiredDelay}
                                        onChange={(e, value) => updateGeneticParam("desiredDelay", value)}
                                        min={0}
                                        max={100}
                                        step={5}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Target maximum total delay: {geneticParams.desiredDelay} hours
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        {/* Algorithm Parameters Display */}
                        {performanceMetrics.algorithmParameters && (
                            <Box mt={2} p={2} bgcolor="var(--color-info-light)" borderRadius={1}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Current Parameters:
                                </Typography>
                                <Typography variant="body2">
                                    Population: {performanceMetrics.algorithmParameters.populationSize || geneticParams.populationSize} | 
                                    Generations: {performanceMetrics.algorithmParameters.generations || geneticParams.generations} | 
                                    Crossover: {performanceMetrics.algorithmParameters.crossoverRate || geneticParams.crossoverRate}% | 
                                    Mutation: {performanceMetrics.algorithmParameters.mutationRate || geneticParams.mutationRate}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Performance Metrics */}
            {performanceMetrics.executionTime !== null && (
                <Card sx={{ mb: 3, backgroundColor: "var(--color-info-light)", border: "1px solid var(--color-border)" }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Performance Metrics
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={algorithmType === "multi" ? 2 : 3}>
                                <Box textAlign="center">
                                    <Typography variant="overline" color="text.secondary">
                                        Execution Time
                                    </Typography>
                                    <Typography variant="h5" color="primary.main">
                                        {formatTime(performanceMetrics.executionTime)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Computation time
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={algorithmType === "multi" ? 2 : 3}>
                                <Box textAlign="center">
                                    <Typography variant="overline" color="text.secondary">
                                        Total Delay
                                    </Typography>
                                    <Typography variant="h5" color="error.main">
                                        {performanceMetrics.totalDelay} hours
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Sum of all vessel delays
                                    </Typography>
                                </Box>
                            </Grid>
                            {algorithmType === "multi" && (
                                <Grid item xs={12} sm={6} md={2}>
                                    <Box textAlign="center">
                                        <Typography variant="overline" color="text.secondary">
                                            Crane Hours
                                        </Typography>
                                        <Typography variant="h5" color="success.main">
                                            {performanceMetrics.craneHours}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Total crane usage hours
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                            {performanceMetrics.delayReduction > 0 && (
                                <Grid item xs={12} sm={6} md={algorithmType === "multi" ? 3 : 4}>
                                    <Box textAlign="center">
                                        <Typography variant="overline" color="text.secondary">
                                            Improvement
                                        </Typography>
                                        <Typography variant="h5" color="success.main">
                                            {performanceMetrics.percentageImprovement > 0 
                                                ? `${performanceMetrics.percentageImprovement}%` 
                                                : `${performanceMetrics.delayReduction}h`}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {performanceMetrics.percentageImprovement > 0 
                                                ? "Delay reduction %" 
                                                : "Delay reduction"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Dock Summary */}
            {dockSummary && dockSummary.length > 0 && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                            <DockIcon /> Dock Summary
                        </Typography>
                        <Grid container spacing={2}>
                            {dockSummary.map((dock) => (
                                <Grid item xs={12} sm={6} md={3} key={dock.id}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {dock.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {dock.vesselCount} vessels
                                        </Typography>
                                        <Typography variant="body2" color="error.main">
                                            Delay: {dock.delay}h
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Time: {formatTime(dock.executionTime)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Loading State */}
            {loading && (
                <Box display="flex" flexDirection="column" alignItems="center" my={4}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="body1" sx={{ mt: 2, color: "var(--color-primary)" }}>
                        Running Genetic Algorithm...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Generation {Math.floor(Math.random() * geneticParams.generations)} of {geneticParams.generations} with {geneticParams.populationSize} individuals
                    </Typography>
                </Box>
            )}

            {/* Error Messages */}
            {error && (
                <Alert
                    severity={error.includes("No approved vessels") ? "info" : "error"}
                    sx={{
                        mb: 2,
                        backgroundColor: error.includes("No approved vessels") ? "var(--color-info)" : "var(--color-error)",
                        color: "var(--color-text-light)",
                    }}
                >
                    {error}
                </Alert>
            )}

            {hasGenerated && !loading && scheduleResults.length === 0 && !error && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 2,
                        backgroundColor: "var(--color-info)",
                        color: "var(--color-text-dark)",
                    }}
                >
                    No schedule generated. Try adjusting parameters or selecting a different date.
                </Alert>
            )}

            {/* Results Tabs */}
            {scheduleResults.length > 0 && (
                <Box>
                    <Tabs 
                        value={activeTab} 
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{ mb: 2 }}
                    >
                        <Tab label="All Schedules" icon={<ScheduleIcon />} />
                        <Tab label="Dock Details" icon={<DockIcon />} />
                    </Tabs>

                    {/* All Schedules Tab */}
                    {activeTab === 0 && (
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "var(--color-background)" }}>
                                        <TableCell sx={{ fontWeight: "bold" }}>Vessel</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Dock</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>
                                            Cranes
                                            <Tooltip title="Number of cranes used">
                                                <InfoIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Containers</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Processing Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scheduleResults.map((row, i) => {
                                        const startHour = parseInt(row.start.split(':')[0]) || 0;
                                        const endHour = parseInt(row.end.split(':')[0]) || 0;
                                        const duration = endHour - startHour;
                                        
                                        return (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    "&:hover": {
                                                        backgroundColor: "var(--color-background)",
                                                    }
                                                }}
                                            >
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        {row.vessel}
                                                        {row.cranesUsed > 1 && (
                                                            <Chip
                                                                label={`${row.cranesUsed} cranes`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                                sx={{ ml: 1, height: 20 }}
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{row.dock}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.crane}
                                                        size="small"
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{row.start}</TableCell>
                                                <TableCell>{row.end}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${duration}h`}
                                                        size="small"
                                                        color={duration > 8 ? "error" : "success"}
                                                        variant="filled"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {row.containers > 0 ? row.containers : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {row.processingTime > 0 ? `${row.processingTime}h` : "-"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Dock Details Tab */}
                    {activeTab === 1 && performanceMetrics.dockSchedules && (
                        <Box>
                            {Object.entries(performanceMetrics.dockSchedules).map(([dockId, dockInfo]) => (
                                <Card key={dockId} sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                                            <DockIcon /> {dockInfo.dockName}
                                        </Typography>
                                        <Grid container spacing={2} mb={2}>
                                            <Grid item xs={6} sm={3}>
                                                <Paper sx={{ p: 1, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Vessels
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {dockInfo.schedules.length}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Paper sx={{ p: 1, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Total Delay
                                                    </Typography>
                                                    <Typography variant="h6" color="error.main">
                                                        {dockInfo.performance.totalDelay || 0}h
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Paper sx={{ p: 1, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Execution Time
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {formatTime(dockInfo.performance.computationTime || 0)}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                        
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Vessel</TableCell>
                                                        <TableCell>Start</TableCell>
                                                        <TableCell>End</TableCell>
                                                        <TableCell>Cranes</TableCell>
                                                        <TableCell>Containers</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dockInfo.schedules.map((schedule, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell>{schedule.vessel}</TableCell>
                                                            <TableCell>{schedule.start}</TableCell>
                                                            <TableCell>{schedule.end}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={schedule.cranesUsed}
                                                                    size="small"
                                                                    color="primary"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{schedule.containers || "-"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {/* Algorithm Information */}
            <Accordion sx={{ mt: 4, backgroundColor: "var(--color-background)" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">About Genetic Algorithm Scheduling</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                How It Works
                            </Typography>
                            <Typography variant="body2" paragraph>
                                The genetic algorithm uses evolutionary principles to optimize vessel scheduling:
                            </Typography>
                            <ul style={{ marginLeft: 20, color: "var(--color-text)" }}>
                                <li><strong>Population:</strong> Multiple possible schedules (individuals)</li>
                                <li><strong>Selection:</strong> Best schedules survive based on fitness (delay minimization)</li>
                                <li><strong>Crossover:</strong> Combines good schedules to create new ones</li>
                                <li><strong>Mutation:</strong> Random changes to explore new solutions</li>
                                <li><strong>Generations:</strong> Iterative improvement over time</li>
                            </ul>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>
                                Parameter Guidelines
                            </Typography>
                            <ul style={{ marginLeft: 20, color: "var(--color-text)" }}>
                                <li><strong>Population Size (10-200):</strong> Larger populations explore more but are slower</li>
                                <li><strong>Generations (50-500):</strong> More generations allow for better optimization</li>
                                <li><strong>Crossover Rate (50-95%):</strong> How often solutions are combined</li>
                                <li><strong>Mutation Rate (1-50%):</strong> How often random changes occur</li>
                                <li><strong>Max Time (1-60s):</strong> Maximum computation time</li>
                                <li><strong>Desired Delay (0-100h):</strong> Target maximum total delay</li>
                            </ul>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        This approach is particularly effective for complex scenarios with multiple constraints and can find near-optimal solutions when brute force becomes impractical.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
};

export default GeneticSchedule;