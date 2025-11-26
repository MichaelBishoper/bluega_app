export function getToken() { //to check if user is logged in
  return sessionStorage.getItem("token");
}
export function logout() { //call this to log out user
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
}
