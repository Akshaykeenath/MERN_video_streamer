// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import StudioNavbar from "examples/Navbars/StudioNavbar";
import Footer from "examples/Footer";
import { useEffect } from "react";
import { useRouteRedirect } from "services/redirection";
import MDTypography from "components/MDTypography";
import VideoGridLayout from "examples/VideoLayouts/Grid";
import KEVideoPlayer from "components/KEVideoPlayer";

function Home() {
  const redirect = useRouteRedirect();
  // Create an array of video data
  const videoData = [
    {
      video: {
        url: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        poster: "https://picsum.photos/3000/1800",
      },
      title: "Sample Video Title",
      channel: {
        name: "Channel Name",
        image: "https://picsum.photos/200",
        route: "/channel",
      },
      views: "100 views",
      time: "10 min ago",
      action: {
        type: "internal",
        route: "/sample-video-url",
      },
    },
    {
      video: {
        url: "http://media.w3.org/2010/05/sintel/trailer.mp4",
        poster: "https://picsum.photos/300/180",
      },
      title: "Sample Video Title",
      channel: {
        name: "Channel Name",
        image: "https://picsum.photos/200",
        route: "/channel",
      },
      views: "100 views",
      time: "10 min ago",
      action: {
        type: "external",
        route: "/sample-video-url",
      },
    },
    // Add more video data objects as needed
  ];

  const video = {
    url: "http://media.w3.org/2010/05/sintel/trailer.mp4",
    poster: "https://picsum.photos/300/180",
  };
  // useEffect(() => {
  //   redirect("checkAuth");
  // }, []);
  return (
    <DashboardLayout>
      <StudioNavbar />
      <VideoGridLayout
        title={{ color: "success", text: "trending videos", variant: "h3" }}
        videos={videoData}
      />
      {/* <KEVideoPlayer video={video} /> */}

      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Home;
