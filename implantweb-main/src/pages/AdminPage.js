import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Fade,
  useMediaQuery,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Sidebar from "../Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import Footer from "./Footer";

function AdminPage() {
  const theme = useTheme();
  const [formChanges, setFormChanges] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: [],
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [setAuditTrail] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (formChanges.logo.length > 0) {
      const urls = formChanges.logo.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [formChanges.logo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormChanges((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormChanges((prev) => ({ ...prev, logo: [...prev.logo, ...files] }));
  };

  const handlePreview = () => {
    const requiredFields = ["name", "email", "phone", "address"];
    const incompleteFields = requiredFields.some(
      (field) => !formChanges[field]
    );

    if (incompleteFields) {
      toast.warn("Please fill all required fields before previewing.");
      return;
    }

    setPreviewMode(true);
  };

  const handleSave = () => {
    if (Object.keys(formChanges).length === 0) {
      toast.warn(
        "Hospital information is already up to date. Make changes to update."
      );
      return;
    }

    setAuditTrail((prev) => [
      {
        date: new Date().toLocaleString(),
        changes: { ...formChanges },
      },
      ...prev,
    ]);

    setFormChanges({
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: [],
    });
    setImageUrls([]);
    setPreviewMode(false);

    toast.success("Hospital information updated successfully!");
  };

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
            <ToastContainer position="top-right" autoClose={3000} />
            <Paper
              elevation={5}
              sx={{
                p: { xs: 4, md: 6, lg: 8 },
                borderRadius: '16px',
                backgroundColor: 'white',
                maxWidth: { xs: '95%', md: '1200px' }, // Adjust width for small screens
                width: '100%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <Fade in timeout={500}>
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
                  Update Hospital Information
                </Typography>
              </Fade>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: "100%",
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Hospital Name"
                      name="name"
                      value={formChanges.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formChanges.email}
                      onChange={handleChange}
                      required
                      type="email"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formChanges.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      inputProps={{ pattern: "\\d{10}" }}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formChanges.address}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      Upload Logo
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={handleLogoUpload}
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} display="flex" gap={2} flexWrap="wrap">
                    {imageUrls.map((url, index) => (
                      <Avatar
                        key={index}
                        src={url}
                        alt={`Uploaded Image ${index + 1}`}
                        sx={{
                          width: 100,
                          height: 100,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    ))}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center", // Center buttons horizontally
                      alignItems: "center",      // Align buttons vertically
                      gap: 2,
                      flexDirection: "row",      // Make buttons align horizontally
                      width: "100%",             // Make the container span full width
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePreview}
                      sx={{
                        padding: "10px 20px",     // Add padding for better text spacing
                        fontSize: "1rem",
                        m: 1,
                        textAlign: "center",      // Ensure text is centered
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSave}
                      sx={{
                        padding: "10px 20px",     // Add padding for better text spacing
                        fontSize: "1rem",
                        m: 1,
                        textAlign: "center",      // Ensure text is centered
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Dialog
                open={previewMode}
                onClose={() => setPreviewMode(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Preview Mode</DialogTitle>
                <DialogContent dividers>
                  <Typography variant="body1">
                    <strong>Hospital Name:</strong> {formChanges.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {formChanges.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {formChanges.phone}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {formChanges.address}
                  </Typography>
                  {imageUrls.map((url, index) => (
                    <Avatar
                      key={index}
                      src={url}
                      alt={`Uploaded Preview ${index + 1}`}
                      sx={{ width: 100, height: 100, marginTop: 2 }}
                    />
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setPreviewMode(false)}>Close</Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Box>
        </Box>

      </Box>
      <Footer />
    </Box>
  );
}

export default AdminPage;
