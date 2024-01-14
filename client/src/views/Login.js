import React from "react";
import Signin from "../components/signin";
import { Box } from "@material-ui/core";
import OllaCartMultiLogo from "../components/Logo/ollacartmulti";

const Login = (props) => {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: "16px",
      }}
    >
      <OllaCartMultiLogo width={200} />
      <Signin />
    </Box>
  );
};

export default Login;
