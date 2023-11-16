import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { Card } from "@mui/material";
import PropTypes from "prop-types";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function KESlideModal({ title, body, onAction }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (title.length > 0 && body.length > 0 && !open) {
      setOpen(true);
    }
  }, [title, body]);

  const handleClick = (value) => {
    onAction(value);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Card>
          <DialogTitle>
            <MDTypography color="dark" fontWeight="bold" variant="body1">
              {title}
            </MDTypography>
          </DialogTitle>
          <DialogContent>
            <MDTypography color="text" variant="subtitle2" id="alert-dialog-slide-description">
              {body}
            </MDTypography>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={() => handleClick("No")} variant="text" color="error">
              No
            </MDButton>
            <MDButton onClick={() => handleClick("yes")} variant="text" color="success">
              Yes
            </MDButton>
          </DialogActions>
        </Card>
      </Dialog>
    </React.Fragment>
  );
}

KESlideModal.defaultProps = {
  title: "sample title",
  body: "sample Body",
};
KESlideModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  onAction: PropTypes.func,
};
