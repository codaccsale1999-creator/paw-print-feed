import { createTheme } from '@mui/material/styles';

// Custom pet-friendly MUI theme
export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(25, 95%, 55%)', // Warm orange
      light: 'hsl(25, 100%, 65%)',
      dark: 'hsl(25, 90%, 45%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(180, 30%, 25%)', // Complementary teal
      light: 'hsl(180, 25%, 95%)',
      dark: 'hsl(180, 35%, 15%)',
    },
    error: {
      main: 'hsl(0, 80%, 60%)',
    },
    success: {
      main: 'hsl(140, 60%, 50%)',
    },
    background: {
      default: 'hsl(25, 25%, 98%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(220, 15%, 25%)',
      secondary: 'hsl(220, 10%, 50%)',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '8px 24px',
          fontWeight: 600,
          boxShadow: '0 2px 8px -2px rgba(251, 146, 60, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 16px -4px rgba(251, 146, 60, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, hsl(25, 95%, 55%), hsl(25, 100%, 65%))',
          '&:hover': {
            background: 'linear-gradient(135deg, hsl(25, 90%, 50%), hsl(25, 95%, 60%))',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 2px 8px -2px rgba(251, 146, 60, 0.1)',
          border: '1px solid hsl(25, 15%, 90%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 16px -4px rgba(251, 146, 60, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid hsl(25, 95%, 55%)',
          boxShadow: '0 2px 8px -2px rgba(251, 146, 60, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(25, 95%, 55%)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(25, 95%, 55%)',
            },
          },
        },
      },
    },
  },
});

export const darkMuiTheme = createTheme({
  ...muiTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(25, 90%, 60%)',
      light: 'hsl(25, 95%, 70%)',
      dark: 'hsl(25, 85%, 50%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(180, 30%, 25%)',
      light: 'hsl(220, 15%, 20%)',
      dark: 'hsl(180, 35%, 15%)',
    },
    background: {
      default: 'hsl(220, 15%, 8%)',
      paper: 'hsl(220, 15%, 12%)',
    },
    text: {
      primary: 'hsl(25, 20%, 95%)',
      secondary: 'hsl(220, 10%, 60%)',
    },
  },
});