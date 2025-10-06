import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Facebook, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '8px 16px',
                textAlign: 'center',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1, // Consistent spacing between elements
                fontSize: '0.875rem', // Adjusted font size

            }}
        >
            <Typography variant="body2">
                Contact: <Link href="mailto:info@hyperminds.com" sx={{ color: 'inherit', textDecoration: 'none' }}>info@hyperminds.com</Link> | Phone: <Link href="tel:+918208658758" sx={{ color: 'inherit', textDecoration: 'none' }}>+91-8208658758</Link>, <Link href="tel:+918080704259" sx={{ color: 'inherit', textDecoration: 'none' }}>+91-8080704259</Link>
            </Typography>
            <Typography variant="body2">
                Made by HyperMinds Tech Private Limited
            </Typography>
            <Box>
                <Link href="https://www.facebook.com/share/1B58z74xoL/?mibextid=qi2Omg" target="_blank" sx={{ color: 'white', mx: 1 }}>
                    <Facebook fontSize="small" />
                </Link>

                <Link href="https://www.facebook.com/share/1B58z74xoL/?mibextid=qi2Omg" target="_blank" sx={{ color: 'white', mx: 1 }}>
                    <Instagram fontSize="small" />
                </Link>
                <Link href="https://www.linkedin.com/in/hyperminds-tech/" target="_blank" sx={{ color: 'white', mx: 1 }}>
                    <LinkedIn fontSize="small" />
                </Link>
            </Box>
        </Box>
    );
};

export default Footer;
