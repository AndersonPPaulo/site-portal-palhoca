import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});


export const api_cep = axios.create({
  baseURL: process.env.API_CEP_URL, 
});
