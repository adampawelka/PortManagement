import React from 'react';
import { 
    Container, 
    Typography, 
    CircularProgress, 
    Alert, 
    Paper, 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody 
} from '@mui/material';
import { useAvailableResourcesVM } from '../../viewmodels/Resources/useResourcesListVM'; // ViewModel import

const AvailableResourcesPage = () => {
    const { resources, loading, error } = useAvailableResourcesVM(); // Use the ViewModel

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                mt: 4, 
                backgroundColor: 'var(--color-surface)', 
                p: 4, 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 3,
                fontFamily: 'var(--font-family-base)',
            }}
        >
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    color: 'var(--color-primary-light)', 
                    fontWeight: 600, 
                    mb: 3,
                    fontSize: 'var(--font-size-heading)', 
                }}
            >
                Available Resources List ({resources.length})
            </Typography>

            {loading && (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            )}

            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 2, 
                        color: 'var(--color-text-light)',
                        backgroundColor: 'var(--color-error)',
                    }} 
                    aria-live="assertive"
                >
                    {error}
                </Alert>
            )}

            {!loading && resources.length === 0 && !error && (
                <Alert 
                    severity="info" 
                    sx={{ 
                        mb: 2,
                        backgroundColor: 'var(--color-info)',
                        color: 'var(--color-text-dark)'
                    }} 
                    aria-live="polite"
                >
                    No available resources found.
                </Alert>
            )}

            {resources.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table size="small" aria-label="resources table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Capacity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>SetUp Time (min)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.map((resource) => (
                                <TableRow 
                                    key={resource.id} 
                                    sx={{ '&:hover': { backgroundColor: 'var(--color-background-hover)' } }}
                                >
                                    <TableCell>{resource.id || 'N/A'}</TableCell>
                                    <TableCell>{resource.code || 'N/A'}</TableCell>
                                    <TableCell>{resource.description || 'General'}</TableCell>
                                    <TableCell>{resource.type || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: 'bold', 
                                                color: resource.status === 'active' ? 'green' : 
                                                       resource.status === 'inactive' ? 'red' : 
                                                       resource.status === 'maintenance' ? 'orange' : 'gray' 
                                            }}
                                        >
                                            {resource.status || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{resource.capacity || 'N/A'}</TableCell>
                                    <TableCell>{resource.setupTime || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AvailableResourcesPage;
