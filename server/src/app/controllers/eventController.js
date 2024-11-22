const EventSamsung = require("../models/alertCctv/EventSamsung");
const EventHv = require("../models/alertCctv/EventHv");
const sequelize = require("../../config/database");
const SuportEventSamsung = require("../models/alertCctv/SuportEventSamsung");
const SuportEventHv = require("../models/alertCctv/SuportEventHv");

//const transporter = require("../../../config/mailConfig");

// Funcion para obtener todos los eventos de EventHv
const getEventsHv = async (req, res) => {
  try {
    const events = await EventHv.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).send("Error al obtener los eventos");
  }
};

// Funcion para obtener todos los eventos de EventSamsung
const getEventsSamsung = async (req, res) => {
  try {
    const events = await EventSamsung.findAll();
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).send("Error al obtener los eventos");
  }
};

// Funcion para obtener los últimos eventos de EventHv
const getLastEventsHv = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const events = await EventHv.findAll({
      limit: limit,
      order: [["createdAt", "DESC"]],
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los últimos eventos de EventHv:", error);
    res.status(500).send("Error al obtener los últimos eventos");
  }
};

// Funcion para obtener los últimos eventos de EventSamsung
const getLastEventsSamsung = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  try {
    const events = await EventSamsung.findAll({
      limit: limit,
      order: [["createdAt", "DESC"]],
    });
    return res.json(events);
  } catch (error) {
    console.error(
      "Error al obtener los últimos eventos de EventSamsung:",
      error
    );
    res.status(500).send("Error al obtener los últimos eventos");
  }
};

// Funcion para actualizar el estado de un evento de EventSamsung
const updateEventSamsungStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.status = status;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar el estado del evento de EventSamsung:",
      error
    );
    res.status(500).send("Error al actualizar el estado del evento");
  }
};

// Funcion para actualizar las observaciones de un evento de EventSamsung
const updateEventSamsungObservations = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;
  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar las observaciones del evento de EventSamsung:",
      error
    );
    res.status(500).send("Error al actualizar las observaciones del evento");
  }
};

// Funcion para actualizar el estado de un evento de EventHv
const updateEventHvStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.status = status;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar el estado del evento de EventHv:",
      error
    );
    res.status(500).send("Error al actualizar el estado del evento");
  }
};

// Funcion para actualizar las observaciones de un evento de EventHv
const updateEventHvObservations = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;
  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar las observaciones del evento de EventHv:",
      error
    );
    res.status(500).send("Error al actualizar las observaciones del evento");
  }
};

// Funcion para obtener los eventos de EventHv agrupados por tipo de evento
const getEventsHvByEventType = async (req, res) => {
  try {
    const events = await EventHv.findAll({
      attributes: ["name", [sequelize.fn("SUM", 1), "eventCount"], "eventType"],
      group: ["name", "eventType"],
      order: [[sequelize.literal("eventCount"), "DESC"]],
      limit: 20,
    });

    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos de Hikvision:", error);
    res.status(500).send("Error al obtener los eventos de Hikvision");
  }
};

// Funcion para obtener los eventos de EventHv agrupados por tipo de evento
const getEventsSamsungByEventType = async (req, res) => {
  try {
    const events = await EventSamsung.findAll({
      attributes: ["id", "name", "eventName"],
    });

    let groupedEvents = {};

    events.forEach(event => {
      const eventName = JSON.parse(event.eventName);
      const eventTypes = Object.keys(eventName);
      
      eventTypes.forEach(eventType => {
        const key = `${event.name}-${eventType}`;

        if (groupedEvents[key]) {
          groupedEvents[key].eventCount += 1;
        } else {
          groupedEvents[key] = {
            id: event.id,
            name: event.name,
            eventType,
            eventCount: 1,
          };
        }
      });
    });

    const processedEvents = Object.values(groupedEvents);

    processedEvents.sort((a, b) => b.eventCount - a.eventCount);

    return res.json(processedEvents.slice(0, 20));
  } catch (error) {
    console.error("Error al obtener los eventos de Samsung:", error);
    res.status(500).send("Error al obtener los eventos de Samsung");
  }
};

// Funcion para obtener la cantidad de nombres distintos en EventSamsung
const getDistinctNameSamsungCount = async (req, res) => {
  try {
    const count = await EventSamsung.count({
      distinct: true,
      col: 'name'
    });

    return res.json(count);
  } catch (error) {
    console.error("Error al obtener la cantidad de nombres distintos:", error);
    res.status(500).send("Error al obtener la cantidad de nombres distintos");
  }
};

// Funcion para actualizar la observacion de un evento de EventHv
const putUpdateAddObservations = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;
  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar la observacion del evento de Validacion:",
      error
    );
    res.status(500).send("Error al actualizar la observacion de Validacion");
  }
};

// Funcion para obtener todos los eventos de SuportEventHv
const getSuportEventsHv = async (req, res) => {
  try {
    const events = await SuportEventHv.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos de SuportEventHv:", error);
    res.status(500).send("Error al obtener los eventos de SuportEventHv");
  }
};

// Funcion para obtener todos los eventos de SuportEventSamsung
const getSuportEventsSamsung = async (req, res) => {
  try {
    const events = await SuportEventSamsung.findAll();
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos de SuportEventSamsung:", error);
    res.status(500).send("Error al obtener los eventos de SuportEventSamsung");
  }
};

// Funcion para actualizar la observacion de un evento de EventSamsung
const putUpdateAddObservationsSamsung = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;
  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar la observacion del evento de Validacion Samsung:",
      error
    );
    res.status(500).send("Error al actualizar la observacion de Validacion Samsung");
  }
};






module.exports = {
  getEventsHv,
  getEventsSamsung,
  getLastEventsHv,
  getLastEventsSamsung,
  updateEventSamsungStatus,
  updateEventSamsungObservations,
  updateEventHvStatus,
  updateEventHvObservations,
  getEventsHvByEventType,
  getEventsSamsungByEventType,
  getDistinctNameSamsungCount,
  putUpdateAddObservations,
  getSuportEventsHv,
  getSuportEventsSamsung,
  putUpdateAddObservationsSamsung,
};

