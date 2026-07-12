import Paper from "@mui/material/Paper";

export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper
      sx={{
        p: 4,

        borderRadius: 5,

        background: "rgba(255,255,255,.75)",

        backdropFilter: "blur(12px)",

        border: "1px solid rgba(255,255,255,.3)",

        boxShadow: "0 20px 60px rgba(0,0,0,.06)",
      }}
    >
      {children}
    </Paper>
  );
}
