import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ba080', // Faint ocean green
    },
    secondary: {
      main: '#1e5478', // Lighter ocean green
    },
    faintGreen: {
      main: '#e0fff9',
    },
    green: {
      main: '#0ba080',
    },
    blue: {
      main: '#1e5478',
    },
    faintBlue: {
      main: '#c3ebfc',
    },
    faint: {
      main: '#effefb',
    },
    success: {
      main: '#e0fff9',
    },
    info: {
      main: '#c3ebfc',
    },

  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },

});

export default theme;
