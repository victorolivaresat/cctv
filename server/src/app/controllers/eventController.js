const EventSamsung = require("../models/EventSamsung");
const { sequelize } = require("../../config/database");
const EventHistory = require("../models/EventHistory");
const EventHv = require("../models/EventHv");
const { Op } = require("sequelize");
const moment = require("moment");
const path = require("path");
const fs = require("fs");

/**************************************************************************/
/********************** Eventos de Hikvision ******************************/
/**************************************************************************/

// Obtener todos los eventos de EventHv
const getEventsHv = async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log("startDate", startDate);

  if (!startDate || !endDate) {
    return res
      .status(400)
      .send("Faltan los parámetros 'startDate' o 'endDate'");
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
  const { status, changedBy } = req.body;

  console.log(status, changedBy);

  if (!status || !changedBy) {
    return res
      .status(400)
      .send("El campo 'status' y 'changedBy' son requeridos");
  }

  try {
    const event = await EventHv.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }

    const previousStatus = event.status;

    event.status = status;
    await event.save();

    // Crear un historial de evento
    await EventHistory.create({
      model: "EventHv",
      user_id: changedBy,
      action: "Status Updated",
      details: JSON.stringify({
        previousStatus: previousStatus,
        newStatus: status,
        name: event.name,
        eventType: event.event_type,
        eventTime: event.event_time,
        createdAt: event.created_at,
      }),
    });

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
    const [results]  = await sequelize.query("EXEC RemoveHikvisionDuplicatesByDate :date", {
      replacements: { date: formattedDate },
    });

    deleteAttachments(results);

    return res.json({ message: "Eventos duplicados eliminados" });
  } catch (error) {
    console.error("Error al eliminar duplicados:", error);
    res.status(500).send("Error al eliminar duplicados");
  }
};

const deleteAttachments = (attachments) => {
  const attachmentsPath = path.join(__dirname, "../src/assets/attachments");

  attachments.forEach((attachment) => {
    const filePath = path.join(attachmentsPath, attachment.filename);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo ${attachment.filename}:`, err);
        } else {
          console.log(`Archivo ${attachment.filename} eliminado exitosamente.`);
        }
      });
    } else {
      console.log(`El archivo ${attachment.filename} no existe.`);
    }
  });
};

/**************************************************************************/
/*********************** Eventos de Samsung *******************************/
/**************************************************************************/

// Obtener todos los eventos de EventSamsung
const getEventsSamsung = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .send("Faltan los parámetros 'startDate' o 'endDate'");
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
  const { status, changedBy } = req.body;

  if (!status || !changedBy) {
    return res
      .status(400)
      .send("El campo 'status' y 'changedBy' son requeridos");
  }

  try {
    const event = await EventSamsung.findByPk(id);
    if (!event) {
      return res.status(404).send("Evento no encontrado");
    }

    const previousStatus = event.status;

    event.status = status;
    await event.save();

    let eventName = event.event_name;
    console.log("event_name:", eventName);

    const colonIndex = eventName.indexOf(':');
    if (colonIndex !== -1) {
      eventName = eventName.substring(0, colonIndex);
      console.log("Nombre del evento extraído:", eventName);
    } else {
      console.log("No se encontró ':' en event_name, manteniendo el valor completo");
    }

    await EventHistory.create({
      model: "EventSamsung",
      user_id: changedBy,
      action: "Status Updated",
      details: JSON.stringify({
        previousStatus: previousStatus,
        newStatus: status,
        name: event.name,
        eventType: eventName,
        eventTime: event.event_time,
        createdAt: event.created_at,
      }),
    });

    return res.json(event);
  } catch (error) {
    console.error(
      "Error al actualizar el estado del evento de Samsung:",
      error
    );
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
    console.error(
      "Error al actualizar observaciones del evento de Samsung:",
      error
    );
    res
      .status(500)
      .send("Error al actualizar observaciones del evento de Samsung");
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
    console.error(
      "Error al obtener cantidad de nombres distintos en Samsung:",
      error
    );
    res
      .status(500)
      .send("Error al obtener cantidad de nombres distintos en Samsung");
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

  
    let groupedEvents = {};

    events.forEach((event) => {
      const { id, name, event_name } = event.dataValues;

      if (event_name) {
        let eventType = event_name;
        const colonIndex = eventType.indexOf(':');
        if (colonIndex !== -1) {
          eventType = eventType.substring(0, colonIndex);
        }

        const key = `${name}-${eventType}`;

        if (groupedEvents[key]) {
          groupedEvents[key].event_count += 1;
        } else {
          groupedEvents[key] = {
            id,
            name,
            event_type: eventType,
            event_count: 1,
          };
        }
      }
    });

    const processedEvents = Object.values(groupedEvents).sort(
      (a, b) => b.event_count - a.event_count
    );

    return res.json(processedEvents);
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

const getNewNotificationsCountByDate = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Los campos 'startDate' y 'endDate' son requeridos");
  }

  try {
    const samsungNewCount = await EventSamsung.count({
      where: {
        status: "new",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const hvNewCount = await EventHv.count({
      where: {
        status: "new",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const samsungCompletedCount = await EventSamsung.count({
      where: {
        status: "completed",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const hvCompletedCount = await EventHv.count({
      where: {
        status: "completed",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const samsungPendingCount = await EventSamsung.count({
      where: {
        status: "pending",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const hvPendingCount = await EventHv.count({
      where: {
        status: "pending",
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    const notifications = {
      samsung: {
        new: samsungNewCount,
        completed: samsungCompletedCount,
        pending: samsungPendingCount,
        total: samsungNewCount + samsungCompletedCount + samsungPendingCount,
      },
      hv: {
        new: hvNewCount,
        completed: hvCompletedCount,
        pending: hvPendingCount,
        total: hvNewCount + hvCompletedCount + hvPendingCount,
      },
    };

    return res.json(notifications);
  } catch (error) {
    console.error("Error al obtener las notificaciones nuevas:", error);
    res.status(500).send("Error al obtener las notificaciones nuevas");
  }
};

const getEventSummaryByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .send("Faltan los parámetros 'startDate' o 'endDate'");
  }

  try {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");

    const [eventsSummary] = await sequelize.query(
      "EXEC GetEventSummaryByDateRange :startDate, :endDate",
      {
        replacements: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      }
    );

    if (!eventsSummary || eventsSummary.length === 0) {
      return res
        .status(404)
        .send("No se encontraron eventos en el rango de fechas proporcionado");
    }

    return res.json(eventsSummary);
  } catch (error) {
    console.error("Error al obtener el resumen de eventos:", error);
    res.status(500).send("Error al obtener el resumen de eventos");
  }
};

const getEventHistoryTimeline = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send("Faltan los parámetros 'startDate' o 'endDate'");
  }

  const formattedStartDate = moment(startDate).format("YYYY-MM-DD HH:mm:ss");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD HH:mm:ss");

  try {
    const eventHistory = await EventHistory.findAll({
      where: {
        created_at: {
          [Op.between]: [formattedStartDate, formattedEndDate],
        },
      },
      order: [["created_at", "DESC"]],
      limit: 100,
    });

    if (eventHistory.length === 0) {
      return res.status(404).send("No se encontraron eventos en el rango de fechas proporcionado");
    }

    return res.json(eventHistory);
  } catch (error) {
    console.error("Error al obtener el historial de eventos:", error);
    res.status(500).send("Error al obtener el historial de eventos");
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
  getNewNotificationsCountByDate,
  getEventSummaryByDateRange,
  getEventHistoryTimeline,
};
