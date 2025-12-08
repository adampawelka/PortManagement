import { useState } from 'react';
import { useApi } from '../services/api';
import { approveVesselVisitNotification } from '../../services/vesselVisitNotificationService';

export const useApproveVesselVisitNotificationVM = () => {
    const { apiFetch } = useApi();
    
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
            setMessage({ type: 'success', text: `Notification ${notificationId} approved successfully!` });
            setNotificationId('');
            setDock('');
        } catch (err) {
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
