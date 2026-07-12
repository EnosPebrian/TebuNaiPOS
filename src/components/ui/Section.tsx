import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

interface SectionProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function Section({ children, sx }: SectionProps) {
  return (
    <Box
      component="section"
      sx={{
        py: {
          xs: 12,
          md: 18,
        },

        background: `
          radial-gradient(
            circle at top left,
            rgba(214,232,214,.35),
            transparent 45%
          ),
          #F7F5F2
        `,

        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
