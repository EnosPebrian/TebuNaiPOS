import { Stack, Typography } from "@mui/material";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ eyebrow, title, subtitle }: Props) {
  return (
    <Stack spacing={2} mb={6}>
      {eyebrow && (
        <Typography color="primary" fontWeight={700} letterSpacing={2}>
          {eyebrow.toUpperCase()}
        </Typography>
      )}

      <Typography
        variant="h2"
        sx={{
          maxWidth: 650,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 700,
            fontSize: "1.1rem",
            lineHeight: 1.8,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
