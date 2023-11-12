import { useNavigate } from "react-router-dom";
import { apiDeAuth } from "services/userManagement";
import { apiAuth } from "services/userManagement";
import { useMaterialUIController, setNotification, setAppDomain } from "context";

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

export function useRouteRedirect() {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const redirect = async (location) => {
    // Make the function async
    switch (location) {
      case "login":
        navigate("/authentication/sign-in");
        break;
      case "profile":
        setAppDomain(dispatch, "studio");
        navigate("/profile");
        break;
      case "logout":
        const noti = {
          message: "Logged out Successfully",
          color: "warning",
        };
        setNotification(dispatch, noti);
        apiDeAuth();
        setAppDomain(dispatch, "default");
        navigate("/authentication/sign-in");
        break;
      case "signup":
        setAppDomain(dispatch, "default");
        navigate("/authentication/sign-up");
        break;
      case "dashboard":
        setAppDomain(dispatch, "studio");
        navigate("/dashboard");
        break;
      case "home":
        setAppDomain(dispatch, "default");
        navigate("/");
        break;
      case "checkAuth":
        if (!(await checkAuth())) {
          const noti = {
            message: "Please login again",
            color: "warning",
          };
          setNotification(dispatch, noti);
          setAppDomain(dispatch, "default");
          navigate("/authentication/sign-in");
        }
        break;
      default:
        console.log("redirect default");
        setAppDomain(dispatch, "default");
        navigate("/authentication/sign-in");
    }
  };

  return redirect;
}
