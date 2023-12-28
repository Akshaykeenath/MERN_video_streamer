import { setPieChartDataLike } from "functions/general/graphDatas";
import { setReportChartData } from "functions/general/graphDatas";
import { setReportChartDataWeek } from "functions/general/graphDatas";
import { useState } from "react";

export default function getAllChartData() {
  const [subscribersChartData, setSubscribersChartData] = useState({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Subscribers",
        color: "dark",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  const [viewsChartData, setViewsChartData] = useState({
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Views",
        color: "info",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });
  const [likesChartData, setLikesChartData] = useState({
    labels: ["DisLikes", "Likes"],
    datasets: {
      label: "Count",
      backgroundColors: ["primary", "info"],
      data: [0, 0],
    },
  });

  const fetchChartData = (data, duration) => {
    if (data.subscribers && data.subscribers.length > 0) {
      const { datesArray, countsArray, cumulativeSumArray } = setReportChartData(
        data.subscribers,
        duration
      );
      setSubscribersChartData({
        labels: datesArray,
        datasets: [
          {
            label: "Subscribers",
            color: "dark",
            data: countsArray,
          },
        ],
      });
    }
    if (data.views && data.views.length > 0) {
      const { datesArray, countsArray, cumulativeSumArray } = setReportChartData(
        data.views,
        duration
      );
      setViewsChartData({
        labels: datesArray,
        datasets: [
          {
            label: "Views",
            color: "info",
            data: cumulativeSumArray,
          },
        ],
      });
    }
    if (data.likes && data.likes.length > 0) {
      const { likeCount, dislikeCount } = setPieChartDataLike(data.likes, duration);
      // If block is for a potential bug fix when dislike=0
      if (dislikeCount === 0) {
        setLikesChartData({
          labels: ["Likes", "DisLikes"],
          datasets: {
            label: "Count",
            backgroundColors: ["info", "primary"],
            data: [likeCount, dislikeCount],
          },
        });
      } else {
        setLikesChartData({
          labels: ["DisLikes", "Likes"],
          datasets: {
            label: "Count",
            backgroundColors: ["primary", "info"],
            data: [dislikeCount, likeCount],
          },
        });
      }
    }
  };

  return { fetchChartData, subscribersChartData, viewsChartData, likesChartData };
}
