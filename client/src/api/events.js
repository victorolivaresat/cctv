import axios from "./axios";

/**
 * Funciones relacionadas con Hikvision (HV)
 */
export const eventsHv = async (startDate, endDate) => {
  const { data } = await axios.get("/events/hv", {
    params: { startDate, endDate },
  });
  return data;
};

export const lastEventsHv = async (limit = 5) => {
  const { data } = await axios.get(`/events/hv/last?limit=${limit}`);
  return data;
};

export const eventsHvDataChart = async () => {
  const { data } = await axios.get("/events/hv/event-type");
  return data;
};

export const distinctNameHvCount = async () => {
  const { data } = await axios.get("/events/hv/count-distinct-name"); // Corregido
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

export const updateAddObservations = async (id, observations) => {
  try {
    const { data } = await axios.put(`/events/hv/observations/${id}`, {
      observations,
    });
    console.log(id, observations);
    return data;
  } catch (error) {
    console.error("Error updating event add observations:", error);
  }
};

export const removeDuplicateEventsHv = async (date) => {
  try {
    const { data } = await axios.delete(`/events/hv/remove-duplicates`, {
      params: { date },
    });
    return data;
  } catch (error) {
    console.error("Error deleting duplicate events for Hikvision:", error);
  }
};

/**
 * Funciones relacionadas con Samsung
 */
export const eventsSamsung = async (startDate, endDate) => {
  const { data } = await axios.get("/events/samsung", {
    params: { startDate, endDate },
  });
  return data;
};

export const lastEventsSamsung = async (limit = 5) => {
  const { data } = await axios.get(`/events/samsung/last?limit=${limit}`);
  return data;
};

export const eventsSamsungDataChart = async () => {
  const { data } = await axios.get("/events/samsung/event-type");
  return data;
};

export const distinctNameSamsungCount = async () => {
  const { data } = await axios.get("/events/samsung/count-distinct-name"); // Corregido
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

export const updateAddObservationsSamsung = async (id, observations) => {
  try {
    const { data } = await axios.put(`/events/samsung/observations/${id}`, {
      observations,
    });
    console.log(id, observations);
    return data;
  } catch (error) {
    console.error("Error updating event add observations samsung:", error);
  }
};

export const removeDuplicateEventsSamsung = async (date) => {
  try {
    const { data } = await axios.delete(`/events/samsung/remove-duplicates`, {
      params: { date },
    });
    return data;
  } catch (error) {
    console.error("Error deleting duplicate events for Samsung:", error);
  }
};

/**
 * Funciones generales
 */
export const getNewNotificationsCount = async () => {
  const { data } = await axios.get("/events/notifications");
  return data;
};
