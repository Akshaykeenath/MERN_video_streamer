// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { apiRegister } from "services/userManagement";
import { setNotification, useMaterialUIController } from "context";
import { useRouteRedirect } from "services/redirection";

function Cover() {
  const [loading, setLoading] = useState(false);
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationState, setValidationState] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");

  function isEmailValid(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  }

  function isMobileValid(mobile) {
    return /^[0-9]{10}$/.test(mobile);
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setFnameError("");
    setLnameError("");
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setRePasswordError("");
    setCheckboxError("");
    setValidationState(true);

    if (rePassword === "") {
      setRePasswordError("Re Enter Password First");
    } else if (rePassword !== password) {
      setRePasswordError("Password is not matching");
    }
    if (fname === "") {
      setFnameError("Enter first name");
    }
    if (lname === "") {
      setLnameError("Enter last name");
    }
    if (email === "") {
      setEmailError("Enter email first");
    } else if (!isEmailValid(email)) {
      setEmailError("Invalid email format");
    }

    if (mobile === "") {
      setMobileError("Enter mobile first");
    } else if (!isMobileValid(mobile)) {
      setMobileError("Invalid mobile number format");
    }
    if (password === "") {
      setPasswordError("Enter password first");
    }
    if (!isCheckboxChecked) {
      setCheckboxError("Please agree to the Terms and Conditions");
    }
    if (
      fname &&
      lname &&
      email &&
      mobile &&
      password &&
      rePassword &&
      isCheckboxChecked &&
      !fnameError &&
      !lnameError &&
      !emailError &&
      !mobileError &&
      !passwordError &&
      !rePasswordError
    ) {
      const data = {
        fname: fname,
        lname: lname,
        uname: email,
        mobile: mobile,
        email: email,
        pass: password,
      };
      try {
        const response = await apiRegister(data);
        if (response.status === 200) {
          const noti = {
            message: response.data.message,
            color: "success",
          };
          setNotification(dispatch, noti);
          redirect("login");
        } else {
          const noti = {
            message: response.data.error,
            color: "error",
          };
          setNotification(dispatch, noti);
          console.log("Error ", response.data.error);
        }
      } catch (error) {
        console.error("An error occurred during registration:", error);
        // Handle the case where an error occurred during the API request.
      }
    }
    setLoading(false);
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-6}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox mt={3} pt={2} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <Grid container justifyContent="space-around">
                <Grid item xs={5.5}>
                  <MDInput
                    type="text"
                    label="First Name"
                    value={fname}
                    variant="standard"
                    onChange={(e) => {
                      setFname(e.target.value);
                      setFnameError("");
                    }}
                    error={!!fnameError && validationState}
                    success={!fnameError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {fnameError}
                  </Typography>
                </Grid>
                <Grid item xs={5.5}>
                  <MDInput
                    type="text"
                    label="Last Name"
                    value={lname}
                    onChange={(e) => {
                      setLname(e.target.value);
                      setLnameError("");
                    }}
                    variant="standard"
                    error={!!lnameError && validationState}
                    success={!lnameError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {lnameError}
                  </Typography>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={4}>
              <Grid container justifyContent="space-around">
                <Grid item xs={5.5}>
                  <MDInput
                    type="email"
                    label="Email"
                    variant="standard"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (isEmailValid(e.target.value)) {
                        setEmailError("");
                      }
                    }}
                    error={!!emailError && validationState}
                    success={!emailError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {emailError}
                  </Typography>
                </Grid>
                <Grid item xs={5.5}>
                  <MDInput
                    type="text"
                    label="Mobile"
                    variant="standard"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (isMobileValid(e.target.value)) {
                        setMobileError("");
                      }
                    }}
                    error={!!mobileError && validationState}
                    success={!mobileError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {mobileError}
                  </Typography>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={4}>
              <Grid container justifyContent="space-around">
                <Grid item xs={5.5}>
                  <MDInput
                    type="password"
                    label="Password"
                    variant="standard"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    error={!!passwordError && validationState}
                    success={!passwordError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {passwordError}
                  </Typography>
                </Grid>
                <Grid item xs={5.5}>
                  <MDInput
                    type="password"
                    label="Re Enter Password"
                    variant="standard"
                    value={rePassword}
                    onChange={(e) => {
                      setRePassword(e.target.value);
                      setRePasswordError("");
                    }}
                    error={!!rePasswordError && validationState}
                    success={!rePasswordError && validationState}
                    fullWidth
                  />
                  <Typography
                    display="block"
                    variant="button"
                    textTransform="capitalize"
                    color="error"
                  >
                    {rePasswordError}
                  </Typography>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={isCheckboxChecked}
                onChange={(e) => {
                  setIsCheckboxChecked(e.target.checked);
                  setCheckboxError("");
                }}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <Typography
              display="block"
              variant="button"
              fontWeight="bold"
              textTransform="lowercase"
              color="error"
            >
              {checkboxError}
            </Typography>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                fullWidth
                disabled={loading} // Disable the button if loading is true
              >
                {loading ? "Signing up..." : "Sign up"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
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
