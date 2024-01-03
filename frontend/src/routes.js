/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/
// @mui icons
import { CircularProgress, Grid } from "@mui/material";
import Icon from "@mui/material/Icon";
import Trending from "layouts/trending";
import React, { Suspense, lazy } from "react";

// Lazy load layouts
const Dashboard = lazy(() => import("layouts/dashboard"));
const Profile = lazy(() => import("layouts/profile"));
const SignIn = lazy(() => import("layouts/authentication/sign-in"));
const ResetPasswordMail = lazy(() => import("layouts/authentication/reset-password/cover"));
const ResetPasswordModify = lazy(() => import("layouts/authentication/reset-password/modify"));
const SignUp = lazy(() => import("layouts/authentication/sign-up"));
const Home = lazy(() => import("layouts/home"));
const Subscriptions = lazy(() => import("layouts/subscriptions"));
const VerificationArea = lazy(() => import("layouts/authentication/verification"));
const VideoUpload = lazy(() => import("layouts/videoManagement/videoUploads"));
const VideoPageStudio = lazy(() => import("layouts/videoManagement/videoPageStudio"));
const VideoViewMaster = lazy(() => import("layouts/videoManagement/videoStream"));
const EditProfile = lazy(() => import("layouts/profile/editProfile"));
const Channel = lazy(() => import("layouts/channel"));
const SearchResults = lazy(() => import("layouts/searchResults"));
const AnalyticsChannel = lazy(() => import("layouts/analytics/channelPage"));
const AnalyticsVideo = lazy(() => import("layouts/analytics/videoPage"));
const LikedVideosPage = lazy(() => import("layouts/likedVideos"));
const AllVideosPage = lazy(() => import("layouts/allVideos"));

const CenteredLoading = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <CircularProgress color="inherit" />
      </Grid>
    </Grid>
  );
};

const routes = [
  {
    type: "collapse",
    name: "Home",
    key: "",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Home />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Trending",
    key: "trending",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/trending",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Trending />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Subscriptions",
    key: "subscriptions",
    icon: <Icon fontSize="small">subscriptions</Icon>,
    route: "/subscriptions",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Subscriptions />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Liked Videos",
    key: "likedvideos",
    icon: <Icon fontSize="small">favorite</Icon>,
    route: "/likedvideos",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <LikedVideosPage />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "All Videos",
    key: "allvideos",
    icon: <Icon fontSize="small">smart_display</Icon>,
    route: "/allvideos",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <AllVideosPage />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "videoMaster",
    route: "/video/:videoId",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <VideoViewMaster />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "channel",
    route: "/channel/:channelId",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Channel />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "searchResults",
    route: "/results",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <SearchResults />
      </Suspense>
    ),
    protected: true,
  },
  // Studio Area

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/studio/dashboard",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Dashboard />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Videos",
    key: "videos",
    icon: <Icon fontSize="small">video_call</Icon>,
    route: "/studio/videos",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <VideoPageStudio />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "videos",
    icon: <Icon fontSize="small">video_call</Icon>,
    route: "/studio/videos/upload",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <VideoUpload />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Analytics",
    key: "analytics",
    icon: <Icon fontSize="small">insert_chart_outlined</Icon>,
    route: "/studio/analytics",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <AnalyticsChannel />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "analytics",
    route: "/studio/analytics/video",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <AnalyticsVideo />
      </Suspense>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/studio/profile",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <Profile />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "profile",
    route: "/studio/profile/edit",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <EditProfile />
      </Suspense>
    ),
    protected: true,
  },
  {
    key: "signin",
    route: "/authentication/sign-in",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    key: "signup",
    route: "/authentication/sign-up",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    key: "verify",
    route: "/authentication/verify",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <VerificationArea />
      </Suspense>
    ),
  },
  {
    key: "forget-password",
    route: "/authentication/reset-password-mail",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <ResetPasswordMail />
      </Suspense>
    ),
  },
  {
    key: "reset-password",
    route: "/authentication/reset-password",
    component: (
      <Suspense fallback={<CenteredLoading />}>
        <ResetPasswordModify />
      </Suspense>
    ),
  },
];

const studioRoutes = [];

export { routes, studioRoutes };
