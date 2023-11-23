import { Card, Grid, Skeleton } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useMaterialUIController, setNotification } from "context";
import propicWhite from "assets/images/propicWhite.png";
import MDButton from "components/MDButton";
import { useRouteRedirect } from "services/redirection";
import { apiGetMyProfileData } from "services/userManagement";

function EditProfile() {
  const [controller, dispatch] = useMaterialUIController();
  const { response, error } = apiGetMyProfileData();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(propicWhite);
  const redirect = useRouteRedirect();

  // Input box states
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [uname, setUname] = useState("");
  const [mobile, setMobile] = useState("");

  // Input box Error states
  const [fnameError, setFnameError] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [unameError, setUnameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [mainColor, setMainColor] = useState("text");

  useEffect(() => {
    if (fnameError || lnameError || unameError || mobileError) {
      setMainColor("error");
    } else {
      setMainColor("success");
    }
  }, [fnameError, lnameError, unameError, mobileError]);

  useEffect(() => {
    if (!loading) {
      const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
      const mobileRegex = /^\d{10,12}$/;

      // First Name validation
      if (!fname.match(nameRegex)) {
        setFnameError("Enter a valid first name");
      } else {
        setFnameError(false);
      }

      // Last Name validation
      if (!lname.match(nameRegex)) {
        setLnameError("Enter a valid last name");
      } else {
        setLnameError(false);
      }

      // User Name validation
      if (uname.length <= 0) {
        setUnameError("Enter a valid user name");
      } else {
        setUnameError(false);
      }

      // Mobile Number validation
      if (typeof mobile === "string" && !mobile.match(mobileRegex)) {
        setMobileError("Enter a valid mobile number (10-12 digits only)");
      } else {
        setMobileError(false);
      }
    }
  }, [fname, lname, uname, mobile, loading]);

  useEffect(() => {
    if (response && response.message) {
      setUser(response.message);
    }
    if (error) {
      console.log(error);
      setLoading(false);

      const noti = {
        message: "An Error occured in fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
    }
  }, [response, error]);

  useEffect(() => {
    if (user) {
      setLoading(false);
      console.log(user);
      setFname(user.fname);
      setLname(user.lname);
      setUname(user.uname);
      setMobile(user.mobile);
    }
  }, [user]);

  useEffect(() => {
    const fileInput = document.getElementById("file-input");
    if (profilePic !== null) {
      const fileType = profilePic.type;
      if (fileType.startsWith("image/")) {
        setProfilePicUrl(URL.createObjectURL(profilePic));
      } else {
        const noti = {
          message: "Upload an Image file",
          color: "error",
        };
        setNotification(dispatch, noti);
        fileInput.value = "";
        setProfilePic(null);
      }
    }
  }, [profilePic]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={4}
          width="100%"
        >
          <Grid item m={3}>
            <MDTypography color={mainColor} fontWeight="medium" variant="h3" textGradient>
              Update User Details
            </MDTypography>
          </Grid>
          {/* Details Area */}
          <Grid item width="100%">
            <Grid
              container
              direction="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              columnSpacing={4}
            >
              {/* Profile Pic Area */}
              <Grid item xs={12} md={5}>
                <Grid
                  container
                  width="100%"
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <MDBox position="relative" borderRadius="lg" mb={5}>
                      {/* First MDAvatar */}
                      {!loading && user ? (
                        <MDAvatar
                          src={profilePicUrl}
                          shadow="xxl"
                          size="xxl"
                          bgColor="dark"
                          sx={{
                            zIndex: 1,
                            position: "relative",
                          }}
                        />
                      ) : (
                        <Skeleton variant="circular" animation="wave">
                          <MDAvatar
                            src={profilePicUrl}
                            shadow="xxl"
                            size="xxl"
                            bgColor="dark"
                            sx={{
                              zIndex: 1,
                              position: "relative",
                            }}
                          />
                        </Skeleton>
                      )}

                      {/* Second MDAvatar (Shadow) */}
                      <MDAvatar
                        width="100%"
                        height="100%"
                        shadow="xxl"
                        size="xxl"
                        left={0}
                        sx={{
                          top: "1rem",
                          position: "absolute",
                          backgroundImage: `url(${profilePicUrl})`,
                          transform: "scale(0.94)",
                          filter: "blur(12px)",
                          backgroundSize: "cover",
                          zIndex: 0, // Lower zIndex to appear behind the first MDAvatar
                        }}
                      />
                    </MDBox>
                  </Grid>
                  <Grid item>
                    <MDBox>
                      <MDInput
                        accept="image/*"
                        id="file-input"
                        type="file"
                        onChange={(e) => {
                          setProfilePic(e.target.files[0]);
                        }}
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </Grid>
              {/* End Profile Pic Area */}

              {/* Detail Area */}
              <Grid item xs={12} md={7} px={3}>
                <Grid
                  container
                  direction="column"
                  rowSpacing={3}
                  width="100%"
                  justifyContent="space-around"
                >
                  <Grid item>
                    {loading ? (
                      <Skeleton variant="rounded" animation="wave" height="5vh" />
                    ) : (
                      <MDInput
                        label="First Name"
                        value={fname}
                        onChange={(e) => {
                          setFname(e.target.value);
                        }}
                        success={!fnameError}
                        error={fnameError}
                        fullWidth
                      />
                    )}
                    <MDTypography color="error" variant="caption" fontWeight="bold">
                      {fnameError}
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    {loading ? (
                      <Skeleton variant="rounded" animation="wave" height="5vh" />
                    ) : (
                      <MDInput
                        label="Last Name"
                        value={lname}
                        onChange={(e) => {
                          setLname(e.target.value);
                        }}
                        success={!lnameError}
                        error={lnameError}
                        fullWidth
                      />
                    )}
                    <MDTypography color="error" variant="caption" fontWeight="bold">
                      {lnameError}
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    {loading ? (
                      <Skeleton variant="rounded" animation="wave" height="5vh" />
                    ) : (
                      <Grid
                        container
                        direction="row"
                        columnSpacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={10}>
                          <MDInput
                            label="User Name"
                            value={uname}
                            onChange={(e) => {
                              setUname(e.target.value);
                            }}
                            success={!unameError}
                            error={unameError}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDButton color="info" circular variant="outlined" size="small">
                            Check
                          </MDButton>
                        </Grid>
                      </Grid>
                    )}
                    <MDTypography color="error" variant="caption" fontWeight="bold">
                      {unameError}
                    </MDTypography>
                  </Grid>
                  <Grid item>
                    {loading ? (
                      <Skeleton variant="rounded" animation="wave" height="5vh" />
                    ) : (
                      <MDInput
                        label="Mobile"
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value);
                        }}
                        success={!mobileError}
                        error={mobileError}
                        fullWidth
                      />
                    )}
                    <MDTypography color="error" variant="caption" fontWeight="bold">
                      {mobileError}
                    </MDTypography>
                  </Grid>
                </Grid>
              </Grid>
              {/* End Detail Area */}
            </Grid>
          </Grid>
          {/* End Details Area */}

          <Grid item width="100%">
            <Grid
              container
              direction="row"
              columnSpacing={1}
              justifyContent="flex-end"
              alignItems="center"
              p={3}
            >
              <Grid item>
                <MDButton color="secondary" circular onClick={() => redirect("profile")}>
                  Cancel
                </MDButton>
              </Grid>
              <Grid item>
                {loading ? (
                  <Skeleton variant="rounded" animation="wave">
                    <MDButton color="info" circular>
                      Update
                    </MDButton>
                  </Skeleton>
                ) : (
                  <MDButton
                    color="info"
                    circular
                    disabled={fnameError || lnameError || unameError || mobileError}
                  >
                    Update
                  </MDButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </DashboardLayout>
  );
}

export default EditProfile;
