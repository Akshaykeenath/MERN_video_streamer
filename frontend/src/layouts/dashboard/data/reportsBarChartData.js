import { setReportChartData } from "functions/general/graphDatas";
import { useState } from "react";

export default function getAllChartData() {
  const [subscribersChartData, setSubscribersChartData] = useState({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Subscribers", data: [0, 0, 0, 0, 0, 0, 0] },
  });
  const [viewsChartData, setViewsChartData] = useState({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Views", data: [0, 0, 0, 0, 0, 0, 0] },
  });
  const [likesChartData, setLikesChartData] = useState({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: { label: "Interactions", data: [0, 0, 0, 0, 0, 0, 0] },
  });

  const fetchChartData = (data) => {
    if (data.subscribers && data.subscribers.length > 0) {
      const { datesArray, countsArray, cumulativeSumArray } = setReportChartData(data.subscribers);
      setSubscribersChartData({
        labels: datesArray,
        datasets: { label: "Subscribers", data: countsArray },
      });
    }
    if (data.views && data.views.length > 0) {
      const { datesArray, countsArray, cumulativeSumArray } = setReportChartData(data.views);
      setViewsChartData({
        labels: datesArray,
        datasets: { label: "Views", data: cumulativeSumArray },
      });
    }
    if (data.likes && data.likes.length > 0) {
      const { datesArray, countsArray, cumulativeSumArray } = setReportChartData(data.likes, 7);
      setLikesChartData({
        labels: datesArray,
        datasets: { label: "Interactions", data: cumulativeSumArray },
      });
    }
  };

  return { fetchChartData, subscribersChartData, viewsChartData, likesChartData };
}
