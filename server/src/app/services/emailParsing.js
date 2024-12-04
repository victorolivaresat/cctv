const EventSamsung = require("../models/EventSamsung");
const TestSamsung = require("../models/TestSamsung");
const EventHv = require("../models/EventHv");
const TestHv = require("../models/TestHv");
const { extractDataFromBody } = require("../utils/emailUtils");

//======== Funciones Samsung ============//
const processTestSamsungEmail = async (parsedEmail, senderName, macAddress) => {
  const testMessage = "This testing E-mail";

  await TestSamsung.create({
    name: senderName,
    mac_address: macAddress,
    event_name: "Test Email",
    message: testMessage,
    event_time: parsedEmail.date,
  });
};

// Procesa el email de Samsung
const processRegularSamsungEmail = async (
  parsedEmail,
  senderName,
  macAddress,
  attachmentData
) => {
  const bodySections = parsedEmail.text
    .split("\n")
    .slice(
      parsedEmail.text
        .split("\n")
        .findIndex((line) => line.includes("MAC address:")) + 1
    );

  let eventData = bodySections
    .filter((section) => section.trim() !== "")
    .map((section) => section.trim())
    .join(" ");

  // Corregir "Vdieo" u otras variantes a "Video"
  eventData = eventData.replace(/\bVdieo\b/gi, "Video");

  await EventSamsung.create({
    name: senderName,
    mac_address: macAddress,
    event_name: eventData,
    event_time: parsedEmail.date,
    status: "new",
    attachment: attachmentData,
  });
};


// Procesa el email de Samsung
const processSamsung = async (
  subject,
  parsedEmail,
  notSenderName,
  attachmentData
) => {
  const body = parsedEmail.text;
  const macAddress = extractDataFromBody(body, /MAC address:\s*(.*)/);
  const senderInfo = parsedEmail.from.text;
  const senderName = senderInfo.match(/<([^>]*)>/)[1];
  const testMessage = "This testing E-mail";

  console.log("Sender Name:", senderName);

  if (body.includes(testMessage)) {
    await processTestSamsungEmail(parsedEmail, senderName, macAddress);
  } else {
    await processRegularSamsungEmail(parsedEmail, senderName, macAddress, attachmentData);
  }
};

//======== Funciones Hikvision ==========//
const processTestHikvisionEmail = async (parsedEmail, senderName) => {
  const body = parsedEmail.text;
  const eventTime = parsedEmail.date;

  await TestHv.create({
    name: senderName,
    message: body,
    event_time: eventTime,
  });
};

const processRegularHikvisionEmail = async (
  parsedEmail,
  senderName,
  attachmentData
) => {
  const body = parsedEmail.text;

  await EventHv.create({
    name: senderName,
    event_type: extractDataFromBody(body, /EVENT TYPE:\s*(.*)/),
    event_time: new Date(extractDataFromBody(body, /EVENT TIME:\s*(.*)/).replace(",", " ")) || null,
    dvr_name: extractDataFromBody(body, /DVR NAME:\s*(.*)/),
    dvr_serial_number: extractDataFromBody(body, /DVR S\/N:\s*(.*)/),
    camera_name: extractDataFromBody(body, /CAMERA NAME\(NUM\):\s*(.*)/),
    attachment: attachmentData,
  });
};

const processHikvision = async (
  subject,
  parsedEmail,
  senderName,
  attachmentData
) => {
  if (subject.includes("TEST MESSAGE FROM")) {
    await processTestHikvisionEmail(parsedEmail, senderName);
  } else {
    await processRegularHikvisionEmail(parsedEmail, senderName, attachmentData);
  }
};

module.exports = {
  processSamsung,
  processHikvision,
};
