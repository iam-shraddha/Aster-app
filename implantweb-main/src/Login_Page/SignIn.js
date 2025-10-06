import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container } from '@mui/material';
import Loader from '../Images/Double Ring Loader.svg';
import * as Sentry from '@sentry/react';
import BASE_URL from '../services/Config';
import { ToastContainer, toast } from 'react-toastify';
import implnatpass from '../Images/implantPass.jpeg';
import Footer from '../pages/Footer';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: 'auto',
  borderRadius: theme.spacing(2),
  boxShadow:
    '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: theme.palette.background.default,
  backdropFilter: 'blur(8px)'
}));

// const Title = styled(Typography)(({ theme }) => ({
//   fontFamily: "'Merriweather', serif",
//   fontWeight: 700,
//   textAlign: 'center',
//   color: theme.palette.primary.contrastText,
//   marginBottom: theme.spacing(2),
// }));

export default function SignIn(props) {
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, role, hospitalId } = response.data;

      localStorage.setItem('access_token', token.access_token);
      localStorage.setItem('id_token', token.id_token);
      localStorage.setItem('hospitalId', hospitalId);

      setLoading(true);

      setTimeout(() => {
        navigate(role === 'Admin' ? '/patient' : '/dashboard');
      }, 2000);

    } catch (error) {
      Sentry.captureException(error);
      if (error.response?.status === 401) {
        setEmailError(true);
        setEmailErrorMessage('Invalid email or password.');
        setPasswordError(true);
        setPasswordErrorMessage('Invalid email or password.');
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
      }}
    >
      <Container>
        {/* <Sidebar /> */}

        <CssBaseline />
        <ToastContainer position="top-right" autoClose={3000} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px" marginTop="200px">
            <img src={Loader} alt="Loading..." />
          </Box>
        ) : (
          <Box>
            <img
              src={implnatpass}
              alt="implantpass"
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '7rem',
                margin: '1rem auto',
              }}
            />
            <Card sx={{ maxWidth: 500, mx: 'auto', mt: 1, boxShadow: 3, p: 4 }}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: 'primary.main',
                    mb: 0,
                  }}
                >
                  Sign In
                </Typography>

                <FormControl>
                  <FormLabel
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      mb: 1,
                    }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                        backgroundColor: 'faint.main',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 6px rgb(31, 118, 101)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                      },
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      mb: 1,
                    }}
                  >
                    Password
                  </FormLabel>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••"
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 6,
                        backgroundColor: 'faint.main',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&:hover fieldset': {
                          borderColor: 'secondary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 6px rgb(31, 118, 101)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'error.main',
                      },
                    }}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                  }}
                />
                <ForgotPassword open={open} handleClose={() => setOpen(false)} />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 6,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                    },
                  }}
                >
                  Sign in
                </Button>
                {/* <Link
                component="button"
                onClick={() => setOpen(true)}
                variant="body2"
                sx={{
                  textAlign: 'center',
                  marginTop: 2,
                  color: 'secondary.main',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Link> */}
              </Box>
            </Card>
          </Box>
        )}


      </Container>
      <Box sx={{ marginTop: 11.5 }}>
        <Footer />
      </Box>
    </Box>
  );
}
