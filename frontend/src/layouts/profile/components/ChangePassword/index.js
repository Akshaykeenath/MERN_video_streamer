import { Card, Grid, Icon, InputAdornment } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { setNotification, useMaterialUIController } from "context";
import { useEffect, useState } from "react";
import { apiChangePassword } from "services/userManagement";

function ChangePassword() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const { ChangePasswordSend, response, error } = apiChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassRe, setShowPassRe] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [eyeColor, setEyeColor] = useState("dark");

  useEffect(() => {
    setEyeColor(darkMode ? "white" : "dark");
  }, [darkMode]);

  useEffect(() => {
    if (response && response.message) {
      const noti = {
        message: response.message,
        color: "success",
      };
      setNotification(dispatch, noti);
    }
    if (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const noti = {
          message: error.response.data.message,
          color: "error",
        };
        setNotification(dispatch, noti);
      } else {
        const noti = {
          message: "An Error occured",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    }
  }, [response, error]);

  const validateCurrentPassword = () => {
    if (currentPassword.length === 0) {
      setCurrentPasswordError("Enter valid value");
      return false;
    }
    return true;
  };

  const validateNewPassword = () => {
    if (newPassword.length === 0) {
      setNewPasswordError("Enter valid value");
      return false;
    }
    return true;
  };

  const validateRePassword = () => {
    if (rePassword.length === 0) {
      setRePasswordError("Enter valid value");
      return false;
    }
    if (rePassword !== newPassword) {
      setRePasswordError("Re-entered password does not match the new password");
      return false;
    }
    return true;
  };

  const handleClearError = () => {
    setCurrentPasswordError("");
    setNewPasswordError("");
    setRePasswordError("");
  };

  const handleClearAction = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRePassword("");
    setShowPassCurrent(false);
    setShowPassNew(false);
    setShowPassRe(false);
    handleClearError();
  };

  const handleUpdateAction = () => {
    handleClearError();

    const isCurrentPasswordValid = validateCurrentPassword();
    const isNewPasswordValid = validateNewPassword();
    const isRePasswordValid = validateRePassword();

    if (isCurrentPasswordValid && isNewPasswordValid && isRePasswordValid) {
      ChangePasswordSend(currentPassword, newPassword);
      handleClearAction();
    }
  };

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
          Change Password
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <Grid container direction="column" rowSpacing={3}>
          {/* Input Area */}
          <Grid item>
            <Grid container direction="column" justifyContent="space-evenly" rowSpacing={2}>
              <Grid item>
                <MDInput
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showPassCurrent ? "text" : "password"}
                  size="small"
                  error={currentPasswordError.length > 0}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MDButton
                          onClick={() => setShowPassCurrent(!showPassCurrent)}
                          color={eyeColor}
                          size="small"
                          iconOnly
                          variant="text"
                        >
                          <Icon>{showPassCurrent ? "visibility_off" : "visibility"}</Icon>
                        </MDButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {currentPasswordError.length > 0 && (
                  <MDTypography color="error" variant="caption" fontWeight="medium">
                    {currentPasswordError}
                  </MDTypography>
                )}
              </Grid>
              <Grid item>
                <MDInput
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassNew ? "text" : "password"}
                  size="small"
                  error={newPasswordError.length > 0}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MDButton
                          onClick={() => setShowPassNew(!showPassNew)}
                          color={eyeColor}
                          size="small"
                          iconOnly
                          variant="text"
                        >
                          <Icon>{showPassNew ? "visibility_off" : "visibility"}</Icon>
                        </MDButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {newPasswordError.length > 0 && (
                  <MDTypography color="error" variant="caption" fontWeight="medium">
                    {newPasswordError}
                  </MDTypography>
                )}
              </Grid>
              <Grid item>
                <MDInput
                  label="Re Enter New Password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  type={showPassRe ? "text" : "password"}
                  size="small"
                  error={rePasswordError.length > 0}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <MDButton
                          onClick={() => setShowPassRe(!showPassRe)}
                          color={eyeColor}
                          size="small"
                          iconOnly
                          variant="text"
                        >
                          <Icon>{showPassRe ? "visibility_off" : "visibility"}</Icon>
                        </MDButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {rePasswordError.length > 0 && (
                  <MDTypography color="error" variant="caption" fontWeight="medium">
                    {rePasswordError}
                  </MDTypography>
                )}
              </Grid>
            </Grid>
          </Grid>
          {/* End Input Area */}

          {/* Action Area */}
          <Grid item>
            <Grid container direction="row" justifyContent="flex-end" columnSpacing={1}>
              <Grid item>
                <MDButton color="secondary" size="small" onClick={handleClearAction} circular>
                  Clear
                </MDButton>
              </Grid>
              <Grid item>
                <MDButton color="info" size="small" onClick={handleUpdateAction} circular>
                  Update
                </MDButton>
              </Grid>
            </Grid>
          </Grid>
          {/* Action Area */}
        </Grid>
      </MDBox>
    </Card>
  );
}
export default ChangePassword;
