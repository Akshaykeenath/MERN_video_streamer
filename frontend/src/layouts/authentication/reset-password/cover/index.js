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
import { apiSendResetPasswordMail } from "services/userManagement";
import { useMaterialUIController, setNotification } from "context";
import { useRouteRedirect } from "services/redirection";

function Cover() {
  const [controller, dispatch] = useMaterialUIController();
  const redirect = useRouteRedirect();

  const { sendResetMail, response, error } = apiSendResetPasswordMail();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [disableReset, setDisableReset] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(email);
      if (isValidEmail) {
        setEmailError(null);
        setDisableReset(false);
      } else {
        setEmailError("");
        setDisableReset(true);
      }
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [email]);

  const handleResetClick = () => {
    if (email.length > 0 && !emailError) {
      sendResetMail(email);
      setDisableReset(true);
      const noti = {
        message: "Mail Send Successfully",
        color: "success",
      };
      setNotification(dispatch, noti);
      setTimeout(() => {
        redirect("login");
      }, 3000);
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
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError !== null && emailError.length > 0}
                success={emailError === null}
                variant="standard"
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                disabled={disableReset}
                onClick={handleResetClick}
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
