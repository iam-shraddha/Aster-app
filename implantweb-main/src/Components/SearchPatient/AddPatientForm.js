import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  FormHelperText,
} from '@mui/material';
import ImplantSelect from './ImplantSelect';

const AddPatientForm = ({ onSubmit, onCancel, prefilledData }) => {
  const [patientDetails, setPatientDetails] = useState({
    registrationNumber: '',
    patientName: '',
    age: '',
    gender: '',
    implantTypes: [],
    operationSide: '',
    operationDate: '',
  });

  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (prefilledData) {
      setPatientDetails(prefilledData);
      setFormattedDate(formatDisplayDate(prefilledData.operationDate));
    }
  }, [prefilledData]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!patientDetails.registrationNumber) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    if (!patientDetails.patientName) {
      newErrors.patientName = 'Patient name is required';
    }
    if (!patientDetails.age || patientDetails.age < 1 || patientDetails.age > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (!patientDetails.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (patientDetails.implantTypes.length === 0) {
      newErrors.implantTypes = 'Please select at least one implant';
    }
    if (!patientDetails.operationSide) {
      newErrors.operationSide = 'Operation side is required';
    }
    if (!patientDetails.operationDate) {
      newErrors.operationDate = 'Operation date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDisplayDate = (date) => {
    if (!date) return ''; // If no date, return empty string
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImplantChange = (selectedImplants) => {
    setPatientDetails((prev) => ({
      ...prev,
      implantTypes: selectedImplants,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // Format: YYYY-MM-DD
    setPatientDetails((prev) => ({ ...prev, operationDate: selectedDate }));
    setFormattedDate(formatDisplayDate(selectedDate)); // Convert to DD-MMM-YYYY
  };



  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(patientDetails);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        p: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
        Add New Patient
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Registration Number"
            name="registrationNumber"
            value={patientDetails.registrationNumber}
            onChange={handleInputChange}
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField required
            label="Patient Name"
            name="patientName"
            value={patientDetails.patientName}
            onChange={handleInputChange}
            error={!!errors.patientName}
            helperText={errors.patientName}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            label="Age"
            name="age"
            type="number"
            value={patientDetails.age}
            onChange={handleInputChange}
            error={!!errors.age}
            helperText={errors.age}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl required error={!!errors.gender} component="fieldset" fullWidth>
            <Typography variant="subtitle2">Gender</Typography>
            <RadioGroup
              row
              name="gender"
              value={patientDetails.gender}
              onChange={handleInputChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      <ImplantSelect
        value={patientDetails.implantTypes}
        onChange={handleImplantChange}
        error={!!errors.implantTypes}
        helperText={errors.implantTypes}
      />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl required error={!!errors.operationSide} component="fieldset" fullWidth>
            <Typography variant="subtitle2">Operation Side</Typography>
            <RadioGroup
              row
              name="operationSide"
              value={patientDetails.operationSide}
              onChange={handleInputChange}
            >
              <FormControlLabel value="left" control={<Radio />} label="Left" />
              <FormControlLabel value="right" control={<Radio />} label="Right" />
              <FormControlLabel value="both" control={<Radio />} label="Both" />
            </RadioGroup>
            {errors.operationSide && <FormHelperText>{errors.operationSide}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            label="Operation Date"
            type="date" // Native date picker
            value={patientDetails.operationDate} // Use the raw date value
            onChange={(e) => {
              handleDateChange(e); // Update the operation date and formatted date
            }}
            onBlur={() => {
              setFormattedDate(formatDisplayDate(patientDetails.operationDate)); // Format after losing focus
            }}
            InputLabelProps={{
              shrink: true, // Ensures the label does not overlap the date picker
            }}
            inputProps={{
              max: new Date().toISOString().split('T')[0], // Set the maximum date to today's date
            }}
            error={!!errors.operationDate}
            helperText={errors.operationDate}
            fullWidth
          />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Selected Date: {formattedDate || 'None'}
          </Typography>
        </Grid>



      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: '8px', px: 4 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: '8px',
            px: 4,
            background: 'linear-gradient(45deg, primary.main, primary.dark)',
            '&:hover': {
              background: 'linear-gradient(45deg, primary.dark, primary.main)',
            },
          }}
        >
          Save Patient
        </Button>
      </Box>
    </Box>
  );
};

export default AddPatientForm;