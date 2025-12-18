import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Box, Typography } from "@mui/material";
import LogoutButton from "../components/LogoutButton";
import { useNotification } from "../hooks/useNotification";

const Home = () => {
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  return (
    <div>
      <h1>{t("home")}</h1>
      <p>This is the home page.</p>
      <LogoutButton />
      
      {/* Notification Test Buttons */}
      <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => showSuccess("This is a success notification!")}
          >
            Test Success
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => showError("This is an error notification!")}
          >
            Test Error
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => showWarning("This is a warning notification!")}
          >
            Test Warning
          </Button>
          <Button 
            variant="contained" 
            color="info"
            onClick={() => showInfo("This is an info notification!")}
          >
            Test Info
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
