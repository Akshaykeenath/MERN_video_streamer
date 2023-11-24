import { Card, CircularProgress, Grid, Skeleton } from "@mui/material";
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
import { apiCheckUname } from "services/userManagement";
import { apiUpdateUser } from "services/userManagement";

function EditProfile() {
  const [controller, dispatch] = useMaterialUIController();
  const { response, error } = apiGetMyProfileData();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(propicWhite);
  const redirect = useRouteRedirect();
  const [unameChecking, setUnameChecking] = useState(false);
  const [updateBtnLoad, setUpdateBtnLoad] = useState(false);

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
  const [unameApiRes, setUnameApiRes] = useState("valid username");
  const [unameApiErr, setUnameApiErr] = useState(fname);

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

      // Mobile Number validation
      if (typeof mobile === "string" && !mobile.match(mobileRegex)) {
        setMobileError("Enter a valid mobile number (10-12 digits only)");
      } else {
        setMobileError(false);
      }
    }
    if ((fname, lname, uname, mobile)) {
      setLoading(false);
    }
  }, [fname, lname, uname, mobile]);

  useEffect(() => {
    if (!loading) {
      // User Name validation
      if (uname.length <= 0) {
        setUnameApiRes(false);
        setUnameError("Enter a valid user name");
      } else {
        if (unameApiErr.length > 0) {
          setUnameError(unameApiErr);
        } else {
          setUnameApiRes(false);
          setUnameError(false);
        }
      }
    }
  }, [uname]);

  useEffect(() => {
    if (response && response.message) {
      setUser(response.message);
    }
    if (error) {
      console.log(error);
      const noti = {
        message: "An Error occured in fetching data",
        color: "error",
      };
      setNotification(dispatch, noti);
      setLoading(false);
    }
  }, [response, error]);

  useEffect(() => {
    if (user) {
      setFname(user.fname);
      setLname(user.lname);
      setUname(user.uname);
      setMobile(user.mobile);
      if (user.channel && user.channel.img && user.channel.img[0]) {
        setProfilePicUrl(user.channel.img[0].url);
      }
    }
  }, [user]);

  useEffect(() => {
    const fileInput = document.getElementById("file-input");
    if (profilePic !== null) {
      const fileType = profilePic && profilePic.type ? profilePic.type : "";
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

  const handleUnameCheck = () => {
    setUnameChecking(true);
    setUnameApiErr(false);
    setUnameApiRes(false);
    setUnameError(false);
    if (uname === user.uname) {
      setUnameApiRes("Username available");
      setUnameChecking(false);
      return;
    }
    apiCheckUname(uname)
      .then((response) => {
        if (response.status === "error") {
          setUnameApiErr(response.message);
          setUnameError(response.message);
        } else if (response.status === "success") {
          setUnameApiRes(response.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setUnameError(err.message);
        setUnameApiErr(err.message);
      })
      .finally(() => {
        setUnameChecking(false);
      });
  };

  const handleUpdateClick = async () => {
    setUpdateBtnLoad(true);
    if (!unameApiRes) {
      const noti = {
        message: "Check if username is available",
        color: "warning",
      };
      setNotification(dispatch, noti);
    } else {
      if (fnameError || lnameError || unameError || mobileError) {
        const noti = {
          message: "Enter valid details before updating",
          color: "error",
        };
        setNotification(dispatch, noti);
      } else {
        const data = {
          fname: fname,
          lname: lname,
          uname: uname,
          mobile: mobile,
          email: user.email,
          image: profilePic,
        };
        if (user.channel && user.channel.img && user.channel.img[0]) {
          const firebaseUrl = user.channel.img[0].firebaseUrl;
          data.firebaseUrl = firebaseUrl;
        }
        const updateRes = await apiUpdateUser(data);
        if (updateRes.status === "success") {
          const noti = {
            message: "Updated successfully",
            color: "success",
          };
          setNotification(dispatch, noti);
          redirect("profile");
        } else {
          const noti = {
            message: "Error in update",
            color: "error",
          };
          setNotification(dispatch, noti);
        }
      }
    }
    setUpdateBtnLoad(false);
  };

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
              rowSpacing={4}
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
                      {loading ? (
                        <Skeleton variant="rounded" animation="wave">
                          <MDInput
                            accept="image/*"
                            id="file-input"
                            type="file"
                            onChange={(e) => {
                              setProfilePic(e.target.files[0]);
                            }}
                          />
                        </Skeleton>
                      ) : (
                        <MDInput
                          accept="image/*"
                          id="file-input"
                          type="file"
                          onChange={(e) => {
                            setProfilePic(e.target.files[0]);
                          }}
                        />
                      )}
                    </MDBox>
                  </Grid>
                </Grid>
              </Grid>
              {/* End Profile Pic Area */}

              {/* Detail Area */}
              <Grid item xs={10} md={7} px={3}>
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
                        success={!fnameError.length > 0}
                        error={fnameError.length > 0}
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
                        success={!lnameError.length > 0}
                        error={lnameError.length > 0}
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
                            success={!unameError.length > 0 && unameApiRes.length > 0}
                            error={unameError.length > 0 || unameApiErr.length > 0}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDButton
                            color="info"
                            circular
                            variant="outlined"
                            size="small"
                            onClick={() => handleUnameCheck()}
                            disabled={unameError === "Enter a valid user name" || unameChecking}
                          >
                            Check&nbsp;
                            {unameChecking && <CircularProgress color="inherit" size={15} />}
                          </MDButton>
                        </Grid>
                      </Grid>
                    )}
                    <MDTypography color="error" variant="caption" fontWeight="bold">
                      {unameError}
                    </MDTypography>
                    {!loading && (
                      <MDTypography color="success" variant="caption" fontWeight="bold">
                        {unameApiRes}
                      </MDTypography>
                    )}
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
                        success={!mobileError.length > 0}
                        error={mobileError.length > 0}
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
                    disabled={mainColor === "error" || updateBtnLoad}
                    onClick={handleUpdateClick}
                  >
                    Update&nbsp;
                    {updateBtnLoad && <CircularProgress color="inherit" size={15} />}
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
