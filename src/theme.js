import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052CC', // Cor principal
    },
    error: {
      main: '#FF3936', // Texto de erro/sinal negativo
    },
    success: {
      main: '#08B37E', // Sucesso
    },
    background: {
      default: '#F8F9FA', // Fundo principal
      paper: '#FFFFFF',   // Texto e contrastes
    },
    text: {
      primary: '#212529', // Texto / elementos fortes
    },
    divider: '#DEE2E6', // Bordas / fundos neutros
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, // Remove shadow by default for a flatter design
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        // Styles for the main blue button (Login screen)
        containedPrimary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: '#F7F9FB', // User-specified hover background
            color: theme.palette.primary.main, // User-specified hover text color (blue)
            boxShadow: `0px 0px 8px ${theme.palette.primary.main}33`, // User-specified hover shadow
          },
        }),
        // Styles for the "Secondary White" button (variant="outlined" color="primary")
        outlinedPrimary: ({ theme }) => ({
          backgroundColor: '#FFFFFF', // Set a white background for this variant
          '&:hover': {
            backgroundColor: '#F7F9FB', // User-specified hover background
            boxShadow: `0px 0px 8px ${theme.palette.primary.main}33`, // User-specified hover shadow
          },
        }),
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
            }
        }
    }
  },
});

export default theme;
