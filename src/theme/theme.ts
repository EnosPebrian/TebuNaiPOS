import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,

  palette: {
    background: {
      default: "#F7F5F2",
      paper: "#FFFFFF",
    },

    primary: {
      main: "#2F6F4F",
    },

    secondary: {
      main: "#5B9B73",
    },

    text: {
      primary: "#2B2B2B",
      secondary: "#6B7280",
    },
  },

  shape: {
    borderRadius: 18,
  },

  typography: {
    fontFamily: "var(--font-inter)",

    h1: {
      fontFamily: "var(--font-poppins)",
      fontWeight: 700,
      fontSize: "4rem",
    },

    h2: {
      fontFamily: "var(--font-poppins)",
      fontWeight: 700,
      fontSize: "2.8rem",
    },

    h3: {
      fontFamily: "var(--font-poppins)",
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
});

export default theme;
