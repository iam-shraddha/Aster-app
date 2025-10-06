import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const SidebarFooter = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('hospitalId');
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid',
        borderColor: 'divider',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOpen ? 'flex-start' : 'center',
        gap: 2,
        mb: 4,
      }}
    >
      {/* Logout Section */}
      <Tooltip title="Log out" placement="right">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOpen ? 'row' : 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          onClick={handleLogout}
        >
          <LogoutIcon
            sx={{
              color: 'primary.main',
              fontSize: 24, // Match size to nav items
            }}
          />
          {isOpen && (
            <Typography
              variant="body1" // Match typography to nav items
              color="text.primary"
            >
              Log out
            </Typography>
          )}
        </Box>
      </Tooltip>

      {/* Admin Panel Section */}
      <Tooltip title="Admin Portal" placement="right">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isOpen ? 'row' : 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          onClick={handleAdminClick}
        >
          <AdminPanelSettingsIcon
            sx={{
              color: 'primary.main',
              fontSize: 24, // Match size to nav items
            }}
          />
          {isOpen && (
            <Typography
              variant="body1" // Match typography to nav items
              color="text.primary"
            >
              Admin Portal
            </Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default SidebarFooter;
