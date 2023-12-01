import { Grid } from "@mui/material";
import VideoCardList from "examples/Cards/VideoCards/VideoListCards";

function RelatedVideoList() {
  const videoData2 = {
    poster: "https://assets.codepen.io/32795/poster.png",
    url: "http://media.w3.org/2010/05/sintel/trailer.mp4",
  };

  const channelData = {
    name: "Channel Name",
    image: "https://assets.codepen.io/32795/poster.png",
    route: "/channel-route",
  };

  const actionData = {
    type: "internal",
    route: "/video-route",
  };
  const description =
    " It was raining goals in #Kochi as #KBFCCFC ended in a draw after a feisty contest! 🤝 #ISL #ISL10 #LetsFootball #ISLonJioCinema #ISLonSports18 #KeralaBlasters #ChennaiyinFC Follow all the match highlights & updates on our official YouTube channel. Like, Comment and Subscribe and make sure to click on the bell icon. To subscribe";

  return (
    <Grid container direction="column" rowSpacing={1}>
      <Grid item>
        <VideoCardList
          video={videoData2}
          title="Your Video Title"
          views="1000"
          time="10:00"
          channel={channelData}
          action={actionData}
          description={description}
        />
      </Grid>
      <Grid item>
        <VideoCardList
          video={videoData2}
          title="Your Video Title"
          views="1000"
          time="10:00"
          channel={channelData}
          action={actionData}
          description={description}
        />
      </Grid>
    </Grid>
  );
}

export default RelatedVideoList;
