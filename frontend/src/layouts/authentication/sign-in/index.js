import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { apiLogin } from "services/userManagement";
import MDSnackbar from "components/MDSnackbar";
import { useMaterialUIController, setNotification, setIsAuthenticated } from "context";
import { useRouteRedirect } from "services/redirection";
import { createBrowserHistory } from "history";

function Basic() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const redirect = useRouteRedirect();
  const [controller, dispatch] = useMaterialUIController();
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [prevUrl, setPrevUrl] = useState(null);
  const history = createBrowserHistory();
  useEffect(() => {
    setIsAuthenticated(dispatch, false);
    setPrevUrl(getCurrentUrl());
    history.push("/authentication/sign-in");
  }, []);

  const getCurrentUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("prevUrl") || null;
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password === "" || email === "") {
      const noti = {
        message: "Enter username and password",
        color: "error",
      };
      setNotification(dispatch, noti);
    } else {
      try {
        const response = await apiLogin(email, password, rememberMe);
        if (response.status === 200) {
          const noti = {
            message: "Logged in Successfully",
            color: "success",
          };
          setNotification(dispatch, noti);
          setIsAuthenticated(dispatch, true);
          if (prevUrl && prevUrl != "/authentication/sign-in") {
            navigate(prevUrl);
          } else if (location.state && location.state.prevUrl) {
            navigate(location.state.prevUrl);
          } else {
            redirect("home");
          }
        } else if (response.status === 401 && response.data && response.data.message) {
          // Handle login failure here
          const noti = {
            message: response.data.message,
            color: "error",
          };
          setNotification(dispatch, noti);
        } else {
          // Handle login failure here
          const noti = {
            message: "Internal Server Error",
            color: "error",
          };
          setNotification(dispatch, noti);
        }
      } catch (error) {
        // Handle any API request error here
        console.error("API request error:", error);
        const noti = {
          message: "Unexpected Error",
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    }
    setLoading(false);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Email or Username"
                value={email}
                onChange={handleEmailChange}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading} // Disable the button if loading is true
              >
                {loading ? "Signing in..." : "Sign in"}
              </MDButton>
            </MDBox>
            <MDBox mt={2} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t remember password?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/reset-password-mail"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Forgot password
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
