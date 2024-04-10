import React from "react";
import OllaCartModal from "../modal";
import { Box, Button, Typography } from "@material-ui/core";
import api from "../../api";

export const DeleteAccountModal = ({ isOpen, onClose }) => {
  const handleDelete = () => {
    api.deleteAccount().then(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  };

  return (
    <OllaCartModal open={isOpen} onClose={onClose} title="Delete Account?">
      <Typography variant="body1">
        Are you sure you want to delete your account?
        <br />
        This action cannot be undone.
      </Typography>
      <Box mt={3} display="flex" justifyContent="center" sx={{ gap: "12px" }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleDelete}
        >
          Confirm
        </Button>
      </Box>
    </OllaCartModal>
  );
};
