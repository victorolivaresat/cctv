import axios from "./axios";

export const testHv = async () => {
  const { data } = await axios.get("/tests/hv");
  return data;
}

export const testSamsung = async () => {
  const { data } = await axios.get("/tests/samsung");
  return data;
}

export const testCountHv = async () => {
  const { data } = await axios.get("/tests/hv/counts");
  return data;
}

export const testCountSamsung = async () => {
  const { data } = await axios.get("/tests/samsung/counts");
  return data;
}

export const removeDuplicateTestHv = async () => {
  const { data } = await axios.get("/tests/hv/duplicates");
  return data;
}