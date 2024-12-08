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

export const updateEventHvStatus = async (id, status, changedBy) => {

  console.log(id, status, changedBy);
  try {
    const { data } = await axios.put(`/events/hv/${id}`, { status, changedBy });
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

export const updateEventSamsungStatus = async (id, status, changedBy) => {
  try {
    const { data } = await axios.put(`/events/samsung/${id}`, { status, changedBy });
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
  const { data } = await axios.get("/events/notifications/count");
  return data;
};

export const getNewNotificationsCountByDate = async (startDate, endDate) => {
  const { data } = await axios.get("/events/notifications/by-date", {
    params: { startDate, endDate },
  });

  console.log(data);
  return data;
};

export const getEventSummaryByDateRange = async (startDate, endDate) => {
  try {
    const { data } = await axios.get("/events/summary-by-date", {
      params: { startDate, endDate },
    });
    return data;
  } catch (error) {
    console.error("Error al obtener el resumen de eventos:", error);
    throw error;
  }
};

export const getEventHistoryTimeline = async (startDate, endDate) => {
  try {
    const { data } = await axios.get("/events/timeline", {
      params: { startDate, endDate },
    });
    return data;
  } catch (error) {
    console.error("Error al obtener el historial de eventos:", error);
    throw error; 
  }
};

