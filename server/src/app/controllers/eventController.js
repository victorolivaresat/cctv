const EventSamsung = require("../models/EventSamsung");
const EventHv = require("../models/EventHv");
const { sequelize } = require("../../config/database");
const { format } = require("../utils/dateUtils");
const { Op } = require("sequelize");

//const transporter = require("../../../config/mailConfig");

// Funcion para obtener todos los eventos de EventHv
const getEventsHv = async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log(startDate, endDate);
  try {
    const events = await EventHv.findAll({
      where: {
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["created_at", "DESC"]],
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
    console.error("Error al actualizar el estado del evento:", error);
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
      attributes: [
        "name",
        [sequelize.fn("SUM", 1), "event_count"],
        "event_type",
      ],
      group: ["name", "event_type"],
      order: [[sequelize.literal("event_count"), "DESC"]],
      limit: 10,
    });

    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos de Hikvision:", error);
    res.status(500).send("Error al obtener los eventos de Hikvision");
  }
};

// Función para obtener eventos de EventSamsung agrupados por tipo de evento
const getEventsSamsungByEventType = async (req, res) => {
  try {
    // Buscar todos los eventos con los atributos necesarios
    const events = await EventSamsung.findAll({
      attributes: ["id", "name", "eventName"],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const keywords = [
      "No Space on Disk",
      "Disk Error",
      "Video Loss",
      "Motion detection",
      "testing",
    ];

    let groupedEvents = {};

    events.forEach((event) => {
      const { id, name, eventName } = event.dataValues;

      if (eventName) {
        keywords.forEach((keyword) => {
          if (eventName.includes(keyword)) {
            const key = `${name}-${keyword}`;

            if (groupedEvents[key]) {
              groupedEvents[key].event_count += 1;
            } else {
              groupedEvents[key] = {
                id,
                name,
                event_type: keyword,
                event_count: 1,
              };
            }
          }
        });
      }
    });

    // Convertir los resultados agrupados en un arreglo y ordenarlos por la cantidad de eventos
    const processedEvents = Object.values(groupedEvents).sort(
      (a, b) => b.event_count - a.event_count
    );

    // Retornar los 20 eventos principales como respuesta
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
      col: "name",
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
      order: [["createdAt", "DESC"]],
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
const updateAddObservationsSamsung = async (req, res) => {
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
    res
      .status(500)
      .send("Error al actualizar la observacion de Validacion Samsung");
  }
};

const getNewNotificationsCount = async (req, res) => {
  try {
    const samsungCount = await EventSamsung.count({
      where: { status: "new" },
    });

    const hvCount = await EventHv.count({
      where: { status: "new" },
    });

    const notifications = {
      samsung: samsungCount,
      hv: hvCount,
    };

    return res.json(notifications);
  } catch (error) {
    console.error("Error al obtener las notificaciones nuevas:", error);
    res.status(500).send("Error al obtener las notificaciones nuevas");
  }
};

const getEventHvDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    return res.json(event);
  } catch (error) {
    console.error("Error al obtener el detalle del evento de EventHv:", error);
    res.status(500).send("Error al obtener el detalle del evento");
  }
};

const getEventSamsungDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    return res.json(event);
  } catch (error) {
    console.error(
      "Error al obtener el detalle del evento de EventSamsung:",
      error
    );
    res.status(500).send("Error al obtener el detalle del evento");
  }
};

const deleteDuplicateEventsHv = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const start = format(startDate);
    const end = format(endDate);

    await sequelize.query("EXEC DeleteDuplicateEventsHv :startDate, :endDate", {
      replacements: { startDate: start, endDate: end },
    });

    return res.json({ message: "Eventos duplicados eliminados" });
  } catch (error) {
    console.error("Error al eliminar eventos duplicados:", error);
    res.status(500).send("Error al eliminar eventos duplicados");
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
  updateAddObservationsSamsung,
  getNewNotificationsCount,
  getEventHvDetail,
  getEventSamsungDetail,
  deleteDuplicateEventsHv,
};
