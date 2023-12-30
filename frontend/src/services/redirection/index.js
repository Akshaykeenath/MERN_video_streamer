import { useLocation, useNavigate } from "react-router-dom";
import { apiDeAuth } from "services/userManagement";
import { apiAuth } from "services/userManagement";
import { useMaterialUIController, setNotification, setIsAuthenticated } from "context";
// Video Streamer React routes
import { routes } from "routes";

const checkAuth = async () => {
  try {
    const response = await apiAuth();
    if (response === "not authorised") {
      return false;
    } else if (response === "authorised") {
      console.log("User is authorized");
      return true;
    }
    // You can set the data to state if needed
  } catch (error) {
    console.error("Error:", error);
    return false; // Handle the error case by returning false
  }
};

function isPathProtected(currentPath) {
  const route = routes.find((r) => r.route === currentPath);
  return route && route.protected;
}

const getCurrentUrl = () => {
  const location = useLocation();
  return location.pathname + location.search + location.hash;
};

export function useRouteRedirect() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [controller, dispatch] = useMaterialUIController();
  const prevUrl = getCurrentUrl();
  const redirect = async (location) => {
    // Make the function async
    switch (location) {
      case "login":
        navigate("/authentication/sign-in");
        break;
      case "forgetPasswordMail":
        navigate("/authentication/reset-password-mail");
        break;
      case "profile":
        navigate("/studio/profile");
        break;
      case "editProfile":
        navigate("/studio/profile/edit");
        break;
      case "logout":
        const noti = {
          message: "Logged out Successfully",
          color: "warning",
        };
        setNotification(dispatch, noti);
        setIsAuthenticated(dispatch, false);

        apiDeAuth();
        const isProtected = isPathProtected(pathname);
        if (!isProtected) {
          navigate("/authentication/sign-in");
        }
        break;
      case "signup":
        navigate("/authentication/sign-up");
        break;
      case "dashboard":
        navigate("/studio/dashboard");
        break;
      case "home":
        navigate("/");
        break;
      case "checkAuth":
        if (!(await checkAuth())) {
          const noti = {
            message: "Please login again",
            color: "warning",
          };
          setNotification(dispatch, noti);
          setIsAuthenticated(dispatch, false);
        }
        break;
      case "videoDetailsStudio":
        navigate("/studio/videos");
        break;
      case "videoAnalyticsChannel":
        navigate("/studio/analytics");
        break;
      case "videoUpload":
        navigate("/studio/videos/upload", { state: { prevUrl: prevUrl } });
        break;
      default:
        console.log("redirect default");
        navigate("/authentication/sign-in");
    }
  };

  return redirect;
}
