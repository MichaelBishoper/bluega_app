export function getToken() {
  return localStorage.getItem("token");
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
