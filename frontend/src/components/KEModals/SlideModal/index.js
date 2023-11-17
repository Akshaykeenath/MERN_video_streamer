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

export default function KESlideModal({ title, body, onAction, buttons }) {
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
            {buttons.map((button, index) => (
              <MDButton
                key={index}
                onClick={() => handleClick(button.value)}
                variant="text"
                color={button.color}
              >
                {button.label}
              </MDButton>
            ))}
          </DialogActions>
        </Card>
      </Dialog>
    </React.Fragment>
  );
}

KESlideModal.defaultProps = {
  title: "sample title",
  body: "sample Body",
  buttons: [{ color: "info", label: "ok", value: "ok" }],
};
KESlideModal.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  onAction: PropTypes.func,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};
