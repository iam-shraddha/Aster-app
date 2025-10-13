import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  OutlinedInput,
} from '@mui/material';
import { fetchDoctorsByHospital } from '../../services/api';

const DoctorSelect = ({ value, onChange, error, helperText, hospitalId }) => {
  const [open, setOpen] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!hospitalId) {
        setDoctorOptions([]);
        setFilteredOptions([]);
        return;
      }

      try {
        setLoading(true);
        setFetchError(false);
        const doctors = await fetchDoctorsByHospital(hospitalId);
        setDoctorOptions(doctors);
        setFilteredOptions(doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setFetchError(true);
        setDoctorOptions([]);
        setFilteredOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [hospitalId]);

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = doctorOptions.filter((doctor) =>
      doctor.doctorName.toLowerCase().includes(query) ||
      doctor.doctorSpecialization.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading doctors...</Typography>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Typography color="error">
        Failed to load doctors. Please try again.
      </Typography>
    );
  }

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="doctor-select-label">Select Doctor (Optional)</InputLabel>
      <Select
        labelId="doctor-select-label"
        value={value || ''}
        label="Select Doctor (Optional)"
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            minHeight: 42,
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {/* No Doctor Option */}
        <MenuItem value="">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="body2" color="text.secondary">
              No Doctor Selected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Will use hospital signature
            </Typography>
          </Box>
        </MenuItem>

        {/* Search Input */}
        <MenuItem disableRipple>
          <Box sx={{ px: 2, py: 1, width: '100%' }}>
            <OutlinedInput
              placeholder="Search doctors..."
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mb: 1 }}
            />
          </Box>
        </MenuItem>

        {/* Filtered Doctor Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((doctor) => (
            <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" fontWeight="medium">
                  {doctor.doctorName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {doctor.doctorSpecialization}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography color="text.secondary">No doctors found</Typography>
          </MenuItem>
        )}
      </Select>
      {helperText && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default DoctorSelect;
