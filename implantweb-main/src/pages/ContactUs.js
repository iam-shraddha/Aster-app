import React from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import Footer from './Footer';
import Navbar from "./Navbar";

const ContactUs = () => {
    return (
        <div style={{ overflowX: "hidden" }}>
            {/* Navbar Component */}
            <Navbar show={true} />
            {/* Background Image */}
            <Box
                sx={{
                    position: "relative",
                    backgroundImage: 'url(/images/about_us_main.jpg)', // Replace with your image URL
                    backgroundSize: 'cover',
                    backgroundPosition: "center",
                    height: "400px",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        textAlign: "center",
                        height: "400px",
                        width: "100%", // Ensure full width
                        maxWidth: "100%", // Prevent horizontal overflow
                    }}
                >
                    <Typography variant="h3">Contact Us</Typography>
                </Box>
            </Box>

            {/* Contact Information */}
            <Container sx={{ marginTop: 4, marginBottom: 4, }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: "100%",
                                backgroundImage: "url(/images/contact_img.jpg)", // Replace with your image URL
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                width: "100%", // Ensure full width
                                maxWidth: "100%",
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h4" gutterBottom>
                                Get in Touch
                            </Typography>
                            <Typography variant="body1" paragraph>
                                We’d love to hear from you! If you have any questions or need
                                assistance, feel free to contact us using the information below.
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Address:
                            </Typography>
                            <Typography variant="body1" paragraph>
                                C107 "Ganesh Nabhangan" Lane No 20 Raikar Nagar Dhayari Pune-41, Maharashtra India
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Email:
                            </Typography>
                            <Typography variant="body1" paragraph>
                                info@hyperminds.tech
                            </Typography>
                            <Button variant="contained" color="primary" size="large">
                                Send Message
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactUs;
