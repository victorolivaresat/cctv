import axios from "./axios";

export const processEmail = async (folder, date) => {
  const { data } = await axios.get('email/process', { params: { folder, date } });
  console.log(data);
  return data;
};
