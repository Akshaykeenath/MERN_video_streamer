import { Card, Grid } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { RowDetails } from "./rowDetails";
import VideoTable from "examples/Tables/VideoTable";
import { useState } from "react";
import videoTableData from "layouts/videoManagement/videoPageStudio/data/videoTableData";

function VideoList() {
  const { columns, rows } = videoTableData();

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
        <MDBox>
          <VideoTable
            table={{ columns, rows }}
            isSorted={true}
            entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20, 25] }}
            showTotalEntries={true}
            noEndBorder
          />
          {/* <RowDetails videoName="Aksakjs" col1="Hahahahahahah" col2="hhhhhhhhh" col3="abajbb" /> */}
        </MDBox>
      </Card>
    </MDBox>
  );
}

export default VideoList;
