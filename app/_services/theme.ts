import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto-slab/500";
import "@fontsource/roboto-slab/600";
import "@fontsource/montserrat/500";
import "@fontsource/prata";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50",
    },
    secondary: {
      main: "#a47e1b", // gold accent
    },
    background: {
      default: "#f9fafb", // main background
      paper: "#FFFFFF", // cards, modals
    },
    text: {
      primary: "#2c3e50", // strong black
      secondary: "#4F4F4F", // softer gray
    },
    divider: "#dedddc",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 0,
          px: 3,
        },
      },
    },
  },

  typography: {
    fontFamily: '"Montserrat Variable", sans-serif',
    h1: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "3rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "2.25rem",
      letterSpacing: "-0.5px",
    },
    h3: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "1.3rem",
    },
    h6: {
      fontFamily: "'Prata', serif",
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    body1: {
      fontFamily: '"Montserrat Variable", sans-serif',
      fontSize: "1.3rem",
      lineHeight: 1.6,
      color: "text.secondary",
    },
    body2: {
      fontFamily: '"Montserrat Variable", sans-serif',
      fontSize: "1rem",
      color: "#4F4F4F",
    },
    button: {
      fontFamily: '"Montserrat Variable", sans-serif',
      textTransform: "none", // keep buttons looking elegant
      fontWeight: 500,
      letterSpacing: "0.3px",
    },
  },
});

export default theme;
