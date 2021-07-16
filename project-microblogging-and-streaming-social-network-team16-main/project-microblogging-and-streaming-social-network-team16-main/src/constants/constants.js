export const APP_VERSION = "1.0";

export const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://abe-557.herokuapp.com"
    : "http://localhost:3001";
