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
    macAddress: macAddress,
    eventName: "Test Email",
    message: testMessage,
    datetime: parsedEmail.date,
  });
};

const processRegularSamsungEmail = async (
  parsedEmail,
  senderName,
  macAddress
) => {
  const bodySections = parsedEmail.text
    .split("\n")
    .slice(
      parsedEmail.text
        .split("\n")
        .findIndex((line) => line.includes("MAC address:")) + 1
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
};

const processSamsung = async (parsedEmail) => {
  const body = parsedEmail.text;
  const macAddress = extractDataFromBody(body, /MAC address:\s*(.*)/);
  const senderInfo = parsedEmail.from.text;
  const senderName = senderInfo.match(/<([^>]*)>/)[1];
  const testMessage = "This testing E-mail";

  if (body.includes(testMessage)) {
    await processTestSamsungEmail(parsedEmail, senderName, macAddress);
  } else {
    await processRegularSamsungEmail(parsedEmail, senderName, macAddress);
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
