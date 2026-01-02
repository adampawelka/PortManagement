import React from "react";
import {
    Container,
    Typography,
    Paper,
    FormControl,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Para navegar a la página de generación
import { useMissingPlansVM } from "../../viewmodels/OperationalPlans/useMissingPlansVM";

const MissingOperationalPlans = () => {
    const {
        date,
        setDate,
        missingList,
        loading,
        error,
        hasSearched,
        findMissing
    } = useMissingPlansVM();

    const navigate = useNavigate();

    // Redirige a la página de generación (US 4.1.2) pasando la fecha
    const handleGoToGenerate = () => {
        // Asumiendo que tu ruta de generación es /operational-plans/generate
        // Pasamos la fecha como estado para que la otra página la pre-cargue si implementas esa lógica
        navigate("/operational-plans/generate", { state: { date } });
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                p: "var(--spacing-xl)",
                borderRadius: "var(--radius-lg)",
                fontFamily: "var(--font-family-base)",
                backgroundColor: "var(--color-surface)",
                boxShadow: 3
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: "var(--color-primary-light)",
                    fontWeight: 600,
                    mb: 3
                }}
            >
                Missing Operational Plans (US 4.1.5)
            </Typography>

            {/* Panel de Control */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "var(--color-background)",
                    display: "flex",
                    gap: 2,
                    alignItems: "center"
                }}
            >
                <FormControl sx={{ width: 250 }}>
                    <TextField
                        type="date"
                        size="small"
                        label="Check Date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        sx={{ backgroundColor: "var(--color-surface)" }}
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={findMissing}
                    disabled={loading}
                    sx={{
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        height: 40
                    }}
                >
                    {loading ? "Checking..." : "Check Missing Plans"}
                </Button>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {hasSearched && !loading && missingList.length === 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Great! All approved vessels for this date have an Operational Plan. ✅
                </Alert>
            )}

            {hasSearched && missingList.length > 0 && (
                <>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Found {missingList.length} approved notifications without a plan.
                    </Alert>

                    <Table size="small" sx={{ minWidth: 650, mb: 3 }}>
                        <TableHead sx={{ backgroundColor: "var(--color-background-light)" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Vessel Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>VVN ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>ETA</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {missingList.map((item) => (
                                <TableRow key={item.vvnId}>
                                    <TableCell>{item.vesselName}</TableCell>
                                    <TableCell>{item.vvnId}</TableCell>
                                    <TableCell>{new Date(item.eta).toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: "green", fontWeight: 600 }}>{item.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={handleGoToGenerate}
                            sx={{ fontWeight: "bold" }}
                        >
                            Generate Plans for {date} (Overwrite)
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default MissingOperationalPlans;