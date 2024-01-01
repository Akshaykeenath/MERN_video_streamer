export function analyzeStatisticsCardData(data) {
  const result = {};

  // Determine the time duration for comparison based on the length of the data array
  let duration;

  // Iterate through each category (likes, views, subscribers)
  for (const category in data) {
    if (data.hasOwnProperty(category)) {
      const categoryData = data[category];
      console.log("category in func : ", categoryData);
      if (categoryData === null) {
        // Skip the current iteration if categoryData is null
        continue;
      }
      // Ensure categoryData is an array
      const dataArray = Array.isArray(categoryData) ? categoryData : [categoryData];
      if (dataArray.length >= 60) {
        duration = "month";
      } else if (dataArray.length >= 14) {
        duration = "week";
      } else if (dataArray.length >= 2) {
        duration = "day";
      } else {
        duration = "day"; // Default to day if less than 2 entries
      }

      // Calculate total count for the category
      const totalCount = dataArray.reduce((acc, entry) => acc + entry.count, 0);

      // Calculate the count based on the determined duration
      let thisDurationCount = 0;
      let lastDurationCount = 0;

      switch (duration) {
        case "month":
          thisDurationCount = dataArray.reduce((acc, entry) => acc + entry.count, 0);
          lastDurationCount = 0; // There is no last month count in this case
          break;
        case "week":
          thisDurationCount =
            dataArray.length >= 7
              ? dataArray.slice(-7).reduce((acc, entry) => acc + entry.count, 0)
              : 0;
          lastDurationCount =
            dataArray.length >= 14
              ? dataArray.slice(-14, -7).reduce((acc, entry) => acc + entry.count, 0)
              : 0;
          break;
        case "day":
          thisDurationCount =
            dataArray.length >= 1
              ? dataArray.slice(-2).reduce((acc, entry) => acc + entry.count, 0)
              : 0;
          lastDurationCount = dataArray.length >= 2 ? dataArray[dataArray.length - 2].count : 0;
          break;
        default:
          break;
      }

      // Calculate the percentage difference with the last duration's count
      const percentageDifference =
        thisDurationCount !== 0
          ? Math.round(
              ((thisDurationCount - lastDurationCount) /
                Math.max(thisDurationCount, lastDurationCount)) *
                100
            )
          : 0;

      // Create a summary object for the category
      const categorySummary = {
        totalCount,
        thisDurationCount,
        lastDurationCount,
        percentageDifference,
        duration,
      };

      // Add the category summary to the result
      result[category] = categorySummary;
    }
  }

  return result;
}

const getAbbreviatedDay = (dateString) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const myDate = new Date(dateString);
  const dayOfWeek = myDate.getDay();
  const abbreviatedDayString = days[dayOfWeek];
  return abbreviatedDayString;
};

const getAbbreviatedMonthAndDate = (dateString) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const myDate = new Date(dateString);
  const month = months[myDate.getMonth()];
  const date = myDate.getDate();
  const formattedDate = `${month} ${date}`;
  return formattedDate;
};

export function setReportChartData(data, duration = 7) {
  const negDuration = 0 - duration;
  // Ensure that data has at least 7 items
  const dataSlice = data.slice(negDuration);
  const dataLength = dataSlice.length;

  // If data has less than 7 items, fill in the missing dates with 0 counts
  if (dataLength < 7) {
    const missingCount = 7 - dataLength;
    const currentDate = new Date(dataSlice[0]?.date || new Date());
    for (let i = 0; i < missingCount; i++) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - (i + 1));

      dataSlice.unshift({
        date: previousDate.toISOString().split("T")[0],
        count: 0,
      });
    }
  }

  // Separate dates and counts into two arrays
  const datesArray = dataSlice.map((item) => {
    if (dataSlice.length <= 7) {
      return getAbbreviatedDay(item.date);
    } else if (dataSlice.length <= 365) {
      return getAbbreviatedMonthAndDate(item.date);
    } else {
      return String(item.date);
    }
  });
  const countsArray = dataSlice.map((item) => item.count);

  // Calculate cumulative sum
  let cumulativeSum = 0;
  if (data.length > duration) {
    cumulativeSum = data.slice(0, negDuration).reduce((acc, entry) => acc + entry.count, 0);
  }
  const cumulativeSumArray = countsArray.map((count) => {
    cumulativeSum += count;
    return cumulativeSum;
  });

  // You can return the arrays or use them as needed in your application
  return { datesArray, countsArray, cumulativeSumArray };
}

export function setPieChartDataLike(data, duration = 7) {
  const negDuration = 0 - duration;
  // Ensure that data has at least 7 items
  const dataSlice = data.slice(negDuration);

  const likeCount = dataSlice.reduce((acc, entry) => acc + entry.likeCount, 0);
  const dislikeCount = dataSlice.reduce((acc, entry) => acc + entry.dislikeCount, 0);

  // You can return the arrays or use them as needed in your application
  return { likeCount, dislikeCount };
}
