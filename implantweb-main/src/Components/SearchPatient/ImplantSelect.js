import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Box,
  Chip,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';
import { fetchAllImplants } from '../../services/api';

const ImplantSelect = ({ value, onChange, error, helperText }) => {
  const [open, setOpen] = useState(false);
  const [implantOptions, setImplantOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);


  useEffect(() => {
    const fetchImplants = async () => {
      try {
        const implantNames = await fetchAllImplants();
        setImplantOptions(implantNames);
        setFilteredOptions(implantNames); // Initialize filtered options
      } catch (error) {
        console.error('Error fetching implants:', error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImplants();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value: selectedValues },
    } = event;

    // Limit to 2 selections
    if (Array.isArray(selectedValues) && selectedValues.length <= 2) {
      onChange(selectedValues);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = implantOptions.filter((implant) =>
      implant.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
  };

  if (loading) {
    return <Typography>Loading implant options...</Typography>;
  }

  if (fetchError) {
    return <Typography color="error">Failed to load implant options.</Typography>;
  }

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="implant-select-label">Select Implants (Max 2)</InputLabel>
      <Select
        labelId="implant-select-label"
        multiple
        value={value}
        label="Select Implants (Max 2)"
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((implant) => (
              <Chip
                key={implant}
                label={implant}
                size="small"
                sx={{
                  backgroundColor: 'success.main',
                  '& .MuiChip-label': {
                    color: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        )}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
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
        {/* Search Input */}
        <MenuItem disableRipple>
          <Box sx={{ px: 2, py: 1, width: '100%' }}>
            <OutlinedInput
              placeholder="Search..."
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mb: 1 }}
            />
          </Box>
        </MenuItem>

        {/* Filtered Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((implant) => (
            <MenuItem
              key={implant}
              value={implant}
              disabled={value.length >= 3 && !value.includes(implant)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.lighter',
                },
              }}
            >
              <Checkbox checked={value.includes(implant)} />
              <ListItemText primary={implant} />
              {value.includes(implant) && (
                <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                  Selected
                </Typography>
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography>No results found</Typography>
          </MenuItem>
        )}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ImplantSelect;
