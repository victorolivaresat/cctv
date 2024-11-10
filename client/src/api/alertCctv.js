import axios from "./axios";

export const processEmailsCctv = async () => {
  const { data } = await axios.get("/process-emails-cctv");
  return data;
}