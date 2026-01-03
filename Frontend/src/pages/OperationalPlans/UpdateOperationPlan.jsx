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
} from "@mui/material";
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
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Warnings:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {isPlanLoaded && plan && (
        <Paper
          sx={{
            p: 3,
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "var(--color-primary)" }}>
            Plan Details
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Plan ID:</strong> {plan.id}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>VVN ID:</strong> {plan.vvnId}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Created At:</strong> {new Date(plan.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Created By:</strong> {plan.createdBy}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Algorithm Used:</strong> {plan.algorithmUsed}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default UpdateOperationPlan;

