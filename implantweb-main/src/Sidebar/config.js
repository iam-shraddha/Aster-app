import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';

export const navItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Patients',
    icon: <PeopleIcon />,
    path: '/patient',
  },
  // {
  //   text: 'Admin Page',
  //   icon: <AdminPanelSettingsIcon />,
  //   path: '/admin',
  // },
  {
    text: 'About Us',
    icon: <InfoIcon />,
    path: '/about',
  },


];