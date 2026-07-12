import { Container as MuiContainer } from "@mui/material";
import { tokens } from "@/theme/tokens";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <MuiContainer
      maxWidth={false}
      sx={{
        maxWidth: tokens.container,
        mx: "auto",
        px: {
          xs: 3,
          md: 5,
        },
      }}
    >
      {children}
    </MuiContainer>
  );
}
