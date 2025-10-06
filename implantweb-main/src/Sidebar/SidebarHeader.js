import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

const SidebarHeader = ({ isOpen, onToggle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {isOpen && (
        <Typography variant="h6" color="primary" sx={{marginTop:3}}>
          Implant Pass+
        </Typography>
      )}
      <IconButton onClick={onToggle}>
        {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};

export default SidebarHeader;