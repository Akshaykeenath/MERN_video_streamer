// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

import { Link } from "react-router-dom";
import { getMyvideoData } from "services/videoManagement";
import { useEffect } from "react";
import PropTypes from "prop-types";

export default function data() {
  const { response, error } = getMyvideoData();

  useEffect(() => {
    if (error) {
      console.log("error ", error);
    }
  }, [error, response]);
  const Video = ({ image, name, link }) => (
    <Link to={link}>
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Link>
  );

  Video.propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    link: PropTypes.string,
  };

  return {
    columns: response
      ? [
          { Header: "video", accessor: "video", width: "45%", align: "left" },
          { Header: "status", accessor: "status", align: "center" },
          { Header: "uploaded", accessor: "uploaded", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ]
      : [],

    rows: response
      ? response.videos.map((video) => ({
          video: <Video image={video.poster[0].url} name={video.title} link="#" />,
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={video.privacy}
                color={video.privacy === "public" ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          uploaded: (
            <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
              23/04/23
            </MDTypography>
          ),
          action: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              Edit
            </MDTypography>
          ),
        }))
      : [],
  };
}
