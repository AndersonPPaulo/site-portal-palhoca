import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.portalpalhoca.com.br/",
});

export const api_cep = axios.create({
  baseURL: process.env.API_CEP_URL,
});
