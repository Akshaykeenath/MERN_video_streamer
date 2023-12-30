/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import burceMars from "assets/images/bruce-mars.jpg";
import proPic from "assets/images/propicWhite.png";
import { useEffect, useState } from "react";
import { apiGetMyProfileData } from "services/userManagement";
import { CircularProgress, useMediaQuery } from "@mui/material";

function Overview() {
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState(null);
  const { response, error } = apiGetMyProfileData();
  const [userPic, setUserPic] = useState(null);

  useEffect(() => {
    // Set the title when the component mounts
    document.title = "KeTube Studio";

    // Optionally, you can return a cleanup function to reset the title when the component unmounts
    return () => {
      document.title = "KeTube";
    };
  }, []);

  useEffect(() => {
    if (response) {
      const userData = response.message;
      setUser(userData);
    }
    if (error) {
      console.log("error : ", error);
    }
  }, [response, error]);

  useEffect(() => {
    if (user && user.channel && user.channel.img && user.channel.img[0]) {
      const pic = user.channel.img[0].url;
      if (pic) {
        setUserPic(pic);
      }
    } else if (user) {
      setUserPic(proPic);
    }
  }, [user]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {user ? (
        <Header
          name={user.fname + " " + user.lname}
          username={user.uname}
          proPic={userPic}
          onTabChange={(val) => {
            setCurrentTab(val);
          }}
        >
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              {(currentTab === 0 || isLg) && (
                <Grid item xs={12} lg={4} sx={{ display: "flex" }}>
                  <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                  <ProfileInfoCard
                    title="profile information"
                    info={{
                      userName: user.uname,
                      firstName: user.fname,
                      lastName: user.lname,
                      mobile: String(user.mobile),
                      email: user.email,
                    }}
                    action={{ route: "/studio/profile/edit", tooltip: "Edit Profile" }}
                    shadow={false}
                  />
                  <Divider orientation="vertical" sx={{ mx: 0 }} />
                </Grid>
              )}
              {(currentTab === 2 || isLg) && (
                <Grid item xs={12} lg={4}>
                  <PlatformSettings />
                </Grid>
              )}
              {(currentTab === 1 || isLg) && (
                <Grid item xs={12} lg={4}>
                  <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
                </Grid>
              )}
            </Grid>
          </MDBox>
        </Header>
      ) : (
        <Grid container height="77vh" direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <CircularProgress color="text" />
          </Grid>
        </Grid>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
