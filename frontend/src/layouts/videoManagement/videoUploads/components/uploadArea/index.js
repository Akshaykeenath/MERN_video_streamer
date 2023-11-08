import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import PropTypes from "prop-types";
import { useMaterialUIController, setNotification } from "context";

function VideoUploadArea({ onVideoData }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [dragEnter, setDragEnter] = useState(false);
  const [controller, dispatch] = useMaterialUIController();

  useEffect(() => {
    const fileInput = document.getElementById("file-input");

    if (uploadFile) {
      const fileType = uploadFile.type;
      if (fileType.startsWith("video/")) {
        // Set the uploaded file to the file input
        if (uploadFile.size > 20971520) {
          const noti = {
            message: "select a file less than 20MB",
            color: "error",
          };
          setNotification(dispatch, noti);
          fileInput.value = "";
        } else {
          const noti = {
            message: "Video Accepted",
            color: "success",
          };
          setNotification(dispatch, noti);
          onVideoData(uploadFile);
        }
      } else {
        const noti = {
          message: "Upload a video file",
          color: "error",
        };
        setNotification(dispatch, noti);
        setUploadFile(null);

        // Clear the file input
        fileInput.value = "";
      }
    }
  }, [uploadFile]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragEnter(false); // Reset the dragEnter state
    const droppedFile = e.dataTransfer.files[0];
    setUploadFile(droppedFile);
  };
  return (
    <MDBox
      bgColor={dragEnter ? "light" : "transparent"}
      onDragEnter={() => setDragEnter(true)}
      onDragLeave={() => setDragEnter(false)}
      onDragOver={(e) => e.preventDefault()} // Prevent the default behavior
      onDrop={(e) => handleFileDrop(e)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100%",
        borderRadius: "10px",
      }}
    >
      {dragEnter ? (
        <MDTypography color="text" fontWeight="bold" textTransform="capitalize" variant="h1">
          Drop the file here
        </MDTypography>
      ) : (
        <MDTypography color="text" fontWeight="bold" textTransform="capitalize" variant="h1">
          Select or drop the File
        </MDTypography>
      )}
      <MDBox>
        <MDInput
          accept="video/*"
          id="file-input"
          type="file"
          onChange={(e) => setUploadFile(e.target.files[0])}
        />
      </MDBox>
    </MDBox>
  );
}

VideoUploadArea.propTypes = {
  onVideoData: PropTypes.func, // Assuming videoData is an object
};

export default VideoUploadArea;
