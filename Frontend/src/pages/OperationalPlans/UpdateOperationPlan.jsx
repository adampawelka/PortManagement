import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUpdateOperationPlanVM } from "../../viewmodels/OperationalPlans/useUpdateOperationPlanVM";

const UpdateOperationPlan = () => {
  const { id: paramPlanId } = useParams();
  const navigate = useNavigate();
  const {
    plan,
    loading,
    error,
    saving,
    success,
    warnings,
    formData,
    changeReason,
    setChangeReason,
    loadPlan,
    updateField,
    updateScheduleOperation,
    addScheduleOperation,
    removeScheduleOperation,
    savePlan,
  } = useUpdateOperationPlanVM();

  const [planIdInput, setPlanIdInput] = useState(paramPlanId || "");
  const isPlanLoaded = !!plan;

  useEffect(() => {
    if (paramPlanId) {
      loadPlan(paramPlanId);
    }
  }, [paramPlanId, loadPlan]);

  const handleLoadPlan = async (e) => {
    e.preventDefault();
    if (!planIdInput || planIdInput.trim() === "") {
      return;
    }
    await loadPlan(planIdInput.trim());
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
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
          fontSize: "var(--font-size-heading)",
        }}
      >
        Update Operation Plan
      </Typography>

      {!isPlanLoaded && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Box
            component="form"
            onSubmit={handleLoadPlan}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              label="Plan ID"
              value={planIdInput}
              onChange={(e) => setPlanIdInput(e.target.value)}
              placeholder="Enter operation plan ID"
              required
              disabled={loading}
              sx={{ flexGrow: 1, backgroundColor: "var(--color-surface)" }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !planIdInput.trim()}
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-light)",
                px: 3,
              }}
            >
              {loading ? "Loading..." : "Load Plan"}
            </Button>
          </Box>
        </Paper>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Operation plan updated successfully!
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 2,
            backgroundColor: "var(--color-warning-bg, #fff3cd)",
            border: "1px solid var(--color-warning-border, #ffc107)",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "var(--color-warning-text, #856404)" }}>
            ⚠️ Inconsistency Warnings:
          </Typography>
          <Box component="ul" sx={{ margin: 0, paddingLeft: 3, color: "var(--color-warning-text, #856404)" }}>
            {warnings.map((warning, index) => (
              <Box component="li" key={index} sx={{ mb: 0.5 }}>
                {warning}
              </Box>
            ))}
          </Box>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "var(--color-warning-text, #856404)" }}>
            Please review these warnings. You can still save, but conflicts may occur.
          </Typography>
        </Alert>
      )}

      {isPlanLoaded && plan && (
        <Paper
          sx={{
            p: 3,
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: "var(--color-primary)", fontWeight: 600 }}>
            Plan Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-dark)" }}>
                <strong>Plan ID:</strong> {plan.id}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-dark)" }}>
                <strong>VVN ID:</strong> {plan.vvnId}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-dark)" }}>
                <strong>Vessel Name:</strong> {plan.schedule && plan.schedule.length > 0 
                  ? plan.schedule[0].vesselName 
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-dark)" }}>
                <strong>Created At:</strong> {new Date(plan.createdAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, color: "var(--color-text-dark)" }}>
                <strong>Created By:</strong> {plan.createdBy}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Algorithm Used</InputLabel>
                <Select
                  value={formData.algorithmUsed || plan.algorithmUsed}
                  onChange={(e) => updateField("algorithmUsed", e.target.value)}
                  label="Algorithm Used"
                  sx={{ backgroundColor: "var(--color-surface)" }}
                >
                  <MenuItem value="optimal">Optimal</MenuItem>
                  <MenuItem value="heuristic">Heuristic</MenuItem>
                  <MenuItem value="multi_crane">Multi-Crane</MenuItem>
                  <MenuItem value="bruteforce">Brute Force</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {isPlanLoaded && plan && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "var(--color-background)",
              borderRadius: "var(--radius-md)",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ color: "var(--color-primary)", fontWeight: 600 }}>
                Schedule Operations
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addScheduleOperation}
                sx={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                Add Operation
              </Button>
            </Box>

            {formData.schedule && formData.schedule.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "var(--color-background-light)" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Vessel Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Delay (h)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dock</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Cranes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.schedule.map((operation, index) => (
                    <TableRow key={index} sx={{ backgroundColor: "var(--color-surface)" }}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={operation.vesselName || ""}
                          onChange={(e) =>
                            updateScheduleOperation(index, { vesselName: e.target.value })
                          }
                          sx={{ width: 150, backgroundColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <DateTimePicker
                          value={operation.start ? new Date(operation.start) : null}
                          onChange={(newValue) =>
                            updateScheduleOperation(index, {
                              start: newValue ? newValue.toISOString() : "",
                            })
                          }
                          renderInput={(params) => (
                            <TextField {...params} size="small" sx={{ width: 180, backgroundColor: "white" }} />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <DateTimePicker
                          value={operation.end ? new Date(operation.end) : null}
                          onChange={(newValue) =>
                            updateScheduleOperation(index, {
                              end: newValue ? newValue.toISOString() : "",
                            })
                          }
                          renderInput={(params) => (
                            <TextField {...params} size="small" sx={{ width: 180, backgroundColor: "white" }} />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={operation.delay || 0}
                          onChange={(e) =>
                            updateScheduleOperation(index, {
                              delay: parseFloat(e.target.value) || 0,
                            })
                          }
                          inputProps={{ min: 0, step: 0.1 }}
                          sx={{ width: 80, backgroundColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={operation.dock || ""}
                          onChange={(e) =>
                            updateScheduleOperation(index, { dock: e.target.value })
                          }
                          sx={{ width: 120, backgroundColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={Array.isArray(operation.cranes) ? operation.cranes.join(", ") : ""}
                          onChange={(e) =>
                            updateScheduleOperation(index, {
                              cranes: e.target.value
                                .split(",")
                                .map((c) => c.trim())
                                .filter((c) => c !== ""),
                            })
                          }
                          placeholder="Crane1, Crane2"
                          sx={{ width: 150, backgroundColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={Array.isArray(operation.staff) ? operation.staff.join(", ") : ""}
                          onChange={(e) =>
                            updateScheduleOperation(index, {
                              staff: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s !== ""),
                            })
                          }
                          placeholder="Staff1, Staff2"
                          sx={{ width: 150, backgroundColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => removeScheduleOperation(index)}
                          disabled={formData.schedule.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="info">
                No operations in schedule. Click "Add Operation" to add one.
              </Alert>
            )}
          </Paper>
        </LocalizationProvider>
      )}

      {isPlanLoaded && plan && (
        <Paper
          sx={{
            p: 3,
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "var(--color-primary)", fontWeight: 600 }}>
            Change Information
          </Typography>
          
          <TextField
            label="Reason for Change"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="Enter reason for updating this operation plan..."
            required
            fullWidth
            multiline
            rows={4}
            error={!changeReason && saving}
            helperText={!changeReason && saving ? "Change reason is required" : ""}
            sx={{
              mb: 3,
              backgroundColor: "var(--color-surface)",
            }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/operational-plans/search")}
              sx={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={savePlan}
              disabled={saving || !changeReason.trim()}
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-light)",
                px: 4,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default UpdateOperationPlan;

