import { createTheme } from "@mui/material/styles";
import "@fontsource/montserrat/500";
import "@fontsource/prata";

const adminTheme = createTheme({
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
    fontFamily: '"Montserrat", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.688rem",
      letterSpacing: "-0.5px",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.313rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "0.975rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "0.9rem",
      color: "black",
    },
    body1: {
      fontFamily: '"Montserrat Variable", sans-serif',
      fontSize: "0.975rem",
      lineHeight: 1.6,
      color: "text.secondary",
    },
    body2: {
      fontFamily: '"Montserrat Variable", sans-serif',
      fontSize: "0.75rem",
      color: "#4F4F4F",
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      textTransform: "none", // keep buttons looking elegant
      fontWeight: 500,
      letterSpacing: "0.3px",
    },
  },
});

export default adminTheme;
