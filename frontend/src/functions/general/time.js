export const getRelativeTime = (timestamp) => {
  const currentTime = new Date();
  const postTime = new Date(timestamp);
  const timeDifference = currentTime - postTime;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} months ago`;
  } else if (days > 0) {
    return `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} hr ago`;
  } else if (minutes > 0) {
    return `${minutes} min ago`;
  } else {
    return "Just now";
  }
};

export const getRelativeDate = (timestamp) => {
  const currentDate = new Date();
  const inputDate = new Date(timestamp);

  // Check if it's today
  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    return "Today";
  }

  // Check if it's yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  // If not today or yesterday, return the local date
  return inputDate.toLocaleDateString();
};

export const getRelativeDateMonth = (timestamp) => {
  const inputDate = new Date(timestamp);

  // Return the formatted date
  const options = { month: "short", day: "numeric", year: "numeric" };
  return inputDate.toLocaleDateString("en-US", options);
};
