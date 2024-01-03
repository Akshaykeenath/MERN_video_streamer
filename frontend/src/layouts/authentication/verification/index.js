// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { useLocation } from "react-router-dom";
import { sendMailVerification } from "services/userManagement";
import { useRouteRedirect } from "services/redirection";
import { setNotification, useMaterialUIController } from "context";
import { useState } from "react";

function VerificationArea() {
  const [loading, setLoading] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const redirect = useRouteRedirect();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationType = searchParams.get("type");
  const token = searchParams.get("token");

  const handleVerifyClick = async () => {
    setLoading(true);
    const data = {
      token: token,
    };
    try {
      const response = await sendMailVerification(data);
      if (response.status === 200) {
        const noti = {
          message: response.data.message,
          color: "success",
        };
        setNotification(dispatch, noti);
        redirect("login");
      } else {
        const noti = {
          message: response.data.message,
          color: "error",
        };
        setNotification(dispatch, noti);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading back to false
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
          <MDTypography
            variant="h3"
            fontWeight="medium"
            color="white"
            mt={1}
            textTransform="capitalize"
          >
            Verify {verificationType}
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Click on the below button to verify your {verificationType}.
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mt={6} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleVerifyClick}
                disabled={loading} // Disable the button if loading is true
              >
                {loading ? "Verifying..." : "Verify"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default VerificationArea;
