import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useEffect } from "react";
import Slide from "@mui/material/Slide";

import { useMaterialUIController, setNotification } from "context";

// Expect only on as severity ["error","info","success","warning"]

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function KEAlert() {
  const [controller, dispatch] = useMaterialUIController();
  const { notification } = controller;
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (notification) {
      handleClick();
    }
  }, [notification]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={SlideTransition} // Use the custom SlideTransition
      >
        <Alert onClose={handleClose} severity={notification.color} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
