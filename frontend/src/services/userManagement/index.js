import axios from "axios";
import myaxios from "config/axios";
import { FirebaseDelete } from "functions/firebaseManagement/delete";
import { FirebaseUpload } from "functions/firebaseManagement/uploads";
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

export async function apiLogin(uname, pass, rememberMe) {
  const data = {
    uname: uname,
    pass: pass,
    rememberMe: rememberMe,
  };
  try {
    const response = await myaxios.post(`${url}/auth/login`, data);
    localStorage.setItem("currentUserJWT", response.data.token);
    return response;
  } catch (error) {
    return error.response;
  }
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
  // localStorage.removeItem("currentUserJWT");
  localStorage.clear();
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

export const apiCheckUname = async (uname) => {
  try {
    const response = await myaxios.post("/auth/check/uname", { uname: uname });

    if (response.status === 200) {
      return { status: "success", message: response.data.message, uname: response.data.uname };
    } else {
      return { status: "error", message: response.data.message };
    }
  } catch (error) {
    return { status: "error", message: error.response.data.message };
  }
};

export const apiUpdateUser = async (data) => {
  const picPath = "/files/channel/high/";
  let picRes;
  try {
    if (data.image) {
      const file = data.image;
      delete data.image;
      if (data.firebaseUrl) {
        FirebaseDelete(data.firebaseUrl);
      }
      picRes = await FirebaseUpload(file, picPath);
      const channel = {
        img: [
          {
            size: "high",
            url: picRes.message,
            firebaseUrl: picRes.storagePath,
          },
        ],
      };
      data.channel = channel;
    }
    const response = await myaxios.post("/private/profile/update", data);
    if (response.status === 200) {
      return { status: "success", message: response.data.message };
    } else {
      if (picRes) {
        FirebaseDelete(picRes.storagePath);
      }
      return { status: "error", message: response.data.message };
    }
  } catch (err) {
    if (picRes) {
      FirebaseDelete(picRes.storagePath);
    }
    console.log(err);
    return { status: "error", message: err };
  }
};
