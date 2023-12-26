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
import UploadFinishArea from "./components/finishArea";
import { useLocation, useNavigate } from "react-router-dom";

function VideoUpload() {
  const navigate = useNavigate();

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
  const [addingDetails, setAddingDetails] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [prevUrl, setPrevUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Set the title when the component mounts
    document.title = "KeTube Studio";

    // Optionally, you can return a cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "KeTube";
    };
  }, []);

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
  const handleUploadProgress = (progress) => {
    // Update the UI or do something with the progress in the main area
    setUploadProgress(progress);
  };

  const handleVideoSubmit = async () => {
    redirect("checkAuth");
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
      setAddingDetails(false);
      const videoSubmitData = {
        videoFile: videoFileState,
        details: videoData,
        poster: videoPoster,
      };
      const response = await apiUploadVideo(videoSubmitData, handleUploadProgress);
      if (response === "Unauthorized") {
        redirect("checkAuth");
      } else {
      }
    }
  };

  const handleBackClick = () => {
    if (location.state && location.state.prevUrl) {
      navigate(location.state.prevUrl);
    } else {
      redirect("videoDetailsStudio");
    }
  };

  const steps = ["Upload Video", "Enter Details", "Publish"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {addingDetails && (
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
                {currentStep === 0 && (
                  <MDButton
                    variant="gradient"
                    color="secondary"
                    circular
                    onClick={() => handleBackClick()}
                  >
                    Back
                  </MDButton>
                )}
                <MDButton
                  variant="gradient"
                  color="info"
                  disabled={currentStep === 0}
                  sx={{ display: currentStep === 0 ? "none" : "block" }}
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
      )}
      {!addingDetails && <UploadFinishArea progress={uploadProgress} />}
    </DashboardLayout>
  );
}

export default VideoUpload;
