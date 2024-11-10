import axios from "./axios";

export const eventsHv = async () => {
  const { data } = await axios.get("/events/hv");
  return data;
};

export const eventsSamsung = async () => {
  const { data } = await axios.get("/events/samsung");
  return data;
};

export const lastEventsHv = async (limit = 5) => {
  const { data } = await axios.get(`/events/hv/last?limit=${limit}`);
  return data;
};

export const lastEventsSamsung = async (limit = 5) => {
  const { data } = await axios.get(`/events/samsung/last?limit=${limit}`);
  return data;
};

export const eventsHvDataChart = async () => {
  const { data } = await axios.get("/events/hv/event-type");
  return data;
};

export const eventsSamsungDataChart = async () => {
  const { data } = await axios.get("/events/samsung/event-type");
  return data;
};

export const distinctNameHvCount = async () => {
  const { data } = await axios.get("/events/hv/count-distinct-name");
  return data;
};

export const distinctNameSamsungCount = async () => {
  const { data } = await axios.get("/events/samsung/count-distinct-name");
  return data;
};

export const updateEventHvStatus = async (id, status) => {
  try {
    const { data } = await axios.put(`/events/hv/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Error updating event status:", error);
  }
};



export const putUpdateAddObservations = async (id, observations) => {
  try {
    const { data } = await axios.put(`/events/put/update/add/observations/${id}`, { observations });
    console.log(id,observations);
    return data;
  } catch (error) {
    console.error("Error updating event add observations:", error);
  }
};

export const eventsSuportHv = async () => {
  const { data } = await axios.get("/events/suport-hv");
  return data;
};

export const eventsSuportSamsung = async () => {
  const { data } = await axios.get("/events/suport-samsung");
  return data;
};


export const updateEventSamsungStatus = async (id, status) => {
  try {
    const { data } = await axios.put(`/events/samsung/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Error updating event status Samsung:", error);
  }
};

export const putUpdateAddObservationsSamsung = async (id, observations) => {
  try {
    const { data } = await axios.put(`/events/put/update/add/observations/samsung/${id}`, { observations });
    console.log(id,observations);
    return data;
  } catch (error) {
    console.error("Error updating event add observations samsung:", error);
  }
};
