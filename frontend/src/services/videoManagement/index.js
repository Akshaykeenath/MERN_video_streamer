import axios from "axios";
const url = process.env.REACT_APP_API_URL;

export function apiUploadVideo(videoData) {
  const token = localStorage.getItem("currentUserJWT");

  const formData = new FormData();
  formData.append("videoData", JSON.stringify(videoData.details));
  formData.append("videoFile", videoData.videoFile);
  formData.append("poster", videoData.poster);

  return axios
    .post(`${url}/private/video/upload`, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("Error in apiUploadVideo", error);

      if (error.response) {
        if (error.response && error.response.statusText === "Unauthorized") {
          return error.response.statusText;
        }
      } else {
        console.log("Error in apiUploadVideo", error);
      }
    });
}
