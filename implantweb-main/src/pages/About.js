import React, { useState } from 'react';
import { Box, Typography, useTheme, Paper, useMediaQuery } from '@mui/material';
import Footer from './Footer';
import HomeAboutUs from './Home_AboutUs';
import Sidebar from '../Sidebar';

const About = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(true);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box
                        sx={{
                            flexGrow: 1,
                            p: { xs: 2, md: 4 },
                            backgroundColor: 'faint.main',
                            transition: 'margin-left 0.3s',
                            marginLeft: isSmallScreen ? 0 : isOpen ? '190px' : '60px',
                            width: isSmallScreen ? '100%' : 'calc(100% - (isOpen ? 190px : 60px))',
                        }}

                    >
                        <Paper
                            elevation={5}
                            sx={{
                                p: { xs: 2, md: 4 },
                                borderRadius: '16px',
                                backgroundColor: 'white',
                                maxWidth: { xs: '95%', md: '1200px' },
                                margin: '0 auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    lineHeight: 1.5,
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                About Us
                            </Typography>

                            <Typography variant="h5" gutterBottom>
                                Implant Pass+
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    marginBottom: '20px',
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                }}
                            >
                                The Patient Implant(metal) card system will enable users to create a card for patients with
                                a detailed summary of surgery and the type of implant present in the body of the patient.
                                To be given with the patient at the time of discharge.
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    backgroundColor: 'faint.main',
                    transition: 'margin-left 0.3s',
                    marginLeft: isSmallScreen ? 0 : isOpen ? '190px' : '60px',
                    width: isSmallScreen ? '100%' : 'calc(100% - (isOpen ? 190px : 60px))',
                }}
            >
                <HomeAboutUs />
            </Box>

            {/* Footer Component */}
            <Footer />
        </Box >

    );
};

export default About;
