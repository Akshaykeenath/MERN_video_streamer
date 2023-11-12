// axios.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const redirectLogin = () => {
  const navigate = useNavigate();
  navigate("/authentication/sign-in");
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
    // Do something with the response data
    return response;
  },
  (error) => {
    // Do something with response error
    if (error.response.status === 401) {
      redirectLogin();
    }
    return Promise.reject(error);
  }
);

export default axios;
