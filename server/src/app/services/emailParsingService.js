const EventSamsung = require("../models/alertCctv/EventSamsung");
const TestSamsung = require("../models/alertCctv/TestSamsung");
const { extractDataFromBody } = require("../utils/emailUtils");
const EventHv = require("../models/alertCctv/EventHv");
const SuportEventHv = require("../models/alertCctv/SuportEventHv");
const SuportEventSamsung = require("../models/alertCctv/SuportEventSamsung");
const TestHv = require("../models/alertCctv/TestHv");

// Procesar correos de Samsung
const processSamsungEmail = async (parsedEmail) => {
  const body = parsedEmail.text;
  const macAddress = extractDataFromBody(body, /MAC address:\s*(.*)/);
  const testMessage = "This testing E-mail";
  const senderInfo = parsedEmail.from.text;
  const senderName = senderInfo.match(/<([^>]*)>/)[1];

  if (body.includes(testMessage)) {
    await TestSamsung.create({
      name: senderName,
      macAddress: macAddress,
      eventName: "Test Email",
      message: testMessage,
      datetime: parsedEmail.date,
    });
  } else {
    const bodySections = body
      .split("\n")
      .slice(
        body.split("\n").findIndex((line) => line.includes("MAC address:")) + 1
      );
    let eventData = {};
    let currentEvent = null;

    bodySections.forEach((section) => {
      if (section.trim() === "") return;

      if (section.match(/^[A-Za-z ]+:/)) {
        currentEvent = section.trim();
        eventData[currentEvent] = "";
      } else if (currentEvent) {
        eventData[currentEvent] += section.trim() + " ";
      }
    });

    await EventSamsung.create({
      name: senderName,
      macAddress: macAddress,
      eventName: JSON.stringify(eventData),
      dateTime: parsedEmail.date,
    });
  }
};

// Procesar correos de HV Test
const processTestHvEmail = async (parsedEmail, senderName) => {
  const body = parsedEmail.text;
  const emailDate = parsedEmail.date;

  await TestHv.create({
    name: senderName,
    message: body,
    date: emailDate,
  });
};

// Procesar correos de HV Events
const processEventHvEmail = async (parsedEmail, senderName, attachmentData) => {
  const body = parsedEmail.text;

  await EventHv.create({
    name: senderName,
    eventType: extractDataFromBody(body, /EVENT TYPE:\s*(.*)/),
    eventTime:
      new Date(
        extractDataFromBody(body, /EVENT TIME:\s*(.*)/).replace(",", " ")
      ) || null,
    dvrName: extractDataFromBody(body, /DVR NAME:\s*(.*)/),
    dvrSerialNumber: extractDataFromBody(body, /DVR S\/N:\s*(.*)/),
    cameraName: extractDataFromBody(body, /CAMERA NAME\(NUM\):\s*(.*)/),
    attachment: attachmentData,
  });
};

// Función para convertir la fecha
const convertDateFormat = (dateString) => {
  // Divide el string de fecha en partes: día, mes y año con tiempo
  const [day, month, yearAndTime] = dateString.split('/');
  // Divide el año y tiempo
  const [year, time] = yearAndTime.split(' ');
  // Retorna la fecha en el formato 'YYYY-MM-DD HH:MM:SS'
  return `${year}-${month}-${day} ${time}`;
};

// Función para procesar el tiempo del evento
const processEventTime = (rawDate) => {
  if (rawDate) {
    return convertDateFormat(rawDate);
  } else {
    // Retorna la fecha actual en formato 'YYYY-MM-DD HH:MM:SS'
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
};


// Extraer y procesar datos



// Procesar correos de HV Events Soporte
const processSuportEventHvEmail = async (parsedEmail,  attachmentData) => {
  const body = parsedEmail.text;
  const eventTimeRaw = extractDataFromBody(body, /Fecha del Dvr:\s*(.*)/);
  const eventTime = processEventTime(eventTimeRaw);

  const idEventHv1 = extractDataFromBody(body, /Id:\s*(.*)/);

  await SuportEventHv.create({
    idEventHv: idEventHv1,
    name: extractDataFromBody(body, /Nombre:\s*(.*)/),
    eventType: extractDataFromBody(body, /Evento:\s*(.*)/),
    eventTime: eventTime,
    dvrName: extractDataFromBody(body, /DVR NAME:\s*(.*)/),
    dvrSerialNumber: extractDataFromBody(body, /DVR S\/N:\s*(.*)/),
    cameraName: extractDataFromBody(body, /Nombre de la Cámara:\s*(.*)/),
    attachment: attachmentData,
    typeDvr: extractDataFromBody(body, /Tipo:\s*(.*)/),
    status: 'completed',
  });

    // Luego, actualizar el estado en la tabla EventHv
    await EventHv.update(
      { status: 'completed' },
      { where: { id: idEventHv1, status: 'pending' } }
    );


};

// Procesar correos de Events Samsung Soporte
const processSuportSamsungEmail = async (parsedEmail, attachmentData) => {
  const body = parsedEmail.text;
  const eventTimeRaw = extractDataFromBody(body, /Fecha del Dvr:\s*(.*)/);
  const eventTime = processEventTime(eventTimeRaw);

  const idEventSamsung1 = extractDataFromBody(body, /Id:\s*(.*)/);

  await SuportEventSamsung.create({
    idEventSamsung: idEventSamsung1,
    name: extractDataFromBody(body, /Nombre:\s*(.*)/),
    macAddress: extractDataFromBody(body, /MAC address:\s*(.*)/),
    eventName: "Test Email",
    eventTime: eventTime,
    attachment: attachmentData,
    typeDvr: extractDataFromBody(body, /Tipo:\s*(.*)/),
    status: 'completed',
  });

  await EventSamsung.update(
    { status: 'completed' },
    { where: { id: idEventSamsung1, status: 'pending' } }
  );

};




module.exports = {
  processSamsungEmail,
  processTestHvEmail,
  processEventHvEmail,
  processSuportSamsungEmail,
  processSuportEventHvEmail,
};
