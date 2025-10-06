import React, { useState } from 'react';
import { Box, Drawer, List, IconButton, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import NavItem from './NavItem';
import { navItems } from './config';

const DRAWER_WIDTH = 190;

const DrawerWrapper = styled(Box)(({ theme, isopen }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1300,
  '& .MuiDrawer-paper': {
    whiteSpace: 'nowrap',
    width: isopen ? DRAWER_WIDTH : theme.spacing(7),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!isopen && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Toggle Button for Small Screens */}
      {isSmallScreen && (
        <IconButton
          onClick={toggleMobileDrawer}
          sx={{
            position: 'fixed',
            top: 16,
            left: 18,
            zIndex: 1500,
            color: 'secondary.main',
            cursor: 'pointer',
            bgcolor: 'background.paper',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      {!isSmallScreen ? (
        <DrawerWrapper isopen={isOpen ? 1 : 0}>
          <Drawer
            variant="permanent"
            open={isOpen}
            sx={{
              height: '100vh',
            }}
          >
            <SidebarHeader isOpen={isOpen} onToggle={toggleDrawer} />
            <List sx={{ flex: 1, pt: 1 }}>
              {navItems.map((item) => (
                <NavItem key={item.text} item={item} isOpen={isOpen} />
              ))}
            </List>
            <SidebarFooter isOpen={isOpen} />
          </Drawer>
        </DrawerWrapper>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{
            keepMounted: true, // Improves performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <SidebarHeader isOpen={true} onToggle={toggleMobileDrawer} />
          <List sx={{ flex: 1, pt: 1 }}>
            {navItems.map((item) => (
              <NavItem key={item.text} item={item} isOpen={true} />
            ))}
          </List>
          <SidebarFooter isOpen={true} />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
