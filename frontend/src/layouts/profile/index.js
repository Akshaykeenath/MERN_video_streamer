// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

import proPic from "assets/images/propicWhite.png";
import { useEffect, useState } from "react";
import { apiGetMyProfileData } from "services/userManagement";
import { CircularProgress, useMediaQuery } from "@mui/material";
import ChangePassword from "./components/ChangePassword";
import { setNotification, useMaterialUIController } from "context";

function Overview() {
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [controller, dispatch] = useMaterialUIController();
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState(null);
  const { response, error } = apiGetMyProfileData();
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
    if (error) {
      setLoading(false);
      const noti = {
        message: "An Error occured",
        color: "error",
      };
      setNotification(dispatch, noti);
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
                  {/* <ProfilesList title="conversations" profiles={profilesListData} shadow={false} /> */}
                  <ChangePassword />
                </Grid>
              )}
            </Grid>
          </MDBox>
        </Header>
      ) : (
        loading && (
          <Grid container height="77vh" direction="row" justifyContent="center" alignItems="center">
            <Grid item>
              <CircularProgress color="text" />
            </Grid>
          </Grid>
        )
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
