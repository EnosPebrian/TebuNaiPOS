import Box from "@mui/material/Box";
import Image from "next/image";

export default function HeroImage() {
  return (
    <Box
      sx={{
        position: "relative",

        width: "100%",

        height: {
          xs: 420,
          md: 620,
        },

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Glow */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 300,
            md: 520,
          },

          height: {
            xs: 300,
            md: 520,
          },

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(236,245,220,.85) 0%, rgba(236,245,220,0) 72%)",

          filter: "blur(35px)",

          zIndex: 0,
        }}
      />

      {/* Secondary Glow */}

      <Box
        sx={{
          position: "absolute",

          width: 260,
          height: 260,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,.75), transparent)",

          top: 90,
          right: 40,

          filter: "blur(45px)",

          zIndex: 0,
        }}
      />

      {/* Product */}

      <Box
        sx={{
          position: "relative",

          width: {
            xs: 300,
            md: 540,
          },

          height: {
            xs: 300,
            md: 540,
          },

          zIndex: 2,
        }}
      >
        <Image
          src="/images/hero-bottle-v2.png"
          alt="Tebu Nai Fresh Sugarcane Juice"
          fill
          priority
          sizes="(max-width:768px) 90vw, 45vw"
          style={{
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Soft Shadow */}

      <Box
        sx={{
          position: "absolute",

          bottom: 55,

          width: {
            xs: 180,
            md: 260,
          },

          height: 30,

          borderRadius: "50%",

          background: "rgba(0,0,0,.10)",

          filter: "blur(18px)",

          zIndex: 1,
        }}
      />
    </Box>
  );
}
