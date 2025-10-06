import React, { useState } from 'react';
import { Box, Tab, Tabs, TablePagination, Typography } from '@mui/material';

const EnhancedPagination = ({ count, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleTabChange = (event, newValue) => {
    onPageChange(event, newValue);
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '16px',
      }}
    >
      <Tabs
        value={page}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="pagination tabs"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.875rem',
            padding: '8px 16px',
          },
          '& .MuiTab-wrapper': {
            fontWeight: 'bold',
          },
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => (
          <Tab key={index} label={`Page ${index + 1}`} value={index} />
        ))}
      </Tabs>

      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 15, 20]}
        sx={{
          '& .MuiTablePagination-toolbar': {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mt: 2,
          },
          '& .MuiTablePagination-actions': {
            alignItems: 'center',
          },
          '& .MuiTablePagination-select': {
            minWidth: '60px',
          },
        }}
      />
      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
        Showing {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, count)} of {count} items
      </Typography>
    </Box>
  );
};

export default EnhancedPagination;
