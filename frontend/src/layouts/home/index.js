// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import Footer from "examples/Footer";
import { useEffect } from "react";
import { useRouteRedirect } from "services/redirection";
import MDTypography from "components/MDTypography";

function Home() {
  const redirect = useRouteRedirect();

  useEffect(() => {
    redirect("checkAuth");
  }, []);

  return (
    <DashboardLayout>
      <StudioNavbar />
      <MDTypography> Hai </MDTypography>
      <Footer />
    </DashboardLayout>
  );
}

export default Home;
