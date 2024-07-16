import axios from "axios";

export const backend = axios.create({
  baseURL: "http://192.168.100.153:9999",
});

