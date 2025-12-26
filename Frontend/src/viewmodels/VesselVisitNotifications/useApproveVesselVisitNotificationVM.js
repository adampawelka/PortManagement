import { useState } from 'react';
import { useApi } from '../../services/api';
import { approveVesselVisitNotification } from '../../services/vesselVisitNotificationService';
import { useNotification } from '../../hooks/useNotification';
import { useFormAutoSave } from '../../hooks/useFormAutoSave';

const initialFormState = {
    notificationId: '',
    dockID: '',
};

export const useApproveVesselVisitNotificationVM = () => {
    const { apiFetch } = useApi();
    const { showSuccess } = useNotification();
    
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Auto-save form data to localStorage
    const { clearSavedData } = useFormAutoSave(
        'approve-notification-form',
        formData,
        setFormData,
        initialFormState
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        if (!formData.notificationId) {
            setMessage({ type: 'error', text: 'Notification ID is required.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const updateDto = {
            status: 'Approved',
            DockId: formData.dockID,
        };

        try {
            await approveVesselVisitNotification(apiFetch, formData.notificationId, updateDto);
            // Show success notification toast
            showSuccess(`Notification ${formData.notificationId} approved successfully!`);
            // Also set message for Alert (optional - can remove later)
            setMessage({ type: 'success', text: `Notification ${formData.notificationId} approved successfully!` });
            setFormData(initialFormState);
            // Clear saved form data after successful submission
            clearSavedData();
        } catch (err) {
            // Error notifications are already handled by api.js
            setMessage({ type: 'error', text: `Approval failed: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        message,
        handleChange,
        handleApprove,
    };
};
