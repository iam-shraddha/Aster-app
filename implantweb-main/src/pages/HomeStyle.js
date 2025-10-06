import { styled } from '@mui/system';
import { Box, Typography, Paper, Button } from '@mui/material';

// Top Bar container with styles
export const TopBarContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 2,
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

// Site name styling
export const SiteName = styled(Typography)(({ theme }) => ({
    fontSize: '24px',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
}));

// Paper component for feature sections
export const FeaturePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    boxShadow: theme.shadows[4],
    backgroundColor: '#fff',
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),
    },
}));

// Typography for Feature Titles
export const FeatureTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.primary.main,
}));

// Navbar button styling
export const NavbarButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    color: '#fff',
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
    },
}));

// Image Slider container styling
export const ImageSliderContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    width: '100%',
}));

// Section title styling
export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '2rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
}));
