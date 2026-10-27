"use client";
import Button from "@mui/material/Button";
export default function PrintOrderButton() { return <Button variant="contained" onClick={() => window.print()}>Print this slip</Button>; }
