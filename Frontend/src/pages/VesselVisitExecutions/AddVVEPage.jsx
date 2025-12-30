import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAddVVEVM } from "../../viewmodels/VesselVisitExecutions/useAddVVEVM";

const AddVVEPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    submitting,
    error,
    success,
    handleChange,
    handleTimeChange,
    handleSubmit,
  } = useAddVVEVM();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          p: 4,
          borderRadius: "var(--radius-md)",
          boxShadow: 3,
          backgroundColor: "var(--color-surface)",
          fontFamily: "var(--font-family-base)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "var(--color-primary-light)",
            fontWeight: 600,
            mb: 3,
            fontSize: "var(--font-size-heading)",
          }}
        >
          Create Vessel Visit Execution
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 2,
              color: "var(--color-text-dark)",
              fontSize: "var(--font-size-subheading)",
            }}
          >
            VVN Information:
          </Typography>

          <TextField
            label="VVN ID"
            name="vvnId"
            value={formData.vvnId}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            helperText="Enter the Vessel Visit Notification ID"
            sx={{
              "& .MuiInputLabel-root": { color: "var(--color-text-dark)" },
              "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
            }}
          />

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mb: 2,
              color: "var(--color-text-dark)",
              fontSize: "var(--font-size-subheading)",
            }}
          >
            Arrival Details:
          </Typography>

          <DateTimePicker
            label="Actual Arrival Time *"
            value={formData.actualArrivalTime ? new Date(formData.actualArrivalTime) : null}
            onChange={(value) => handleTimeChange("actualArrivalTime", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "var(--color-text-dark)" },
                  "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
                }}
              />
            )}
          />

          <DateTimePicker
            label="Actual Berth Time"
            value={formData.actualBerthTime ? new Date(formData.actualBerthTime) : null}
            onChange={(value) => handleTimeChange("actualBerthTime", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                helperText="Optional"
                sx={{
                  "& .MuiInputLabel-root": { color: "var(--color-text-dark)" },
                  "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
                }}
              />
            )}
          />

          <TextField
            label="Dock ID"
            name="dockId"
            value={formData.dockId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            helperText="Optional"
            sx={{
              "& .MuiInputLabel-root": { color: "var(--color-text-dark)" },
              "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
            }}
          />

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              mb: 2,
              color: "var(--color-text-dark)",
              fontSize: "var(--font-size-subheading)",
            }}
          >
            System Information:
          </Typography>

          <TextField
            label="Status"
            value="IN_PROGRESS"
            fullWidth
            margin="normal"
            disabled
            helperText="Status is automatically set to IN_PROGRESS on creation"
            sx={{
              "& .MuiInputLabel-root": { color: "var(--color-text-dark)" },
              "& .MuiOutlinedInput-root": { borderColor: "var(--color-border)" },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => navigate("/vve/list")}
              disabled={submitting}
              sx={{
                py: 1.5,
                borderColor: "var(--color-border)",
                color: "var(--color-text-dark)",
                "&:hover": {
                  borderColor: "var(--color-primary)",
                  backgroundColor: "var(--color-surface)",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                py: 1.5,
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-light)",
                "&:hover": { backgroundColor: "var(--color-primary-dark)" },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create VVE"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default AddVVEPage;
