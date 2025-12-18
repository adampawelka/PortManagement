import { useState } from 'react';
import { useApi } from '../../services/api';
import { approveVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useNotification } from '../../hooks/useNotification';

export const useApproveVesselVisitNotificationVM = () => {
    const { apiFetch } = useApi();
    const { showSuccess } = useNotification();
    
    const [notificationId, setNotificationId] = useState('');
    const [dockID, setDock] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleApprove = async (e) => {
        e.preventDefault();
        if (!notificationId) {
            setMessage({ type: 'error', text: 'Notification ID is required.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const updateDto = {
            status: 'Approved',
            DockId: dockID,
        };

        try {
            await approveVesselVisitNotification(apiFetch, notificationId, updateDto);
            // Show success notification toast
            showSuccess(`Notification ${notificationId} approved successfully!`);
            // Also set message for Alert (optional - can remove later)
            setMessage({ type: 'success', text: `Notification ${notificationId} approved successfully!` });
            setNotificationId('');
            setDock('');
        } catch (err) {
            // Error notifications are already handled by api.js
            setMessage({ type: 'error', text: `Approval failed: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return {
        notificationId,
        dockID,
        loading,
        message,
        setNotificationId,
        setDock,
        handleApprove,
    };
};
