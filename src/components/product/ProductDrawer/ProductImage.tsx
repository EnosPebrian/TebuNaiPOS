import Box from "@mui/material/Box";
import Image from "next/image";

interface ProductImageProps {
  image: string;
  name: string;
  accentColor: string;
}

export default function ProductImage({
  image,
  name,
  accentColor,
}: ProductImageProps) {
  return (
    <Box
      sx={{
        position: "relative",
        height: 320,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Glow */}

      <Box
        sx={{
          position: "absolute",

          width: 240,
          height: 240,

          borderRadius: "50%",

          background: `radial-gradient(circle, ${accentColor}44 0%, transparent 70%)`,

          filter: "blur(28px)",

          transition: ".3s",
        }}
      />

      {/* Product */}

      <Image
        src={image}
        alt={name}
        width={220}
        height={280}
        style={{
          objectFit: "contain",
          zIndex: 2,
        }}
      />
    </Box>
  );
}
