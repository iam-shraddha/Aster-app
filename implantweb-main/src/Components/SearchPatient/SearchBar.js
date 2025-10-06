import React, { useState } from 'react';
import { Box, Input, ToggleButton, ToggleButtonGroup, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ searchCategory, searchValue, onCategoryChange, onSearchChange, allpatientdata }) => {
  const [searchInput, setSearchInput] = useState(searchValue);

  // Function to handle the input change
  const handleInputChange = (value) => {
    if (value.length <= 100) {
      setSearchInput(value);

      // Show all patient data if input is cleared
      if (value === '') {
        onSearchChange(allpatientdata);
      }
    }
  };

  // Function to perform the search
  const handleSearchClick = () => {
    if (searchInput.length >= 3) {
      onSearchChange(searchInput);
    } else if (searchInput === '') {
      onSearchChange(allpatientdata);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 3, display: 'flex', flexDirection: 'column' }}>
      <ToggleButtonGroup
        value={searchCategory}
        exclusive
        onChange={(e, value) => value && onCategoryChange(value)}
        sx={{
          mb: 2,
          '& .MuiToggleButton-root': {
            border: '1px solid #e0e0e0',
            borderRadius: '20px !important',
            mx: 1,
            px: 3,
            py: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        <ToggleButton value="registrationNumber">Registration Number</ToggleButton>
        <ToggleButton value="patientName">Patient Name</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Input
          value={searchInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={searchCategory === 'registrationNumber' ? 'Enter Registration Number' : 'Enter Patient Name'}
          // startAdornment={
          // <InputAdornment position="start">
          //   <SearchIcon color="action" />
          // </InputAdornment>
          // }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleSearchClick}
                disabled={searchInput.length < 3} // Disable button if input is less than 3 characters
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  color: 'white',
                }}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          sx={{
            width: { lg: '60%', md: '80%', xs: '100%' },
            fontSize: '1.1rem',
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            '&:before': { display: 'none' },
            '&:after': { display: 'none' },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchBar;
