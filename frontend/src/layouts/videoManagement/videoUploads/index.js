import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Card, Icon, Step, StepLabel, Stepper } from "@mui/material";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import VideoUploadArea from "./components/uploadArea";
import { useMaterialUIController, setNotification } from "context";
import VideoUploadDetailsArea from "./components/videoDetails";

function VideoUpload() {
  const [controller, dispatch] = useMaterialUIController();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoFileState, setVideoFileState] = useState(false);
  const [videFileUrl, setVideoFileUrl] = useState(null);

  useEffect(() => {
    if (currentStep === 1 && !videoFileState) {
      setCurrentStep(currentStep - 1);
      const noti = {
        message: "Add a video first",
        color: "error",
      };
      setNotification(dispatch, noti);
    }
  }, [currentStep]);

  const handleVideoData = (videoFile) => {
    // Handle the video file data here
    setVideoFileState(videoFile);
    setVideoFileUrl(URL.createObjectURL(videoFile));

    setCurrentStep(currentStep + 1);
    // You can set the file data in the state or perform any other necessary actions.
  };

  const steps = ["Upload Video", "Enter Details", "Publish"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ height: "78vh" }}>
        <MDBox
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <MDBox>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </MDBox>

          {currentStep === 0 && <VideoUploadArea onVideoData={handleVideoData} />}
          {currentStep === 1 && <VideoUploadDetailsArea url={videFileUrl} />}

          <MDBox p={2}>
            <MDBox sx={{ display: "flex", justifyContent: "flex-end" }}>
              <MDButton
                variant="gradient"
                color="info"
                disabled={currentStep === 0}
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                  }
                }}
              >
                <Icon>navigate_before</Icon>&nbsp; Previous
              </MDButton>

              <MDButton
                variant="gradient"
                color="info"
                sx={{ ml: "10px" }}
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  }
                }}
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"} &nbsp;
                {currentStep < steps.length - 1 && <Icon>navigate_next</Icon>}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default VideoUpload;
