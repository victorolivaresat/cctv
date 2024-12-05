const EventSamsung = require("../models/EventSamsung");
const { sequelize } = require("../../config/database");
const EventHv = require("../models/EventHv");
const { Op } = require("sequelize");
const moment = require("moment");

/**************************************************************************/
/********************** Eventos de Hikvision ******************************/
/**************************************************************************/

// Obtener todos los eventos de EventHv
const getEventsHv = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Faltan los parámetros 'startDate' o 'endDate'");
  }

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

// Obtener los últimos eventos de EventHv
const getLastEventsHv = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const events = await EventHv.findAll({
      limit,
      order: [["created_at", "DESC"]],
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los últimos eventos:", error);
    res.status(500).send("Error al obtener los últimos eventos");
  }
};

// Actualizar el estado de un evento de EventHv
const updateEventHvStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send("El campo 'status' es requerido");
  }

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

// Actualizar observaciones de un evento de EventHv
const updateEventHvObservations = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;

  if (!observations) {
    return res.status(400).send("El campo 'observations' es requerido");
  }

  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error("Error al actualizar observaciones:", error);
    res.status(500).send("Error al actualizar observaciones");
  }
};

// Obtener cantidad de nombres distintos en EventHv
const getDistinctNameHvCount = async (req, res) => {
  try {
    const count = await EventHv.count({
      distinct: true,
      col: "name",
    });
    return res.json(count);
  } catch (error) {
    console.error("Error al obtener cantidad de nombres distintos:", error);
    res.status(500).send("Error al obtener cantidad de nombres distintos");
  }
};

// Obtener eventos de EventHv agrupados por tipo
const getEventsHvByEventType = async (req, res) => {
  try {
    const events = await EventHv.findAll({
      attributes: [
        "name",
        [sequelize.fn("COUNT", sequelize.col("id")), "event_count"],
        "event_type",
      ],
      group: ["name", "event_type"],
      order: [[sequelize.literal("event_count"), "DESC"]],
      limit: 10,
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener eventos agrupados:", error);
    res.status(500).send("Error al obtener eventos agrupados");
  }
};

// Detalle de un evento de EventHv
const getEventHvDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    return res.json(event);
  } catch (error) {
    console.error("Error al obtener detalle del evento:", error);
    res.status(500).send("Error al obtener detalle del evento");
  }
};

// Eliminar eventos duplicados en EventHv
const removeDuplicateEventsHv = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("El parámetro 'date' es requerido");
  }

  try {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    await sequelize.query("EXEC RemoveHikvisionDuplicatesByDate :date", {
      replacements: { date: formattedDate },
    });
    return res.json({ message: "Eventos duplicados eliminados" });
  } catch (error) {
    console.error("Error al eliminar duplicados:", error);
    res.status(500).send("Error al eliminar duplicados");
  }
};


/**************************************************************************/
/*********************** Eventos de Samsung *******************************/
/**************************************************************************/

// Obtener todos los eventos de EventSamsung
const getEventsSamsung = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Faltan los parámetros 'startDate' o 'endDate'");
  }

  try {
    const events = await EventSamsung.findAll({
      where: {
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["created_at", "DESC"]],
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los eventos de Samsung:", error);
    res.status(500).send("Error al obtener los eventos de Samsung");
  }
};

// Obtener los últimos eventos de EventSamsung
const getLastEventsSamsung = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;

  try {
    const events = await EventSamsung.findAll({
      limit,
      order: [["created_at", "DESC"]],
    });
    return res.json(events);
  } catch (error) {
    console.error("Error al obtener los últimos eventos de Samsung:", error);
    res.status(500).send("Error al obtener los últimos eventos de Samsung");
  }
};

// Actualizar el estado de un evento de EventSamsung
const updateEventSamsungStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send("El campo 'status' es requerido");
  }

  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.status = status;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error("Error al actualizar el estado del evento de Samsung:", error);
    res.status(500).send("Error al actualizar el estado del evento de Samsung");
  }
};

// Actualizar observaciones de un evento de EventSamsung
const updateEventSamsungObservations = async (req, res) => {
  const { id } = req.params;
  const { observations } = req.body;

  if (!observations) {
    return res.status(400).send("El campo 'observations' es requerido");
  }

  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    event.observations = observations;
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error("Error al actualizar observaciones del evento de Samsung:", error);
    res.status(500).send("Error al actualizar observaciones del evento de Samsung");
  }
};

// Obtener cantidad de nombres distintos en EventSamsung
const getDistinctNameSamsungCount = async (req, res) => {
  try {
    const count = await EventSamsung.count({
      distinct: true,
      col: "name",
    });
    return res.json(count);
  } catch (error) {
    console.error("Error al obtener cantidad de nombres distintos en Samsung:", error);
    res.status(500).send("Error al obtener cantidad de nombres distintos en Samsung");
  }
};

// Obtener eventos de EventSamsung agrupados por tipo
const getEventsSamsungByEventType = async (req, res) => {
  try {
    // Buscar todos los eventos con los atributos necesarios
    const events = await EventSamsung.findAll({
      attributes: ["id", "name", "event_name"],
      order: [["created_at", "DESC"]],
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
      const { id, name, event_name } = event.dataValues;

      if (event_name) {
        keywords.forEach((keyword) => {
          if (event_name.includes(keyword)) {
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

// Detalle de un evento de EventSamsung
const getEventSamsungDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }
    return res.json(event);
  } catch (error) {
    console.error("Error al obtener detalle del evento de Samsung:", error);
    res.status(500).send("Error al obtener detalle del evento de Samsung");
  }
};

// Eliminar eventos duplicados en EventSamsung
const removeDuplicateEventsSamsung = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("El parámetro 'date' es requerido");
  }

  try {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    await sequelize.query("EXEC RemoveSamsungDuplicatesByDate :date", {
      replacements: { date: formattedDate },
    });
    return res.json({ message: "Eventos duplicados eliminados" });
  } catch (error) {
    console.error("Error al eliminar duplicados de Samsung:", error);
    res.status(500).send("Error al eliminar duplicados de Samsung");
  }
};


/**************************************************************************/
/*********************** Eventos Generales *******************************/
/**************************************************************************/

// Obtener cantidad de notificaciones nuevas
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

module.exports = {
  getEventsHv,
  getLastEventsHv,
  updateEventHvStatus,
  updateEventHvObservations,
  getDistinctNameHvCount,
  getEventsHvByEventType,
  getEventHvDetail,
  removeDuplicateEventsHv,
  getEventsSamsung,
  getLastEventsSamsung,
  updateEventSamsungStatus,
  updateEventSamsungObservations,
  getDistinctNameSamsungCount,
  getEventsSamsungByEventType,
  getEventSamsungDetail,
  removeDuplicateEventsSamsung,
  getNewNotificationsCount,
};