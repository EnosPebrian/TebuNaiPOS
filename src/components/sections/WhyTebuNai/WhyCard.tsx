import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface WhyCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function WhyCard({ icon, title, description }: WhyCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        borderRadius: 6,

        height: "100%",

        border: "1px solid rgba(0,0,0,.06)",

        transition: ".3s",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(0,0,0,.08)",
        },
      }}
    >
      <Stack spacing={3}>
        <Typography fontSize="2.8rem">{icon}</Typography>

        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>

        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}
