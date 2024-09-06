import axios, { AxiosResponse, AxiosError } from "axios";
const BASE_URL =
  "https://crypto-market-analysis-tool-f12d66bb7184.herokuapp.com/";
//const BASE_URL = "http://localhost:3001/";

// Generic GET function
async function get<T>(url: string, params?: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BASE_URL}${url}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
}

// Generic POST function
async function post<T>(url: string, data: any, params?: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.post(
      `${BASE_URL}${url}`,
      data,
      { params }
    );
    return response.data;
  } catch (error) {
    throw new Error((error as AxiosError).message);
  }
}

export { get, post };
