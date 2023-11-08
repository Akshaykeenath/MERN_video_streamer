import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Card, Icon, Step, StepLabel, Stepper, useMediaQuery } from "@mui/material";
import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import VideoUploadArea from "./components/uploadArea";
import { useMaterialUIController, setNotification } from "context";
import VideoUploadDetailsArea from "./components/videoDetails";
import VideoPublishArea from "./components/publishArea";
import { apiUploadVideo } from "services/videoManagement";
import { useRouteRedirect } from "services/redirection";

function VideoUpload() {
  const redirect = useRouteRedirect();
  const defaultVideoData = {
    title: "",
    desc: "",
    tags: [],
    privacy: "private",
  };
  const [controller, dispatch] = useMaterialUIController();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoFileState, setVideoFileState] = useState(false);
  const [videFileUrl, setVideoFileUrl] = useState(null);
  const [videoData, setVideoData] = useState(defaultVideoData);
  const [videoPoster, setVideoPoster] = useState(null);
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const redirectToLogin = () => {};

  useEffect(() => {
    if (currentStep === 1 && !videoFileState) {
      setCurrentStep(0);
      const noti = {
        message: "Add a video first",
        color: "error",
      };
      setNotification(dispatch, noti);
    }
    if (currentStep === 2 && !videoData.title) {
      setCurrentStep(1);
      const noti = {
        message: "Add a valid title first",
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

  const handleVideoDetails = (videoDetails) => {
    setVideoData(videoDetails);
  };

  const handleVideoPoster = (videoPoster) => {
    if (videoPoster) {
      setVideoPoster(videoPoster);
    }
  };

  const handleVideoSubmit = async () => {
    if (!videoFileState) {
      const noti = {
        message: "Add a video first",
        color: "error",
      };
      setNotification(dispatch, noti);
      setCurrentStep(0);
    } else if (!videoData) {
      const noti = {
        message: "Add video details first",
        color: "error",
      };
      setNotification(dispatch, noti);
      setCurrentStep(1);
    } else if (!videoPoster) {
      const noti = {
        message: "Add video poster first",
        color: "error",
      };
      setNotification(dispatch, noti);
      setCurrentStep(2);
    } else {
      const videoSubmitData = {
        videoFile: videoFileState,
        details: videoData,
        poster: videoPoster,
      };
      console.log("on Submit data ", videoSubmitData);
      const response = await apiUploadVideo(videoSubmitData);
      console.log("on Submit ", response);
      if (response === "Unauthorized") {
        redirect("checkAuth");
      } else {
      }
    }
  };

  const steps = ["Upload Video", "Enter Details", "Publish"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ height: isXs ? "max-content" : "82vh" }}>
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
          {currentStep === 1 && (
            <VideoUploadDetailsArea
              onVideoDetails={handleVideoDetails}
              url={videFileUrl}
              videoDetails={videoData}
            />
          )}
          {currentStep === 2 && (
            <VideoPublishArea
              videoFile={videoFileState}
              onVideoPublish={handleVideoPoster}
              url={videFileUrl}
            />
          )}

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
                  } else {
                    handleVideoSubmit();
                  }
                }}
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"} &nbsp;
                {currentStep < steps.length - 1 && <Icon>navigate_next</Icon>}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default VideoUpload;
