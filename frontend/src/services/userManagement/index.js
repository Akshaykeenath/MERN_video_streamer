export function apiLogin(uname, pass) {
  console.log("uname :", uname, "pass :", pass);
  return "success";
}

export function apiRegister(e) {
  console.log(e.email);
}
