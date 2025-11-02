import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
  Print,
  Settings,
  Refresh
} from '@mui/icons-material';
import { fetchImage1, fetchImage2 } from '../services/api';

const SmartCardPrinter = ({ userId, hospitalId = null, doctorId = null }) => {
  // QZ Tray connection state
  const [qzConnected, setQzConnected] = useState(false);
  const [qzConnecting, setQzConnecting] = useState(false);
  
  // Printer selection
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  
  // Calibration offsets (in mm)
  const [offsetX, setOffsetX] = useState(() => {
    const saved = localStorage.getItem('offsetX');
    return saved ? parseFloat(saved) : 17;
  });
  const [offsetY, setOffsetY] = useState(() => {
    const saved = localStorage.getItem('offsetY');
    return saved ? parseFloat(saved) : 17;
  });
  
  // Status and loading
  const [status, setStatus] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState('');
  
  // Card preview images
  const [frontImageUrl, setFrontImageUrl] = useState(null);
  const [backImageUrl, setBackImageUrl] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  
  // Print options (checkboxes)
  const [printFront, setPrintFront] = useState(true);
  const [printBack, setPrintBack] = useState(false);

  // Card dimensions (mm) - Landscape orientation
  const trayWidth = 120;
  const trayHeight = 120;
  const cardWidth = 86;  // Landscape: width (longer side)
  const cardHeight = 54;  // Landscape: height (shorter side)
  const offsetStep = 0.5;


  // Fetch printers when QZ is connected
  useEffect(() => {
    if (qzConnected) {
      fetchPrinters();
    }
  }, [qzConnected]);

  // Load card preview images when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      loadCardPreview();
    }
  }, [userId, hospitalId, doctorId]);

  // Connect to QZ Tray
  const connectQZ = async () => {
    setQzConnecting(true);
    setStatus('Connecting to QZ Tray...');
    setError('');

    try {
      // Get QZ reference (could be window.qz or just qz)
      const qz = window.qz || (typeof qz !== 'undefined' ? qz : null);
      
      if (!qz) {
        throw new Error('QZ Tray library not loaded. Please ensure QZ Tray is installed and the script is included.');
      }

      // Check if already connected
      const isConnected = await qz.websocket.isActive();
      if (isConnected) {
        setQzConnected(true);
        setStatus('QZ Tray connected');
        return;
      }

      // Connect to QZ Tray
      // Note: Certificate handling is done automatically by QZ Tray
      // If certificate is not installed, QZ Tray will prompt the user
      await qz.websocket.connect();

      setQzConnected(true);
      setStatus('QZ Tray connected successfully');
      setError('');
    } catch (error) {
      console.error('QZ Tray connection error:', error);
      setQzConnected(false);
      setStatus('Failed to connect to QZ Tray');
      setError(`QZ Tray connection failed: ${error.message}. Please ensure QZ Tray is running.`);
    } finally {
      setQzConnecting(false);
    }
  };

  // Fetch available printers
  const fetchPrinters = async () => {
    try {
      const qz = window.qz || (typeof qz !== 'undefined' ? qz : null);
      if (!qz) {
        throw new Error('QZ Tray not available');
      }

      const printerList = await qz.printers.find();
      setPrinters(printerList);
      
      // Auto-select EPSON L8050 if available
      const epsonPrinter = printerList.find(p => 
        p.toLowerCase().includes('epson') && p.toLowerCase().includes('l8050')
      );
      if (epsonPrinter) {
        setSelectedPrinter(epsonPrinter);
      } else if (printerList.length > 0) {
        setSelectedPrinter(printerList[0]);
      }
    } catch (error) {
      console.error('Error fetching printers:', error);
      setError(`Failed to fetch printers: ${error.message}`);
    }
  };

  // Load card preview images
  const loadCardPreview = async () => {
    if (!userId || !hospitalId) return;
    
    setIsLoadingPreview(true);
    try {
      const [front, back] = await Promise.all([
        fetchImage1(userId, hospitalId, doctorId),
        fetchImage2(userId, hospitalId, doctorId)
      ]);
      setFrontImageUrl(front);
      setBackImageUrl(back);
    } catch (error) {
      console.error('Error loading card preview:', error);
      setError(`Failed to load card preview: ${error.message}`);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Convert image URL to data URL format for QZ Tray
  // QZ Tray expects full data URL: "data:image/jpeg;base64,/9j/4AAQ..."
  const toDataUrl = async (imageUrl) => {
    try {
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
        return imageUrl;
      }
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          let dataUrl = reader.result;
          // The reader might return data:text/plain for blobs. We need to fix it.
          if (dataUrl.startsWith('data:text/plain')) {
            const base64Data = dataUrl.split(',')[1];
            let mimeType = 'image/jpeg'; // Default
            if (base64Data.startsWith('/9j/')) {
              mimeType = 'image/jpeg';
            } else if (base64Data.startsWith('iVBOR')) {
              mimeType = 'image/png';
            }
            dataUrl = `data:${mimeType};base64,${base64Data}`;
          }
          resolve(dataUrl);
        };
        reader.onerror = (err) => reject(new Error('Failed to read image file: ' + err));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      throw new Error(`Failed to convert image: ${error.message}`);
    }
  };

  // Save offset to localStorage
  const saveOffset = (key, value) => {
    localStorage.setItem(key, value.toString());
  };

  // Adjust offset functions
  const adjustOffsetX = (direction) => {
    const newValue = direction === 'left' 
      ? offsetX - offsetStep 
      : offsetX + offsetStep;
    setOffsetX(newValue);
    saveOffset('offsetX', newValue);
  };

  const adjustOffsetY = (direction) => {
    const newValue = direction === 'up' 
      ? offsetY - offsetStep 
      : offsetY + offsetStep;
    setOffsetY(newValue);
    saveOffset('offsetY', newValue);
  };

  // Print card function
  const printCard = async () => {
    if (!qzConnected) {
      setError('QZ Tray is not connected. Please connect first.');
      return;
    }

    if (!selectedPrinter) {
      setError('Please select a printer first.');
      return;
    }

    if (!userId || !hospitalId) {
      setError('User ID and Hospital ID are required to fetch card images.');
      return;
    }

    // Validate exactly one side is selected
    if (!printFront && !printBack) {
      setError('Please select one side to print (Front or Back).');
      return;
    }
    
    if (printFront && printBack) {
      setError('Please select only one side to print. Both sides cannot be printed at once.');
      return;
    }

    setIsPrinting(true);
    const sideToPrint = printFront ? 'front' : 'back';
    setStatus(`Printing ${sideToPrint} side...`);
    setError('');

    try {
      // Fetch only the required image
      let imageUrl;
      if (printFront) {
        const front = await fetchImage1(userId, hospitalId, doctorId);
        imageUrl = await toDataUrl(front);
      } else {
        const back = await fetchImage2(userId, hospitalId, doctorId);
        imageUrl = await toDataUrl(back);
      }

      // Get QZ reference
      const qz = window.qz || (typeof qz !== 'undefined' ? qz : null);
      if (!qz) {
        throw new Error('QZ Tray not available');
      }

      // Create printer configuration
      const config = qz.configs.create(selectedPrinter, {
        copies: 1,
        rasterize: true,
        size: { width: trayWidth, height: trayHeight, units: 'mm' }
      });

      // Create print job for an image
      // QZ Tray expects full data URL: "data:image/jpeg;base64,..."
      const createImageJob = (dataUrl) => {
        // Ensure we have the full data URL format
        if (!dataUrl.startsWith('data:image/')) {
          // If somehow we got just base64, wrap it
          if (dataUrl.startsWith('/9j/') || dataUrl.startsWith('iVBOR')) {
            // JPEG or PNG base64
            const format = dataUrl.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
            dataUrl = `data:${format};base64,${dataUrl}`;
          }
        }
        
        return [{
          type: 'pixel',
          format: 'image',
          flavor: 'base64',
          data: dataUrl.split(',')[1], // Pass only the base64 part
          options: {
            x: offsetX,
            y: offsetY,
            width: cardWidth,
            height: cardHeight,
            units: 'mm',
          }
        }];
      };

      // Print the selected side
      await qz.print(config, createImageJob(imageUrl));

      setStatus(`Print job sent successfully for ${sideToPrint} side!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Print error:', error);
      setError(`Print failed: ${error.message}`);
      setStatus('');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'transparent' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Smart Card Printer
        </Typography>

        {/* QZ Tray Connection Status */}
        <Card sx={{ mb: 3, bgcolor: qzConnected ? 'success.light' : 'error.light' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  QZ Tray Status: {qzConnected ? 'Connected' : 'Disconnected'}
                </Typography>
                {status && (
                  <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
                    {status}
                  </Typography>
                )}
              </Box>
              {!qzConnected && (
                <Button
                  variant="contained"
                  onClick={connectQZ}
                  disabled={qzConnecting}
                  sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {qzConnecting ? <CircularProgress size={24} /> : 'Connect'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Printer Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Select Printer</InputLabel>
            <Select
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              disabled={!qzConnected || printers.length === 0}
            >
              {printers.map((printer) => (
                <MenuItem key={printer} value={printer}>
                  {printer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {qzConnected && (
            <Button
              variant="outlined"
              size="small"
              onClick={fetchPrinters}
              startIcon={<Refresh />}
              sx={{ mt: 1 }}
            >
              Refresh Printers
            </Button>
          )}
          {qzConnected && printers.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No printers found. Click the refresh button or check your printer connection.
            </Typography>
          )}
        </Box>

        {/* Calibration Controls */}
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ mr: 1 }} />
              <Typography variant="h6">Calibration (Offset in mm)</Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Y-axis (vertical) controls */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>Vertical Offset (Y)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => adjustOffsetY('up')}
                    disabled={isPrinting}
                    startIcon={<ArrowUpward />}
                  >
                    ↑
                  </Button>
                  <TextField
                    type="number"
                    value={offsetY.toFixed(1)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setOffsetY(val);
                      saveOffset('offsetY', val);
                    }}
                    inputProps={{ step: offsetStep, min: 0 }}
                    sx={{ width: 100 }}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => adjustOffsetY('down')}
                    disabled={isPrinting}
                    startIcon={<ArrowDownward />}
                  >
                    ↓
                  </Button>
                </Box>
              </Grid>

              {/* X-axis (horizontal) controls */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>Horizontal Offset (X)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => adjustOffsetX('left')}
                    disabled={isPrinting}
                    startIcon={<ArrowBack />}
                  >
                    ←
                  </Button>
                  <TextField
                    type="number"
                    value={offsetX.toFixed(1)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setOffsetX(val);
                      saveOffset('offsetX', val);
                    }}
                    inputProps={{ step: offsetStep, min: 0 }}
                    sx={{ width: 100 }}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => adjustOffsetX('right')}
                    disabled={isPrinting}
                    startIcon={<ArrowForward />}
                  >
                    →
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary">
              Current offset: X = {offsetX.toFixed(1)} mm, Y = {offsetY.toFixed(1)} mm
            </Typography>
          </CardContent>
        </Card>

        {/* Card Preview Section with Checkboxes */}
        <Card sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Card Preview
            </Typography>
            
            {isLoadingPreview ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading preview...</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Front Card Preview */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      p: 2,
                      aspectRatio: '86/54', // Landscape card ratio
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    >
                      1
                    </Typography>
                    {frontImageUrl ? (
                      <img
                        src={frontImageUrl}
                        alt="Front Card Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No Preview Available</Typography>
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        fontSize: '0.65rem',
                      }}
                    >
                      FRONT
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={printFront}
                          onChange={(e) => {
                            setPrintFront(e.target.checked);
                            if (e.target.checked && printBack) {
                              setPrintBack(false);
                            }
                          }}
                          disabled={isPrinting}
                          color="primary"
                        />
                      }
                      label="Print Front Side"
                    />
                  </Box>
                </Grid>

                {/* Back Card Preview */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      p: 2,
                      aspectRatio: '86/54', // Landscape card ratio
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                      }}
                    >
                      2
                    </Typography>
                    {backImageUrl ? (
                      <img
                        src={backImageUrl}
                        alt="Back Card Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No Preview Available</Typography>
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        color: 'text.secondary',
                        fontSize: '0.65rem',
                      }}
                    >
                      BACK
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={printBack}
                          onChange={(e) => {
                            setPrintBack(e.target.checked);
                            if (e.target.checked && printFront) {
                              setPrintFront(false);
                            }
                          }}
                          disabled={isPrinting}
                          color="primary"
                        />
                      }
                      label="Print Back Side"
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
            
            <Button
              variant="outlined"
              size="small"
              onClick={loadCardPreview}
              disabled={isLoadingPreview || !userId}
              sx={{ mt: 2 }}
            >
              <Refresh sx={{ mr: 1, fontSize: 16 }} />
              Refresh Preview
            </Button>
          </CardContent>
        </Card>

        {/* Print Button */}
        <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={printCard}
              disabled={!qzConnected || !selectedPrinter || isPrinting || (!printFront && !printBack)}
              startIcon={<Print />}
              fullWidth
            >
              Print Selected Side
            </Button>
        </Box>

        {isPrinting && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Printing...</Typography>
          </Box>
        )}

        {/* Info Box */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2" component="div">
            <strong>Instructions:</strong>
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Ensure QZ Tray is running in the background</li>
              <li>Set your printer driver to disable "Scaling" and "Fit to Page"</li>
              <li>For first-time setup: adjust offsets until the card aligns perfectly</li>
              <li>Offsets are saved automatically in your browser</li>
            </ul>
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default SmartCardPrinter;
