import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Modal, Card, IconButton, CircularProgress, useTheme, useMediaQuery, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import SearchBar from './SearchBar';
import PatientTable from './PatientTable';
import AddPatientForm from './AddPatientForm';
import Sidebar from '../../Sidebar';
import { useLocation } from 'react-router-dom';
import { fetchPatientsByHospital, addPatient, submitPatientImplantInfo, fetchPatientPdf, fetchAllImplantsforid, fetchImage1, fetchImage2 } from '../../services/api';
import { addImplantPrintHistory, getImplantPrintHistoryByHospital } from '../../services/dasboardAPI';
import { ToastContainer, toast } from 'react-toastify';
import DoctorSelect from './DoctorSelect';
import Footer from '../../pages/Footer';

const CARD_SIDE_OPTION = {
  FRONT: 'front',
  BACK: 'back',
  BOTH: 'both',
};

const CARD_SIDE_LABELS = {
  [CARD_SIDE_OPTION.FRONT]: 'Front Side',
  [CARD_SIDE_OPTION.BACK]: 'Back Side',
  [CARD_SIDE_OPTION.BOTH]: 'Both',
};

const CARD_SIDE_PREFERENCE_KEY = 'card_side_print_preference_v1';


const DashboardContent = ({ registrationNumber, hospitalId: propHospitalId }) => {
  const theme = useTheme();
  const location = useLocation();
  const hospitalId = propHospitalId || location.state?.hospitalId || localStorage.getItem('hospitalId');
  const [, setHistory] = useState([]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

  // Ensure no redeclaration of 'hospitalId'
  console.log('Hospital ID:', hospitalId);

  const [searchCategory, setSearchCategory] = useState('registrationNumber');
  const [searchValue, setSearchValue] = useState('');
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pageSize] = useState(1000);
  const [isOpen] = useState(true);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [cardSideSelection, setCardSideSelection] = useState(CARD_SIDE_OPTION.BOTH);
  const [saveCardSidePreference, setSaveCardSidePreference] = useState(false);

  useEffect(() => {
    try {
      const savedCardSide = localStorage.getItem(CARD_SIDE_PREFERENCE_KEY);
      if (
        savedCardSide === CARD_SIDE_OPTION.FRONT ||
        savedCardSide === CARD_SIDE_OPTION.BACK ||
        savedCardSide === CARD_SIDE_OPTION.BOTH
      ) {
        setCardSideSelection(savedCardSide);
        setSaveCardSidePreference(true);
      }
    } catch (error) {
      console.error('Failed to read saved card side preference:', error);
    }
  }, []);


  // const handlePageSizeChange = (event) => {
  //   setPageSize(event.target.value);
  // };

  // Fetch the patients by hospital ID
  useEffect(() => {
    if (hospitalId) {
      setLoading(true);  // Show loading indicator while fetching
      fetchPatients(hospitalId, pageSize);
    }
  }, [hospitalId, pageSize]);

  const fetchPatients = async (hospitalId, size) => {
    try {
      const fetchedPatients = await fetchPatientsByHospital(hospitalId, size);
      setPatients(fetchedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false); // Hide loading indicator after fetching
    }
  };

  useEffect(() => {
    if (typeof searchValue === "string" && searchValue.trim()) {
      const filtered = patients.filter((patient) => {
        const searchField =
          searchCategory === "registrationNumber"
            ? patient.registrationNumber
            : patient.patientName;
        return String(searchField)
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchValue, searchCategory, patients]);



  // const handleSearch = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // };




  const handleSubmitImplantInfo = async (patientDetails) => {
    if (!patientDetails) {
      toast.error("Patient details are required to submit implant information.");
      // alert("Patient details are required to submit implant information.");
      return;
    }

    try {
      const result = await submitPatientImplantInfo(patientDetails);
      console.log("Implant information saved successfully:", result);
      // toast.success("Patient implant information saved successfully!");
    } catch (error) {
      console.error("Error saving implant information:", error.message);
      toast.error(error.message || "An error occurred while saving the implant information.");
    }
  };





  const handleAddPatient = async (patientDetails) => {
    console.log('Adding patient with details:', patientDetails);

    try {
      // Fetch implant mapping
      const implantMap = await fetchAllImplantsforid();

      // Map the correct implant IDs for selected implants
      const selectedImplantIds = (patientDetails.implantTypes || []).map(
        (implantType) => implantMap[implantType]
      );

      console.log('Mapped implant IDs:', selectedImplantIds);

      if (!selectedImplantIds.length) {
        throw new Error('No valid implant IDs found for selected implants.');
      }

      // Call the addPatient API
      const response = await addPatient(patientDetails, hospitalId);

      console.log('Patient added successfully:', response);

      // Update the UI with the new patient
      setPatients((prev) => [
        ...prev,
        {
          id: patientDetails.registrationNumber, // Ensure patient ID is unique
          registrationNumber: patientDetails.registrationNumber,
          patientName: patientDetails.patientName,
          age: patientDetails.age,
          gender: patientDetails.gender,
          hospitalId: hospitalId,
        },
      ]);

      setShowAddPatientForm(false);
      setEditingPatient(null);

      // toast.success('Patient added successfully');

      // Prepare implant info and call submitPatientImplantInfo
      const patientImplantDetails = {
        patientId: patientDetails.registrationNumber,
        implantId: selectedImplantIds, // Use the mapped implant IDs
        implantTypes: patientDetails.implantTypes,
        operationSide: patientDetails.operationSide,
        operationDate: patientDetails.operationDate,
      };

      console.log('Submitting implant info for patient:', patientImplantDetails);

      await handleSubmitImplantInfo(patientImplantDetails);

      toast.success('Patient details with their Implant details added successfully');
      await fetchPatients(hospitalId);

      // Option 2: Force page reload
      window.location.reload();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = (patient) => {


    const mapGender = (genderCode) => {
      console.log('Mapping gender:', genderCode);
      switch (genderCode) {
        case 'M':
          return 'male';
        case 'F':
          return 'female';
        case 'O':
          return 'other';
        default:
          return '';
      }
    };


    const latestImplant = patient.implants?.length
      ? patient.implants.reduce((latest, current) => {
        const currentDate = new Date(current.operationDate);
        const latestDate = new Date(latest.operationDate);
        return currentDate > latestDate ? current : latest;
      }, patient.implants[0])
      : null;

    const editingData = {
      id: patient.id,
      registrationNumber: patient.registrationNumber,
      patientName: patient.patientName,
      age: patient.age,
      gender: mapGender(patient.gender || ''), // Correctly mapped gender
      operationSide: latestImplant?.operationSide || '',
      operationDate: latestImplant?.operationDate || '',
      implantTypes: patient.implantTypes || [],
    };

    console.log('Editing patient data:', editingData);
    setEditingPatient(editingData);
    setShowAddPatientForm(true);
  };

  const addHistory = async (registrationNumber) => {
    if (!registrationNumber) {
      return;
    }

    const newEntry = {
      hospitalId,
      patientId: registrationNumber,
      printDate: new Date().toISOString(),
    };

    try {
      await addImplantPrintHistory(newEntry);
      const updatedHistory = await getImplantPrintHistoryByHospital(hospitalId);
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error adding print history:', error);
    }
  };


  const onPreviewPatient = async (patient) => {
    if (!patient) {
      toast.error("No patient selected for preview.");
      return;
    }
    try {
      setIsPdfLoading(true);
      const pdfBlob = await fetchPatientPdf(patient.registrationNumber, hospitalId);
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setPdfContent(pdfUrl); // Set the fetched PDF URL for dialog
      setIsPreviewDialogOpen(true); // Open the dialog to show PDF
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Failed to generate preview.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  const closePreviewDialog = () => {
    setIsPreviewDialogOpen(false); // Close the dialog
    setPdfContent(''); // Clear the PDF content
  };

  const onPrintPatient = async (patient) => {
    if (!patient) {
      toast.error("No patient selected for export.");
      return;
    }

    setSelectedPatient(patient);
    setSelectedDoctorId(''); // Reset doctor selection
    setIsDoctorModalOpen(true);
  };

  const handleDoctorSelection = async () => {
    if (!selectedPatient) {
      toast.error("No patient selected for export.");
      return;
    }

    const { registrationNumber, hospitalId } = selectedPatient;

    try {
      if (saveCardSidePreference) {
        localStorage.setItem(CARD_SIDE_PREFERENCE_KEY, cardSideSelection);
      } else {
        localStorage.removeItem(CARD_SIDE_PREFERENCE_KEY);
      }

      // Show loader while fetching images
      toast.info("Generating cards. Please wait...");

      const imagePromises = [];
      if (cardSideSelection === CARD_SIDE_OPTION.FRONT || cardSideSelection === CARD_SIDE_OPTION.BOTH) {
        imagePromises.push(
          fetchImage1(registrationNumber, hospitalId, selectedDoctorId || null).then((url) => ({
            side: CARD_SIDE_OPTION.FRONT,
            url,
          }))
        );
      }
      if (cardSideSelection === CARD_SIDE_OPTION.BACK || cardSideSelection === CARD_SIDE_OPTION.BOTH) {
        imagePromises.push(
          fetchImage2(registrationNumber, hospitalId, selectedDoctorId || null).then((url) => ({
            side: CARD_SIDE_OPTION.BACK,
            url,
          }))
        );
      }

      const fetchedImages = await Promise.all(imagePromises);

      if (fetchedImages.length > 0) {
        await Promise.all(fetchedImages.map((image) => loadImage(image.url)));

        for (const image of fetchedImages) {
          await downloadImage(image.url, `${registrationNumber}_${image.side}_card.jpg`);
        }

        await addHistory(registrationNumber);
        toast.success(`Card ${CARD_SIDE_LABELS[cardSideSelection].toLowerCase()} generated successfully!`);
      } else {
        toast.error("Images are not available for export.");
      }
    } catch (error) {
      console.error("Error exporting images:", error);
      toast.error("An error occurred while generating cards.");
    } finally {
      setIsDoctorModalOpen(false);
      setSelectedPatient(null);
      setSelectedDoctorId('');
    }
  };

  const handleDirectPrint = async () => {
    if (!selectedPatient) {
      toast.error("No patient selected for printing.");
      return;
    }

    const { registrationNumber, hospitalId } = selectedPatient;

    try {
      if (saveCardSidePreference) {
        localStorage.setItem(CARD_SIDE_PREFERENCE_KEY, cardSideSelection);
      } else {
        localStorage.removeItem(CARD_SIDE_PREFERENCE_KEY);
      }

      // Show loader while fetching image
      toast.info("Generating card for printing. Please wait...");

      const imagePromises = [];
      if (cardSideSelection === CARD_SIDE_OPTION.FRONT || cardSideSelection === CARD_SIDE_OPTION.BOTH) {
        imagePromises.push(
          fetchImage1(registrationNumber, hospitalId, selectedDoctorId || null).then((url) => ({
            side: CARD_SIDE_OPTION.FRONT,
            url,
          }))
        );
      }
      if (cardSideSelection === CARD_SIDE_OPTION.BACK || cardSideSelection === CARD_SIDE_OPTION.BOTH) {
        imagePromises.push(
          fetchImage2(registrationNumber, hospitalId, selectedDoctorId || null).then((url) => ({
            side: CARD_SIDE_OPTION.BACK,
            url,
          }))
        );
      }

      const fetchedImages = await Promise.all(imagePromises);

      if (fetchedImages.length > 0) {
        await Promise.all(fetchedImages.map((image) => loadImage(image.url)));

        const printWindow = window.open('', '_blank');

        if (!printWindow) {
          toast.error("Pop-up blocked. Please allow pop-ups and try again.");
          return;
        }

        const cardHtml = fetchedImages
          .map(
            (image, index) => `
              <div class="card-container ${index < fetchedImages.length - 1 ? 'with-page-break' : ''}">
                <h2>${CARD_SIDE_LABELS[image.side]} Card - ${registrationNumber}</h2>
                <img src="${image.url}" alt="${CARD_SIDE_LABELS[image.side]} Card" />
              </div>
            `
          )
          .join('');

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print - ${registrationNumber}</title>
              <style>
                @media print {
                  body {
                    margin: 0;
                    padding: 10px;
                  }
                  .card-container {
                    page-break-after: avoid;
                    margin-bottom: 20px;
                  }
                  .with-page-break {
                    page-break-after: always;
                  }
                  h2 {
                    display: none;
                  }
                }
                @page {
                  margin: 0.5cm;
                }
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                .card-container {
                  margin-bottom: 20px;
                }
                h2 {
                  margin-bottom: 10px;
                  font-size: 18px;
                  color: #333;
                }
                img {
                  width: 100%;
                  max-width: 600px;
                  height: auto;
                  border: 1px solid #ccc;
                  display: block;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              ${cardHtml}
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        
        toast.success("Print preview opened!");
      } else {
        toast.error("Selected card image is not available for printing.");
      }
    } catch (error) {
      console.error("Error printing images:", error);
      toast.error("An error occurred while generating print preview.");
    } finally {
      setIsDoctorModalOpen(false);
      setSelectedPatient(null);
      setSelectedDoctorId('');
    }
  };

  const handleCloseDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setSelectedPatient(null);
    setSelectedDoctorId('');
  };

  // Helper function to ensure the image is fully loaded
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // Helper function to download an image
  const downloadImage = (src, fileName) => {
    return new Promise((resolve) => {
      const link = document.createElement("a");
      link.href = src; // This should be the URL or Blob URL of the image
      link.download = fileName; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    });
  };










  return (
    <Box>
      <Box>
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
                p: { xs: 2, md: 4 },
                borderRadius: '16px',
                backgroundColor: 'white',
                maxWidth: { xs: '95%', md: '1200px' },
                margin: '0 auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >

              {!showAddPatientForm ? (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap', // Wraps content on smaller screens
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4,
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
                      All Patients Details
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingPatient(null);
                        setShowAddPatientForm(true);
                      }}
                      sx={{
                        borderRadius: '8px',
                        background: 'linear-gradient(45deg, primary.main, primary.dark)',
                        px: 2, // Adjust padding for small screens
                        py: 1,
                        fontSize: { xs: '0.8rem', md: '1rem' },
                        mt: { xs: 2, md: 0 }, // Add margin for spacing on small screens
                      }}
                    >
                      Add New Patient
                    </Button>
                  </Box>

                  <SearchBar
                    searchCategory={searchCategory}
                    searchValue={searchValue}
                    onCategoryChange={setSearchCategory}
                    onSearchChange={setSearchValue}
                    allpatientdata={patients}
                  />


                  <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                    <PatientTable
                      patients={filteredPatients}
                      loading={loading}
                      onEditPatient={handleEditPatient}
                      onPreviewPatient={onPreviewPatient}
                      onPrintPatient={onPrintPatient}

                      sx={{ minWidth: '1000px' }} // Adjust this value based on the content width you expect
                    />
                  </Box>
                </>
              ) : (
                <AddPatientForm
                  onSubmit={handleAddPatient}
                  onCancel={() => {
                    setShowAddPatientForm(false);
                    setEditingPatient(null);
                  }}
                  prefilledData={editingPatient}
                />
              )}
            </Paper>


            <Modal
              open={isPreviewDialogOpen}
              onClose={closePreviewDialog}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <Card
                sx={{
                  width: { xs: '90%', md: '80%' }, // Responsive width
                  height: { xs: '90%', md: '80%' }, // Responsive height
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={closePreviewDialog}
                  sx={{
                    position: 'absolute',
                    top: 10, // Adjust for smaller screens
                    right: 10,
                    color: '#000',
                    backgroundColor: '#fff',
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {isPdfLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <iframe
                    src={pdfContent}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                    title="Patient Details PDF"
                  />
                )}
              </Card>
            </Modal>

            {/* Doctor Selection Modal */}
            <Modal
              open={isDoctorModalOpen}
              onClose={handleCloseDoctorModal}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              <Card
                sx={{
                  width: { xs: '90%', md: '500px' },
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  p: 3,
                }}
              >
                <IconButton
                  onClick={handleCloseDoctorModal}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: '#000',
                    backgroundColor: '#fff',
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    Generate Patient Cards
                  </Typography>
                  
                  {selectedPatient && (
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'faint.main', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Patient Details:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedPatient.patientName} ({selectedPatient.registrationNumber})
                      </Typography>
                    </Box>
                  )}

                  <DoctorSelect
                    value={selectedDoctorId}
                    onChange={setSelectedDoctorId}
                    hospitalId={hospitalId}
                    error={false}
                    helperText=""
                  />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Select card side:
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel
                        control={<Checkbox checked={cardSideSelection === CARD_SIDE_OPTION.FRONT} onChange={() => setCardSideSelection(CARD_SIDE_OPTION.FRONT)} />}
                        label="Front Side"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={cardSideSelection === CARD_SIDE_OPTION.BACK} onChange={() => setCardSideSelection(CARD_SIDE_OPTION.BACK)} />}
                        label="Back Side"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={cardSideSelection === CARD_SIDE_OPTION.BOTH} onChange={() => setCardSideSelection(CARD_SIDE_OPTION.BOTH)} />}
                        label="Both"
                      />
                    </FormGroup>
                    <FormControlLabel
                      sx={{ mt: 0.5 }}
                      control={
                        <Checkbox
                          checked={saveCardSidePreference}
                          onChange={(event) => setSaveCardSidePreference(event.target.checked)}
                        />
                      }
                      label="Save this setting for future"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseDoctorModal}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDoctorSelection}
                    disabled={!selectedDoctorId}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.400',
                        color: 'grey.700',
                      },
                    }}
                  >
                    Download Cards
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDirectPrint}
                    disabled={!selectedDoctorId}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'grey.400',
                        color: 'grey.700',
                      },
                    }}
                  >
                    Print Directly
                  </Button>
                </Box>
              </Card>
            </Modal>

          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 10 }}>
        <Footer />
      </Box>



    </Box>
  );
};


export default DashboardContent;
