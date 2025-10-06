import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";



// const features = [
//     "Scientific skills for getting a better result",
//     "A good environment for work",
//     "Professional doctors",
//     "Digital laboratory",
//     "Emergency services",
// ];

// const StyledIcon = styled(CheckCircleIcon)(({ theme }) => ({
//     color: theme.palette.primary.main,
//     transition: "color 0.3s",
//     "&:hover": {
//         color: theme.palette.secondary.main,
//     },
// }));

// const StyledListItem = styled(ListItem)(({ theme }) => ({
//     "&:hover": {
//         backgroundColor: theme.palette.action.hover,
//         borderRadius: "8px",
//         transition: "background-color 0.3s",
//     },
// }));

const HomeAboutUs = () => {
    // const theme = useTheme();

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "faint.main",
                minHeight: "100vh",
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: "16px",
                    backgroundColor: "white",
                    maxWidth: { xs: "95%", md: "1200px" },
                    margin: "0 auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <Grid container spacing={4} alignItems="center">
                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="/images/home_aboutus.jpg"
                            alt="About Us"
                            sx={{
                                width: "100%",
                                height: "550px",
                                borderRadius: "16px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                transition: "transform 0.3s",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                },
                            }}
                        />
                    </Grid>

                    {/* Info Section */}
                    <Grid item xs={12} md={6}>

                        {/* <Typography variant="h5" gutterBottom> About Us</Typography> */}


                        <Typography
                            variant="body1"
                            sx={{
                                marginBottom: "20px",
                                color: "text.secondary",
                                lineHeight: 1.8,
                            }}
                        >
                            At HyperMinds Tech, innovation drives opportunity. We specialize in delivering cutting-edge technology solutions that empower businesses to scale seamlessly and achieve transformative growth.

                            Our expertise spans advanced cloud infrastructure, AI-driven insights, and DevOps automation, ensuring your business stays ahead in an ever-evolving digital landscape. With a team of seasoned professionals, we craft tailored strategies to enhance efficiency, agility, and profitability.

                            Partner with HyperMinds Tech to bridge today’s challenges with tomorrow’s possibilities. Together, we’ll unlock new horizons and shape a future defined by success and innovation.
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                padding: 2,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 2,
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                maxWidth: "350px",
                            }}
                        >
                            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
                                Office Address:
                            </Typography>
                            <Typography sx={{ color: "#555" }}>
                                C107 "Ganesh Nabhangan" Lane No 20 Raikar Nagar Dhayari Pune-41
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
                                Email us:
                            </Typography>
                            <Typography sx={{ color: "#555" }}>info@hyperminds.tech</Typography>
                            <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
                                Contact us:
                            </Typography>
                            <Typography sx={{ color: "#555" }}>
                                +91-8208658758 / +91-8080704259
                            </Typography>
                        </Box>

                        {/* <Button
                            variant="contained"
                            color="primary"
                            href="/about"
                            sx={{
                                marginTop: "20px",
                                alignSelf: "flex-end",
                                textTransform: "uppercase",
                                fontWeight: "bold",
                                transition: "transform 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            Read More
                        </Button> */}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default HomeAboutUs;
