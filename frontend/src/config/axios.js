// axios.js
import axios from "axios";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

// Utility function for navigation with state
const navigateWithState = (url, state) => {
  history.push({ pathname: url, state });
};

// Set up a base URL if needed
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // For example, attach an authorization header
    const token = localStorage.getItem("currentUserJWT");
    if (token) {
      config.headers.Authorization = token;
    }
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
      // navigateWithState("/authentication/sign-in", { prevUrl: window.location.pathname });
      // history.push("/authentication/sign-in", { prevUrl: window.location.pathname });
      window.location.href = `/authentication/sign-in?prevUrl=${window.location.pathname}`;
    }
    return Promise.reject(error);
  }
);

export default axios;
