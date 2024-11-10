const sendEmailController = require("../app/controllers/sendEmailController");
const routes = require("express").Router();

// Middlewares
const authRequired = require("../app/middleware/validateToken");

routes.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

routes.get("/api", (req, res) => {
  res.send("API");
});

// Email Send Email routes
routes.post("/send-email", authRequired, async (req, res) => {
  const { recipient, subject, message } = req.body;
  const result = await sendEmailController.sendEmail(
    recipient,
    subject,
    message
  );

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ error: result.message });
  }
});

module.exports = routes;
