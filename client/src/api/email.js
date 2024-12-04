import axios from "./axios";

export const processEmail = async (folder, startDate, endDate, brand) => {
  const { data } = await axios.post('email/process', { folder, startDate, endDate, brand });
  console.log(data);
  return data;
};