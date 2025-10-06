import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Button, DialogActions, TextField, DialogTitle, DialogContent, Dialog } from '@mui/material';
import Navbar from './Navbar'; // Sliding Navbar
import Footer from './Footer';
import theme from '../theme/theme';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import { SiteName, TopBarContainer } from './HomeStyle';
import { Edit as EditIcon, Preview as PreviewIcon } from '@mui/icons-material';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HomeAboutUs from './Home_AboutUs';
import { useNavigate } from 'react-router-dom';


// TopBar Component
const TopBar = () => (
    <TopBarContainer sx={{ backgroundColor: "#FFFFFF", padding: 1 }}>
        <Box>
            <Typography variant="body2" sx={{ display: 'inline-block', marginRight: '20px' }}>
                contact@implantcard.com
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline-block' }}>
                +123 456 789
            </Typography>
        </Box>
        <SiteName
            variant="h6"
            sx={{
                display: 'inline-block',

                fontWeight: 'bold',
                fontSize: '1rem',
                zIndex: 1000,
            }}
        >
            Implant Card
        </SiteName>
    </TopBarContainer>
);

// Static Navbar Component
const StaticNavbar = ({ onLoginClick, onAboutClick, onContactClick, onHomeClick }) => (
    <Box
        sx={{
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            zIndex: 10,
            padding: 1,
        }}
    >
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 1px' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <img src="/images/implant_pass-rb.png" alt="Logo" style={{ maxHeight: '40px' }} />
                </Typography>
                <div>
                    <Button sx={{ color: 'white' }} startIcon={<HomeIcon />} onClick={() => onHomeClick()}>
                        Home
                    </Button>
                    <Button sx={{ color: 'white' }} startIcon={<HomeIcon />} onClick={() => onAboutClick()}>
                        About Us
                    </Button>
                    <Button sx={{ color: 'white' }} startIcon={<ContactMailIcon />} onClick={() => onContactClick()}>
                        Contact Us
                    </Button>
                    <Button sx={{ color: 'white' }} startIcon={<LoginIcon />} onClick={() => onLoginClick()}>
                        Login
                    </Button>
                </div>
            </Box>
        </Container>


    </Box>
);

// Image Component with Navigation
const ImageWithNavigation = () => (
    <Box sx={{ position: 'relative', width: '100%', height: '700px', overflow: 'hidden', display: 'flex' }}>
        <img
            src="/images/slider_img1.jpg"
            alt="Main Image"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                zIndex: -1,
            }}
        />

        {/* Left Half with Overlay */}
        <Box
            sx={{
                position: 'relative', // Change to relative
                width: '50%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '40px',
                boxSizing: 'border-box',
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 'bold',
                    marginBottom: 2,
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                }}
            >
                Welcome to Our Site
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    marginBottom: 4,
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                }}
            >
                Explore Our Services
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    marginBottom: 4,
                    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)',
                }}
            >
                We are here to provide the best services and are committed to your health and well-being.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                href="/login"
                sx={{
                    fontWeight: 'bold',
                }}
            >
                Join Us
            </Button>
        </Box>

        {/* Right Half with Icon/Image */}
        <Box
            sx={{
                width: '50%',
                height: '100%', // Ensure it takes full height
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional overlay for better contrast
            }}
        >
            <img
                src="/images/logo_1.jpg" // Replace with your icon or image path
                alt="Icon or Image"
                style={{
                    width: '40%', // Adjust size as needed
                    height: 'auto',
                    opacity: 0.8, // Optional opacity for better blending
                }}
            />
        </Box>
    </Box>
);

// Home Component
const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => navigate('/login');
    const handleAboutClick = () => navigate('/about');
    const handleContactClick = () => navigate('/contact');
    const handleHomeClick = () => navigate('/')

    const [showSlidingNavbar, setShowSlidingNavbar] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const [openDialog, setOpenDialog] = useState(false); // State to open and close the dialog
    const [openImageDialog, setOpenImageDialog] = useState(false); // State for image dialog

    const handleDialogOpen = () => setOpenDialog(true);
    const handleDialogClose = () => setOpenDialog(false);

    const handleImageDialogOpen = () => setOpenImageDialog(true);
    const handleImageDialogClose = () => setOpenImageDialog(false);

    const appDownloadLink = "https://yourappdownloadlink.com";

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show sliding navbar when scrolling up
            if (currentScrollY < lastScrollY && currentScrollY > 100) {
                setShowSlidingNavbar(true);
            }
            // Show sliding navbar when static navbar goes out of view
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowSlidingNavbar(true);
            }
            // Hide sliding navbar when scrolling down or near the top
            else if (currentScrollY <= 100) {
                setShowSlidingNavbar(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* Top Bar */}
            <TopBar />


            {/* Static Navbar */}
            <StaticNavbar
                onLoginClick={handleLoginClick}
                onAboutClick={handleAboutClick}
                onContactClick={handleContactClick}
                onHomeClick={handleHomeClick}
            />

            {/* Sliding Navbar - Visible when scrolling up or static navbar is out of view */}
            <Navbar show={showSlidingNavbar} />

            {/* Image with Navigation */}
            <ImageWithNavigation />

            <Container
                sx={{
                    // marginTop: 4,
                    textAlign: 'center',
                    // backgroundColor: '#001f33',
                    padding: 4,
                    width: '100%',
                    // borderRadius: 2,
                }}
            >



                {/* Feature Sections */}
                <Container sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            marginBottom: 4,
                            textAlign: 'center',
                            color: '#4fb3ab',
                            fontWeight: 'bold',
                        }}
                    >
                        Our Features
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {/* First Feature Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    padding: 2,
                                    border: '2px dashed',
                                    borderColor: theme.palette.primary.main,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: 3,
                                    backgroundColor: theme.palette.background.paper,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'rotateY(180deg)', // Hover effect for flip
                                    },
                                    height: '200px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    flexDirection: 'column',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Front of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden', // Prevents the front side from showing when flipped
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                        backgroundImage: 'url(/images/edit_implant.jpg)', // Set your background image path here
                                        backgroundSize: 'cover', // Cover the entire box
                                        backgroundPosition: 'center', // Center the image
                                        backgroundRepeat: 'no-repeat',
                                        borderRadius: 2,

                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "#FFFFFF",
                                            background: 'rgba(11, 160, 128, 0.5)',
                                            animation: 'fadeIn 1s ease-out', // Animation for heading
                                        }}
                                    >
                                        Implant List
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#FFFFFF", background: 'rgba(11, 160, 128, 0.5)', }}>
                                        Edit Implant List
                                    </Typography>

                                </Box>

                                {/* Back of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        transform: 'rotateY(180deg)',
                                        backgroundColor: theme.palette.background.paper,
                                        padding: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                        You can edit implant list here.
                                    </Typography>
                                    {/* Add the button only on the back side */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginTop: 2 }}
                                        onClick={handleDialogOpen} // Open dialog on button click
                                        startIcon={<EditIcon />}
                                    >
                                        Edit List
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Second Feature Card */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    padding: 2,
                                    border: '2px dashed',
                                    borderColor: theme.palette.primary.main,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: 3,
                                    backgroundColor: theme.palette.background.paper,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'rotateY(180deg)', // Hover effect for flip
                                    },
                                    height: '200px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    flexDirection: 'column',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Front of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                        backgroundImage: 'url(/images/sample_product.jpg)', // Set your background image path here
                                        backgroundSize: 'cover', // Cover the entire box
                                        backgroundPosition: 'center', // Center the image
                                        backgroundRepeat: 'no-repeat',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "#FFFFFF",
                                            background: 'rgba(11, 160, 128, 0.5)',
                                            animation: 'fadeIn 1s ease-out', // Animation for heading
                                        }}
                                    >
                                        Sample Product
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#FFFFFF", background: 'rgba(11, 160, 128, 0.5)', }}>
                                        Here is our sample card if you want to see.
                                    </Typography>

                                </Box>

                                {/* Back of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        transform: 'rotateY(180deg)',
                                        backgroundColor: theme.palette.background.paper,
                                        padding: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                        More Info about Sample Product
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginTop: 2 }}
                                        onClick={handleImageDialogOpen} // Open image preview dialog
                                        startIcon={<PreviewIcon />}
                                    >
                                        Preview Image
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Third Feature Card - Our App Description */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    padding: 2,
                                    border: '2px dashed',
                                    borderColor: theme.palette.primary.main,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    boxShadow: 3,
                                    backgroundColor: theme.palette.background.paper,
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'rotateY(180deg)', // Hover effect for flip
                                    },
                                    height: '200px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    flexDirection: 'column',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Front of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                        backgroundImage: 'url(/images/explore_app.jpg)', // Set your background image path here
                                        backgroundSize: 'cover', // Cover the entire box
                                        backgroundPosition: 'center', // Center the image
                                        backgroundRepeat: 'no-repeat',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: "#FFFFFF",
                                            background: 'rgba(11, 160, 128, 0.5)',
                                            animation: 'fadeIn 1s ease-out', // Animation for heading
                                        }}
                                    >
                                        Our App Description
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#FFFFFF", background: 'rgba(11, 160, 128, 0.5)', }}>
                                        Explore our app and enjoy exclusive features. Download now!
                                    </Typography>

                                </Box>

                                {/* Back of the card */}
                                <Box
                                    sx={{
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        transform: 'rotateY(180deg)',
                                        backgroundColor: theme.palette.background.paper,
                                        padding: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                                        You can explore our app now!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginTop: 2 }}
                                        startIcon={<SmartphoneIcon />}
                                        onClick={() => window.location.href = appDownloadLink} // Redirect to app download
                                    >
                                        Download App
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Container>
            {/* Dialog for editing the implant list */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Edit Implant List</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="implant-Id"
                        label="Implant Id"
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="implant-name"
                        label="Implant Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="implant-company-name"
                        label="Implant Company Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        id="implant-description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogClose} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for previewing the image */}
            <Dialog open={openImageDialog} onClose={handleImageDialogClose}>
                <DialogTitle>Sample Product Preview</DialogTitle>
                <DialogContent>
                    <img src="/images/card_img.jpg" alt="Sample Product" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImageDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <HomeAboutUs />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;