import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Container, 
  Typography, 
  Alert, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// URL base de tu API (Ajusta el puerto si es necesario)
const API_BASE_URL = 'http://localhost:5000/api';
const PENDING_USERS_URL = `${API_BASE_URL}/PendingUsers`; 
const CREATE_USER_URL = `${API_BASE_URL}/Users/create`;
// Endpoint para eliminar el PendingUser (usado para APROBAR y RECHAZAR)
const DELETE_PENDING_USER_URL = (pendingUserId) => `${API_BASE_URL}/PendingUsers/${pendingUserId}`;

// Roles disponibles (Ajusta estos roles a los que maneja tu Backend)
const AVAILABLE_ROLES = [
  'Administrator',
  'LogisticsOperator',
  'ShippingAgentRepresentative',
  'PortAuthorityOfficer',
  'None'
];

const PendingUserManagementPage = () => {
  // Estados para la gestión de datos y UI
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); 
  const [roles, setRoles] = useState({}); 
  const [processing, setProcessing] = useState({}); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [userToProcess, setUserToProcess] = useState(null); 
  const [dialogAction, setDialogAction] = useState(''); 

  const { getAccessTokenSilently } = useAuth0(); 

  /**
   * Obtiene la lista de usuarios pendientes de la API.
   */
  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(PENDING_USERS_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
        // Inicializar los roles seleccionados
        const initialRoles = data.reduce((acc, user) => {
          acc[user.id] = user.role || AVAILABLE_ROLES[0]; 
          return acc;
        }, {});
        setRoles(initialRoles);
      } else {
        const errorText = await response.text();
        setMessage({ type: 'error', text: `Error al cargar usuarios pendientes: ${response.status} - ${errorText || response.statusText}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de red, fallo en la obtención del token o el módulo Auth0 no está disponible. Asegúrate de estar autenticado.' });
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  /**
   * Manejador para el cambio de rol en el selector.
   */
  const handleRoleChange = (userId, newRole) => {
    setRoles(prevRoles => ({
      ...prevRoles,
      [userId]: newRole
    }));
  };

  /**
   * Abre el modal de confirmación.
   */
  const handleConfirmAction = (user, action) => {
    if (action === 'APPROVE') {
        const selectedRole = roles[user.id];
        if (!selectedRole) {
            setMessage({ type: 'warning', text: 'Please, select a role before approve the user.' });
            return;
        }
    }
    setUserToProcess(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  /**
   * Cierra el modal y limpia el usuario seleccionado.
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserToProcess(null);
    setDialogAction('');
  };


  /**
   * Función para eliminar la solicitud de PendingUser (RECHAZAR).
   */
  const handleRejectUser = async (pendingUser) => {
    const pendingUserId = pendingUser.id;
    
    setProcessing(prev => ({ ...prev, [pendingUserId]: true }));
    setMessage(null);

    try {
        const token = await getAccessTokenSilently();
        
        // Llamada DELETE /api/PendingUsers/{id}
        const deleteResponse = await fetch(DELETE_PENDING_USER_URL(pendingUserId), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!deleteResponse.ok) {
            const errorData = await deleteResponse.json();
            throw new Error(`Fail deleting PendingUser: ${deleteResponse.status} - ${errorData.Message || 'Unknown error'}`);
        }

        // Éxito
        setMessage({ type: 'success', text: `User request ${pendingUser.email} rejected and deleted successfully from Pending Users.` });
        setPendingUsers(prev => prev.filter(u => u.id !== pendingUserId)); // Eliminación local
        
    } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Unknown error trying to reject the request.' });
    } finally {
        setProcessing(prev => ({ ...prev, [pendingUserId]: false }));
    }
  };


  /**
   * Función principal para aprobar (SIMPLIFICADA a 2 pasos): 
   * 1. Crea el User (POST /api/Users/create).
   * 2. Elimina el PendingUser (DELETE /api/PendingUsers/{id}).
   */
  const handleApproveUser = async () => {
    if (!userToProcess) return;
    
    const pendingUser = userToProcess;
    const pendingUserId = pendingUser.id;
    const selectedRole = roles[pendingUserId];
    
    handleDialogClose(); 

    setProcessing(prev => ({ ...prev, [pendingUserId]: true }));
    setMessage(null);

    // DTO para crear el User
    const createUserDto = {
      email: pendingUser.email,
      name: pendingUser.name, 
      iamUserId: pendingUser.iamUserId || pendingUser.id, 
      role: selectedRole,
    };

    let success = false; 

    try {
      const token = await getAccessTokenSilently();
      
      // 1. Crear el User (POST /api/Users/create)
      const createResponse = await fetch(CREATE_USER_URL, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(createUserDto)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json(); 
        throw new Error(`Fail (1/2) creating User: ${createResponse.status} - ${errorData.Message || 'Unknown error'}. The PendingUser is still pending.`);
      }
      
      // 2. Eliminar el PendingUser (DELETE /api/PendingUsers/{id})
      const deleteResponse = await fetch(DELETE_PENDING_USER_URL(pendingUserId), {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          // Informamos al administrador que el usuario fue creado, pero la limpieza falló
          throw new Error(`Fail (2/2) deleting PendingUser. THE USER WAS CREATED, BUT PENDINGUSER DELETION FAILED. Error: ${deleteResponse.status} - ${errorData.Message || 'Unknown error'}`);
      }

      // Éxito total (Creación y Eliminación)
      setMessage({ type: 'success', text: `User ${pendingUser.email} approved, Role '${selectedRole}', and deleted succesfully from Pending Users. REMEMBER TO ACTIVATE THE USER MANUALLY in the Users Management page.` });
      success = true;

    } catch (err) {
      // Manejar cualquier error de la cadena de llamadas
      setMessage({ type: 'error', text: err.message || 'Unknown error during approval process.' });
    } finally {
      // 3. Eliminar el usuario de la lista local SOLO si el proceso fue exitoso
      if (success) {
        setPendingUsers(prev => prev.filter(u => u.id !== pendingUserId));
      }

      setProcessing(prev => ({ ...prev, [pendingUserId]: false }));
      setUserToProcess(null);
    }
  };


  // Función que se llama cuando se confirma la acción en el diálogo
  const handleProcessUser = () => {
    if (dialogAction === 'APPROVE') {
        handleApproveUser();
    } else if (dialogAction === 'REJECT' && userToProcess) {
        handleRejectUser(userToProcess);
        handleDialogClose(); 
    }
  };
  
  // Contenido del diálogo dinámico
  const getDialogContent = () => {
    if (!userToProcess) return null;
    
    if (dialogAction === 'APPROVE') {
        const selectedRole = roles[userToProcess.id];
        return {
            title: "Confirmar Aprobación de Usuario (2 Pasos)",
            text: `¿Do you confirm you want to accept user ${userToProcess.email} with the role ${selectedRole}? This will create a User in the main system and will delete it from the PendingUser list. The user will be created with an INACTIVE status.`,
            confirmText: "Approve (2 steps)",
        };
    } else if (dialogAction === 'REJECT') {
        return {
            title: "Confirmar Rechazo de Solicitud",
            text: `¿Do you confirm you want to permanently reject and delete the request from user ${userToProcess.email} from the Pending Users list? This action cannot be undone.`,
            confirmText: "Reject Request",
        };
    }
    return null;
  };

  const dialogContent = getDialogContent();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Management (Pending Users)</Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Approve and assign a role (creates an INACTIVE User and deletes the PendingUser) or simply reject and delete the request.
      </Typography>
      
      {/* Muestra el mensaje de estado (éxito/error) */}
      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)} >
          {message.text}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
          <Typography ml={2}>Loading pending Users...</Typography>
        </Box>
      ) : pendingUsers.length === 0 ? (
        <Alert severity="info">There aren't pending users.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="Pending users table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e8f5e9' }}> {/* Color verde suave para indicar acción pendiente */}
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>IamUserId (Auth0)</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Assign Rol</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell component="th" scope="row" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {user.iamUserId || user.id}
                  </TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <InputLabel>Rol</InputLabel>
                      <Select
                        value={roles[user.id] || AVAILABLE_ROLES[0]}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        label="Rol"
                        disabled={processing[user.id]}
                      >
                        {AVAILABLE_ROLES.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        
                        {/* Botón de APROBAR (Crea User, Elimina PendingUser) */}
                        <Tooltip title="Approve: Create INACTIVE User & Delete Pending Request (2 steps)">
                            <Button 
                                variant="contained" 
                                color="primary" // Cambiado a primary para distinguirlo del flujo de 3 pasos (Success)
                                onClick={() => handleConfirmAction(user, 'APPROVE')}
                                disabled={processing[user.id] || !roles[user.id]}
                                startIcon={<CheckCircleOutlineIcon />}
                                size="small"
                            >
                                {processing[user.id] ? <CircularProgress size={20} color="inherit" /> : 'Approve'}
                            </Button>
                        </Tooltip>

                        {/* Botón de RECHAZAR (Solo Elimina PendingUser) */}
                        <Tooltip title="Reject: Delete Pending Request only">
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={() => handleConfirmAction(user, 'REJECT')}
                                disabled={processing[user.id]}
                                startIcon={<DeleteIcon />}
                                size="small"
                            >
                                {processing[user.id] ? <CircularProgress size={20} color="inherit" /> : 'Reject'}
                            </Button>
                        </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Diálogo de Confirmación Dinámico (para Aprobar o Rechazar) */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        {dialogContent && (
            <>
                <DialogTitle id="confirm-dialog-title">{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {dialogContent.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleProcessUser} 
                        color={dialogAction === 'APPROVE' ? 'primary' : 'error'} 
                        variant="contained" 
                        autoFocus
                    >
                        {dialogContent.confirmText}
                    </Button>
                </DialogActions>
            </>
        )}
      </Dialog>
    </Container>
  );
};

export default PendingUserManagementPage;