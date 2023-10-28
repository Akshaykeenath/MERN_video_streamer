import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRouteRedirect } from "services/redirection";

const url = process.env.REACT_APP_API_URL;

export function apiLogin(uname, pass) {
  const data = {
    uname: uname,
    pass: pass,
  };
  return axios
    .post(`${url}/auth/login`, data)
    .then((response) => {
      console.log(response.data.token);
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
