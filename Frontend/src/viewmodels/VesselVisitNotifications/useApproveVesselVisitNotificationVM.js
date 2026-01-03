import { useState, useEffect } from 'react';
import { useApi } from '../../services/api';
import { approveVesselVisitNotification, getVesselVisitNotifications } from '../../services/vesselVisitNotificationService';
import { getDocks } from '../../services/dockService';

export const useApproveVesselVisitNotificationVM = () => {
    const { apiFetch } = useApi();
    
    const [notificationId, setNotificationId] = useState('');
    const [dockID, setDock] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [docks, setDocks] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch both notifications and docks in parallel
                const [notificationsData, docksData] = await Promise.all([
                    getVesselVisitNotifications(apiFetch),
                    getDocks(apiFetch)
                ]);

                // Filter notifications with "Submitted" status only
                const submittedNotifications = (notificationsData || []).filter(
                    n => n.status === 'Submitted'
                );

                setNotifications(submittedNotifications);
                setDocks(docksData || []);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load notifications or docks.' });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [apiFetch]);

    const handleApprove = async (e) => {
        e.preventDefault();
        if (!notificationId) {
            setMessage({ type: 'error', text: 'Notification is required.' });
            return;
        }
        if (!dockID) {
            setMessage({ type: 'error', text: 'Dock is required.' });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        const updateDto = {
            status: 'Approved',
            DockId: dockID,
        };

        try {
            await approveVesselVisitNotification(apiFetch, notificationId, updateDto);
            setMessage({ type: 'success', text: `Notification approved successfully!` });
            setNotificationId('');
            setDock('');
            // Reload notifications
            const updatedNotifications = await getVesselVisitNotifications(apiFetch);
            const submittedNotifications = (updatedNotifications || []).filter(
                n => n.status === 'Submitted'
            );
            setNotifications(submittedNotifications);
        } catch (err) {
            setMessage({ type: 'error', text: `Approval failed: ${err.message}` });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        notificationId,
        dockID,
        loading,
        submitting,
        message,
        notifications,
        docks,
        setNotificationId,
        setDock,
        handleApprove,
    };
};
