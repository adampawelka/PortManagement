import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const PrivacyAcceptanceModal = ({ open, policy, onAccept, onDecline }) => {
  if (!policy) return null;

  return (
    <Dialog open={open} fullWidth maxWidth="md" disableEscapeKeyDown disableBackdropClick>
      <DialogTitle>Privacy Policy Update</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Version: {policy.version} | Effective Date: {policy.effectiveDate}</Typography>
        </Box>
        {policy.title && <Typography variant="h6" sx={{ mb: 1 }}>{policy.title}</Typography>}
        {policy.intro && <Typography variant="body2" sx={{ mb: 2 }}>{policy.intro}</Typography>}

        {/* Render brief sections if available */}
        {policy.sections && Array.isArray(policy.sections) && (
          <Box sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
            {policy.sections.map((s, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="subtitle2">{s.title}</Typography>
                <Typography variant="body2">{s.content}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* If policy JSON structure is unknown, show full JSON as fallback */}
        {!policy.sections && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Please review our updated privacy policy. You can read the full document <a href="/privacyPolicy">here</a>.</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color="inherit">Log out</Button>
        <Button onClick={onAccept} variant="contained">Accept</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivacyAcceptanceModal;
