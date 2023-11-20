import axios from "axios";
import myaxios from "config/axios";
import { useEffect, useState } from "react";

const url = process.env.REACT_APP_API_URL;

export function sendMailVerification(data) {
  return axios
    .post(`${url}/auth/verify/email`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function apiLogin(uname, pass, rememberMe) {
  const data = {
    uname: uname,
    pass: pass,
    rememberMe: rememberMe,
  };
  return axios
    .post(`${url}/auth/login`, data)
    .then((response) => {
      localStorage.setItem("currentUserJWT", response.data.token);
      return response.data.message;
    })
    .catch((error) => {
      return error.response.data.message;
    });
}

export function apiAuth() {
  const token = localStorage.getItem("currentUserJWT");
  return axios
    .get(`${url}/auth`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      return response.data.message;
    })
    .catch((error) => {
      return error.response.data.error;
    });
}

export function apiDeAuth() {
  localStorage.removeItem("currentUserJWT");
}

// Function for registration
export function apiRegister(e) {
  const data = {
    fname: e.fname,
    lname: e.lname,
    uname: e.uname,
    mobile: e.mobile,
    email: e.email,
    pass: e.pass,
  };

  return axios
    .post(`${url}/auth/register`, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error.response;
    });
}

export function apiGetMyProfileData(refreshData) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    myaxios
      .get("/private/profile/my")
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, [refreshData]);

  return { response, error };
}
