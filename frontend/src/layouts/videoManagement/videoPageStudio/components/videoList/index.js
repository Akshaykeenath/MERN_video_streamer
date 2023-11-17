import { Card, CircularProgress, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import VideoTable from "examples/Tables/VideoTable";
import { useEffect, useReducer, useState } from "react";
import videoTableData from "layouts/videoManagement/videoPageStudio/data/videoTableData";
import KESlideModal from "components/KEModals/SlideModal";

function VideoList() {
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  const handleSelectedVideo = (data) => {
    if (data.action === "loading") {
      setLoading(false);
    } else {
      if (data.action === "delete") {
        setModalData({
          videoID: data.id,
          title: "Confirm ?",
          body: "Are you sure you want to delete ?",
          buttons: [
            { color: "success", label: "No", value: "no" },
            { color: "error", label: "Yes", value: "yes" },
          ],
          onAction: handleModalAction,
        });
      }
    }
  };

  const { columns, rows } = videoTableData({ onVideoDataCallback: handleSelectedVideo });
  useEffect(() => {
    if (columns.length > 0 && rows.length > 0) {
      setLoading(false);
    }
  }, [rows, columns]);

  useEffect(() => {
    if (modalData && modalData.onAction) {
      if (modalData.actionValue === "yes" && modalData.videoID !== null) {
        console.log("Deleted the video : ", modalData.videoID);
        // Perform the delete operation here
        setModalData(null);
      }
    }
  }, [modalData]);

  const handleModalAction = (value) => {
    if (value === "yes") {
      setModalData((prevData) => ({ ...prevData, actionValue: value }));
    } else {
      // For "No" or other cases, just close the modal
      setModalData(null);
    }
  };

  return (
    <MDBox pt={6}>
      <Card>
        <MDBox
          mx={2}
          mt={-3}
          py={2}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
        >
          <MDTypography variant="h6" color="white">
            Video List
          </MDTypography>
        </MDBox>
        {!loading && columns.length > 0 && rows.length > 0 ? (
          <MDBox>
            <VideoTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        ) : (
          <MDBox display="flex" alignItems="center" justifyContent="center">
            {loading && <CircularProgress color="inherit" />}
            {!loading && <MDTypography color="text">No Videos to show here!!!</MDTypography>}
          </MDBox>
        )}
      </Card>
      {modalData && (
        <KESlideModal
          title={modalData.title}
          body={modalData.body}
          onAction={modalData.onAction}
          buttons={modalData.buttons}
        />
      )}
    </MDBox>
  );
}

export default VideoList;
