

import axios from "axios";
const API_KEY = process.env.REACT_APP_TODO_API_KEY
//const API_KEY = import.meta.env.REACT_APP_TODO_API_KEY

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    'API-KEY': API_KEY,
    "Content-Type": "application/json",
  },
})
instance.interceptors.request.use(function (config) {
  config.headers["Authorization"] = "Bearer " + localStorage.getItem("sn-token");

  return config;
});