import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, Avatar, ListItemText, Button, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import PrintIcon from '@mui/icons-material/Print';
import Sidebar from '../Sidebar';
import { fetchPatientsByHospital } from '../services/api';
import { getImplantPrintHistoryByHospital } from '../services/dasboardAPI';
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import Footer from './Footer';




const COLORS = ['#8884d8', '#82ca9d'];

// const patientsList = [
//     { name: 'John Doe', age: 34 },
//     { name: 'Jane Smith', age: 28 },
//     { name: 'Michael Johnson', age: 45 },
//     { name: 'Emily Davis', age: 32 },
// ];

function DashboardTracker() {

    const [patients, setPatients] = useState([]);
    const [numberOfPatients, setNumberOfPatients] = useState(0);
    const [numberOfPrints, setNumberOfPrints] = useState(0);
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const theme = useTheme();


    const location = useLocation();
    const hospitalId = location.state?.hospitalId || localStorage.getItem('hospitalId');
    const navigate = useNavigate();
    // Ensure no redeclaration of 'hospitalId'
    useEffect(() => {
        const fetchPatientsData = async () => {
            try {
                const response = await fetchPatientsByHospital(hospitalId, 100000);
                console.log('Patients API Response:', response);
                setPatients(response);
                console.log('Length:', response.length)
                setNumberOfPatients(response.length); // Ensure the number of patients is set after data is fetched
            } catch (error) {
                console.error('Failed to fetch patients:', error);
            }
        };
        fetchPatientsData();
    }, [hospitalId]);

    useEffect(() => {
        const fetchPrintHistory = async () => {
            try {
                const response = await getImplantPrintHistoryByHospital(hospitalId);
                console.log('Print History API Response:', response);

                if (response.length === 0) {
                    console.error('No print history data available');
                    return;
                }
                console.log('length:', response.numberOfPrints)
                setNumberOfPrints(response?.numberOfPrints || 0);


                const monthlyData = response.printHistory.reduce((acc, record) => {
                    const printDate = new Date(record.printDate);
                    const month = printDate.toLocaleString('default', { month: 'long' });
                    const year = printDate.getFullYear();
                    const monthYear = `${month} ${year}`;
                    if (!acc[monthYear]) {
                        acc[monthYear] = { patients: new Set(), prints: 0 };
                    }

                    acc[monthYear].prints += 1;
                    acc[monthYear].patients.add(record.patientId);

                    return acc;
                }, {});

                const formattedData = Object.keys(monthlyData).map((monthYear) => {
                    return {
                        name: monthYear,
                        patients: monthlyData[monthYear].patients.size,
                        prints: monthlyData[monthYear].prints,
                    };
                });

                console.log('Formatted Print Data:', formattedData);
                setData(formattedData);
            } catch (error) {
                console.error('Failed to fetch implant print history:', error);
            }
        };
        fetchPrintHistory();
    }, [hospitalId]);



    // Pie chart data
    const pieData = [
        { name: 'Patients', value: numberOfPatients },
        { name: 'Prints', value: numberOfPrints },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', marginBottom: '100px' }}>
                <Sidebar />
                <Box
                    sx={{
                        flexGrow: 1,
                        p: { xs: 1, md: 3 },
                        backgroundColor: 'faint.main',
                        minHeight: '100vh',
                        transition: 'margin-left 0.3s',
                        marginLeft: { xs: 0, md: (isOpen ? '190px' : '60px') }, // Adjust based on sidebar state

                    }}
                >

                    {/* <ToastContainer position="top-right" autoClose={3000} /> */}
                    <Paper
                        elevation={5}
                        sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: '16px',
                            backgroundColor: 'white',
                            maxWidth: { xs: '95%', md: '1200px' }, // Adjust width for small screens
                            margin: '0 auto',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                textAlign: "center",
                                letterSpacing: "0.1em",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                                marginBottom: "16px",
                                padding: "8px",
                                background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Dashboard
                        </Typography>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: 2,
                                        textAlign: 'center',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                >
                                    <Typography variant="h6" color='blue'>Number of Patients</Typography>
                                    <PeopleIcon
                                        fontSize="large"
                                        sx={{
                                            color: 'primary.main',
                                            transition: 'color 0.3s',
                                            '&:hover': { color: 'blue' },
                                        }}
                                    />
                                    <Typography variant="h4">{numberOfPatients}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: 2,
                                        textAlign: 'center',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}
                                >
                                    <Typography variant="h6" color='blue'>Number of Prints</Typography>
                                    <PrintIcon
                                        fontSize="large"
                                        sx={{
                                            color: 'primary.main',
                                            transition: 'color 0.3s',
                                            '&:hover': { color: 'blue' },
                                        }}
                                    />
                                    <Typography variant="h4">{numberOfPrints}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={3} sx={{ padding: 3, height: '100%', '&:hover': { transform: 'scale(1.05)' }, }}>
                                        <Typography variant="h6" gutterBottom color='blue'>
                                            Overview
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    label
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={3} sx={{ padding: 3, height: '100%', '&:hover': { transform: 'scale(1.05)' }, }}>
                                        <Typography variant="h6" gutterBottom color="blue">
                                            Patient List
                                        </Typography>
                                        <List>
                                            {patients.slice(0, 5).map((patient, index) => {  // Only map the first 10 patients
                                                // Log patient name and age for debugging
                                                console.log(`Patient Name: ${patient.patientName}, Age: ${patient.age}`);
                                                return (
                                                    <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
                                                        <Avatar sx={{ marginRight: 2 }}>
                                                            {patient.patientName.charAt(0)}
                                                        </Avatar>
                                                        <ListItemText
                                                            primary={patient.patientName}
                                                            secondary={`Age: ${patient.age}`}
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                        </List>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginTop: 2 }}
                                            onClick={() => navigate('/patient')} // Navigate to the patient page
                                        >
                                            More Patient
                                        </Button>

                                    </Paper>
                                </Grid>

                            </Grid>
                        </Grid>

                        {/* Line Chart */}
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom sx={{ marginTop: 10 }} color='blue'>
                                Patient & Print Statistics
                            </Typography>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 3,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="patients" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="prints" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                    </Paper>

                </Box>
            </Box>
            <Footer />
        </Box>
    );
}

export default DashboardTracker;