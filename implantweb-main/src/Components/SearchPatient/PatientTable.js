import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  TablePagination,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import EnhancedPagination from './EnhancedPagination';

const PatientTable = ({ patients, loading, onEditPatient, onPreviewPatient, onPrintPatient }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0); // Reset page to 0 when rows per page is changed
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0'); // Ensures 2-digit day
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase(); // 3-letter month in uppercase
      const year = date.getFullYear();
      return `${day}_${month}_${year}`;
    } catch (error) {
      console.error('Invalid date format:', dateString, error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>

      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderRadius: '12px',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'success.main' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Reg. Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', width: '20%' }}>Implant Types</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Operation Side</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Operation Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => {
                return (
                  <TableRow
                    key={patient.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell>{patient.registrationNumber}</TableCell>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.implantTypes.length > 0 ? patient.implantTypes.join(', ') : 'N/A'}</TableCell>
                    <TableCell>{patient.operationSide || 'N/A'}</TableCell>
                    <TableCell>
                      {(() => {
                        const operationDates = typeof patient.operationDate === 'string'
                          ? patient.operationDate.split(',').map(date => date.trim()) // Split and trim
                          : Array.isArray(patient.operationDate)
                            ? patient.operationDate
                            : []; // Ensure it's an array or an empty array

                        const parsedDates = operationDates
                          .map(date => new Date(date).getTime())
                          .filter(date => !isNaN(date)); // Filter valid dates

                        return parsedDates.length > 0
                          ? formatDate(new Date(Math.max(...parsedDates))) // Latest date
                          : 'N/A';
                      })()}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => onEditPatient(patient)}
                        aria-label="edit"
                        sx={{ color: 'secondary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onPreviewPatient(patient)}
                        aria-label="preview"
                        sx={{ color: 'secondary.main' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onPrintPatient(patient)}
                        aria-label="print"
                        sx={{ color: 'secondary.main' }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5]}
      />

      <EnhancedPagination
        count={patients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(e) => handleRowsPerPageChange(e)}
      />
    </Box>
  );
};

export default PatientTable;
