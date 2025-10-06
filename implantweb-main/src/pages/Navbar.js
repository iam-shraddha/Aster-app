import React from 'react';
import { AppBar, Toolbar, Typography, Button, Slide } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = ({ show }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the login page
    };
    const handleAboutClick = () => {
        navigate('/about'); // Navigate to the About page
    };
    const handleContactClick = () => {
        navigate('/contact');
    }


    return (
        <Slide direction="down" in={show} mountOnEnter unmountOnExit>
            <AppBar
                sx={{
                    backgroundColor: '#001f33', // Semi-transparent black background
                    position: 'fixed', // Keep the navbar fixed on top
                    top: 0,
                    zIndex: 1201, // Ensure it's above other components
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div">
                        <img src="/images/implant_pass-rb.png" alt="Logo" style={{ maxHeight: '40px' }} />
                    </Typography>
                    <div>
                        <Button sx={{ color: 'white' }} startIcon={<HomeIcon />} onClick={() => navigate('/')}>
                            Home
                        </Button>
                        <Button sx={{ color: 'white' }} startIcon={<InfoIcon />} onClick={handleAboutClick}>
                            About Us
                        </Button>
                        <Button sx={{ color: 'white' }} startIcon={<ContactMailIcon />} onClick={handleContactClick}>
                            Contact Us
                        </Button>
                        <Button sx={{ color: 'white' }} startIcon={<LoginIcon />} onClick={handleLoginClick}>
                            Login
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
        </Slide>
    );
};

export default Navbar;