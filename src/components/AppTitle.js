import { Box, Typography } from "@mui/material";
import React from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";

const AppTitle = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "3em",
        color: "#1976d2",
        fontFamily: "monospace",
        gap: 1,
      }}
    >
      <EventNoteIcon sx={{ fontSize: "4.5em" }} />
      <Typography variant="h3" sx={{ fontFamily: "italiana" }}>
        Calendar
      </Typography>
    </Box>
  );
};

export default AppTitle;
