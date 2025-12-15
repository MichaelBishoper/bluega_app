// Central API host for frontend to consume backend
export const API_URL =
  process.env.REACT_APP_API_URL || `http://localhost:${process.env.REACT_APP_PORT || 8080}`;

export default API_URL;
