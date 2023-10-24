import axios from "axios";

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
    email: e.email,
  };

  return axios
    .post(`${url}auth/register`, data)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}
