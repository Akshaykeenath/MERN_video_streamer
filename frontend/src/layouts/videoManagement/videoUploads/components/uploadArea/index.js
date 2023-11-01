import MDBox from "components/MDBox";
import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import PropTypes from "prop-types";

function VideoUploadArea({ onVideoData }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [dragEnter, setDragEnter] = useState(false);

  useEffect(() => {
    const fileInput = document.getElementById("file-input");

    if (uploadFile) {
      const fileType = uploadFile.type;
      if (fileType.startsWith("video/")) {
        // Set the uploaded file to the file input
        onVideoData(uploadFile);
      } else {
        console.log("Not a video file:", uploadFile);
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

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setUploadFile(selectedFile);
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
