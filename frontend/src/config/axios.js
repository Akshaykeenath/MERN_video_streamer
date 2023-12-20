// axios.js
import axios from "axios";

const getCurrentUrl = () => {
  return window.location.pathname;
};

// Set up a base URL if needed
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, attach an authorization header
    const token = localStorage.getItem("currentUserJWT");
    const currentUrl = getCurrentUrl();
    if (token) {
      config.headers.Authorization = token;
    }
    config.headers.FrontEndUrl = currentUrl;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers.authorization) {
      const newToken = response.headers.authorization;
      if (newToken) {
        localStorage.setItem("currentUserJWT", newToken);
      }
      // You can handle the new token as needed
    }
    // Do something with the response data
    return response;
  },
  (error) => {
    // Do something with response error
    console.log(error);
    const message = error.response.data.message;
    if (error.response.status === 401 && message === "unauthorized") {
      const currentUrl = error.response.data.route;
      window.location.href = `/authentication/sign-in?prevUrl=${currentUrl}`;
    }
    return Promise.reject(error);
  }
);

export default axios;
