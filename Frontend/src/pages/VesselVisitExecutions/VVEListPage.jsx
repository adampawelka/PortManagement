import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Alert } from "@mui/material";
import { useVVEListVM } from "../../viewmodels/VesselVisitExecutions/useVVEListVM";

const VVEListPage = () => {
  const vm = useVVEListVM();
  const navigate = useNavigate();

  if (vm.loading) return <Typography>Loading VVE list...</Typography>;
  if (vm.error) return <Alert severity="error">{vm.error}</Alert>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" mb={2}>Vessel Visit Executions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>VVN ID</TableCell>
              <TableCell>Vessel Name</TableCell>
              <TableCell>Dock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vm.vveList.map(vve => (
              <TableRow key={vve.id}>
                <TableCell>{vve.vvnId}</TableCell>
                <TableCell>{vve.vesselName}</TableCell>
                <TableCell>{vve.dock}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate(`/vve/${vve.id}/update`)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default VVEListPage;
