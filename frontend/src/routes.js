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

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Home from "layouts/home";
import VerificationArea from "layouts/authentication/verification";
import VideoUpload from "layouts/videoManagement/videoUploads";
import VideoPageStudio from "layouts/videoManagement/videoPageStudio";
import VideoViewMaster from "layouts/videoManagement/videoStream";

const routes = [
  {
    type: "collapse",
    name: "Home",
    key: "",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/",
    component: <Home />,
    protected: true,
  },
  {
    key: "videoMaster",
    route: "/video/:videoId",
    component: <VideoViewMaster />,
    protected: true,
  },
  // Studio Area

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/studio/dashboard",
    component: <Dashboard />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Videos",
    key: "videos",
    icon: <Icon fontSize="small">video_call</Icon>,
    route: "/studio/videos",
    component: <VideoPageStudio />,
    protected: false,
  },
  {
    key: "videos",
    icon: <Icon fontSize="small">video_call</Icon>,
    route: "/studio/videos/upload",
    component: <VideoUpload />,
    protected: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true,
  },
  {
    key: "signin",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    key: "signup",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    key: "verify",
    route: "/authentication/verify",
    component: <VerificationArea />,
  },
];

const studioRoutes = [];

export { routes, studioRoutes };
