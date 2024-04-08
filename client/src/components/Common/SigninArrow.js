import React from "react";
import { Box } from "@material-ui/core";
import { CallMade } from "@material-ui/icons";

export const SigninArrow = () => {
  return (
    <Box sx={{ position: "fixed", top: "40px", right: "40px" }}>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", color: "#f1f1f180" }}
      >
        <CallMade style={{ width: "25px" }} />
      </Box>
      <Box sx={{ fontSize: "14px", fontStyle: "italic", color: "#f1f1f180" }}>
        Sign In
      </Box>
    </Box>
  );
};
