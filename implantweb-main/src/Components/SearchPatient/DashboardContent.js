import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Modal, Card, IconButton, CircularProgress, useTheme, useMediaQuery, } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import SearchBar from './SearchBar';
import PatientTable from './PatientTable';
import AddPatientForm from './AddPatientForm';
import Sidebar from '../../Sidebar';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { fetchPatientsByHospital, addPatient, submitPatientImplantInfo, fetchPatientPdf, fetchAllImplantsforid, useFetchImages, fetchImplantPdfforPreview, fetchImage1, fetchImage2 } from '../../services/api';
import { addImplantPrintHistory, getImplantPrintHistoryByHospital } from '../../services/dasboardAPI';
import { ToastContainer, toast } from 'react-toastify';
import Footer from '../../pages/Footer';
import EnhancedPagination from './EnhancedPagination';


const DashboardContent = ({ registrationNumber, hospitalId: propHospitalId }) => {
  const theme = useTheme();
  const location = useLocation();
  const hospitalId = propHospitalId || location.state?.hospitalId || localStorage.getItem('hospitalId');
  const [setHistory] = useState([]);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen is small

  // Ensure no redeclaration of 'hospitalId'
  console.log('Hospital ID:', hospitalId);

  const [searchCategory, setSearchCategory] = useState('registrationNumber');
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pageSize] = useState(1000);
  const { frontPageImage, backPageImage, fetchImages } = useFetchImages();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJpegModalOpen, setIsJpegModalOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);


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

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleOpenPrintModal = (patient) => {
    setSelectedPatient(patient); // Set the patient for whom the format needs to be selected
    setIsModalOpen(true); // Open the modal
  };

  const handleExportAsPdf = async () => {
    if (!selectedPatient) return;

    try {
      setIsPdfLoading(true); // Indicate loading
      const pdfBlob = await fetchPatientPdf(selectedPatient.registrationNumber, hospitalId);
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);

      // Trigger print via iframe
      const iframe = document.createElement('iframe');
      iframe.src = pdfBlobUrl;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe); // Clean up
        toast.success('PDF exported and printed successfully!');
      };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF.');
    } finally {
      setIsPdfLoading(false);
      handleCloseModal();
    }
  };


  const handleJpegExport = async () => {
    if (!selectedPatient) {
      toast.error('No patient selected for export.');
      return;
    }

    // Call fetchImages directly
    await fetchImages(selectedPatient.registrationNumber, hospitalId);
    console.log('Opening JPEG modal'); // Log before opening the modal
    setIsJpegModalOpen(true); // Open the modal to show images
  };

  const handleCloseJpegModal = () => {
    setIsJpegModalOpen(false);
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


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getImplantPrintHistoryByHospital(hospitalId);
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    if (hospitalId) fetchHistory();
  }, [hospitalId]);


  // Add implant print history
  const addHistory = async (regNumber) => {
    if (!regNumber) {
      console.error('Registration number is missing!');
      return;
    }

    const newEntry = {
      hospitalId,
      patientId: regNumber,
      printDate: new Date().toISOString(),
    };

    try {
      await addImplantPrintHistory(newEntry);
      const updatedHistory = await getImplantPrintHistoryByHospital(hospitalId);
      setHistory(updatedHistory);
      console.log("Print date:", newEntry.printDate);
    } catch (error) {
      console.error('Error adding history:', error);
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


  const fetchPreviewPdf = async (patient, hospitalId) => {
    setIsPdfLoading(true);
    try {
      const pdfBlob = await fetchImplantPdfforPreview(patient.registrationNumber, hospitalId);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl); // Set the PDF URL for display
    } catch (error) {
      console.error("Error fetching PDF:", error.message);
      toast.error("Failed to fetch the PDF for preview.");
    } finally {
      setIsPdfLoading(false); // Hide loading indicator after fetching
    }
  };

  const onPrintPatient = async (patient) => {
    if (!patient) {
      toast.error("No patient selected for export.");
      return;
    }

    const { registrationNumber, hospitalId } = patient;

    try {
      // Show loader while fetching images
      toast.info("Fetching images. Please wait...");

      // Fetch Image 1 and Image 2 in parallel
      const [fetchedImage1, fetchedImage2] = await Promise.all([
        fetchImage1(registrationNumber, hospitalId),
        fetchImage2(registrationNumber, hospitalId),
      ]);

      if (fetchedImage1 && fetchedImage2) {
        // Ensure images are fully loaded before downloading
        await Promise.all([
          loadImage(fetchedImage1),
          loadImage(fetchedImage2),
        ]);

        // Trigger download for the first image
        await downloadImage(fetchedImage1, `${registrationNumber}_front_card.jpg`);

        // Add a slight delay before downloading the second image
        setTimeout(async () => {
          await downloadImage(fetchedImage2, `${registrationNumber}_back_card.jpg`);
          toast.success("Images exported successfully!");
        }, 500); // Delay of 500ms (adjust if necessary)
      } else {
        toast.error("Images are not available for export.");
      }
    } catch (error) {
      console.error("Error exporting images:", error);
      toast.error("An error occurred while exporting images.");
    }
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
