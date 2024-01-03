// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMaterialUIController, setNotification } from "context";
import { Icon, InputAdornment } from "@mui/material";
import { apiSendResetPasswordModify } from "services/userManagement";
import { useRouteRedirect } from "services/redirection";

function Cover() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const { sendModifiedPassword, response, error } = apiSendResetPasswordModify();
  const redirect = useRouteRedirect();

  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [eyeColor, setEyeColor] = useState("dark");
  const [token, setToken] = useState(null);
  const [disableReset, setDisableReset] = useState(false);

  useEffect(() => {
    // Get the URL parameters
    const urlSearchParams = new URLSearchParams(window.location.search);
    // Extract the token and type from the URL
    const token = urlSearchParams.get("token");
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (response) {
      const noti = {
        message: "Password reset successfull",
        color: "success",
      };
      setNotification(dispatch, noti);
      setTimeout(() => {
        redirect("login");
      }, 3000);
    }
    if (error) {
      const noti = {
        message: "Link Expired. Do it again",
        color: "error",
      };
      setNotification(dispatch, noti);
      setTimeout(() => {
        redirect("forgetPasswordMail");
      }, 3000);
    }
  }, [response, error]);

  useEffect(() => {
    setEyeColor(darkMode ? "white" : "dark");
  }, [darkMode]);

  useEffect(() => {
    if (rePassword.length !== 0) {
      setRePasswordError("");
    }
    if (newPassword.length !== 0) {
      setNewPasswordError("");
    }
  }, [newPassword, rePassword]);

  const handleClearAction = () => {
    setNewPassword("");
    setRePassword("");
    setNewPasswordError("");
    setRePasswordError("");
    setShowNewPassword(false);
    setShowRePassword(false);
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

  const handleResetClick = () => {
    const isNewPasswordValid = validateNewPassword();
    const isRePasswordValid = validateRePassword();

    if (isNewPasswordValid && isRePasswordValid && token) {
      setDisableReset(true);
      sendModifiedPassword(newPassword, token);
      handleClearAction();
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput
                type={showNewPassword ? "text" : "password"}
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="standard"
                fullWidth
                error={newPasswordError !== null && newPasswordError.length > 0}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MDButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        color={eyeColor}
                        size="small"
                        iconOnly
                        variant="text"
                      >
                        <Icon>{showNewPassword ? "visibility_off" : "visibility"}</Icon>
                      </MDButton>
                    </InputAdornment>
                  ),
                }}
              />
              {newPasswordError && newPasswordError.length > 0 && (
                <MDTypography color="error" variant="caption" fontWeight="medium">
                  {newPasswordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={4}>
              <MDInput
                type={showRePassword ? "text" : "password"}
                label="Re Enter Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                variant="standard"
                fullWidth
                error={rePasswordError !== null && rePasswordError.length > 0}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MDButton
                        onClick={() => setShowRePassword(!showRePassword)}
                        color={eyeColor}
                        size="small"
                        iconOnly
                        variant="text"
                      >
                        <Icon>{showRePassword ? "visibility_off" : "visibility"}</Icon>
                      </MDButton>
                    </InputAdornment>
                  ),
                }}
              />
              {rePasswordError && rePasswordError.length > 0 && (
                <MDTypography color="error" variant="caption" fontWeight="medium">
                  {rePasswordError}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleResetClick}
                disabled={disableReset}
              >
                reset
              </MDButton>
            </MDBox>
            <MDBox mt={1} mb={1}>
              <MDTypography variant="button" color="text">
                Remember password ?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign in
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
