const config = require("../../../config");
const nodemailer = require("nodemailer");

// Función para enviar correo electrónico
const sendEmail = async (recipient, subject, message) => {
  try {
    // Configura el transporte para el servidor SMTP
    let transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.SMTP_PORT,
      secure: config.EMAIL_TLS,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
    });

    // Crea el mensaje de correo electrónico
    let mailOptions = {
      from: config.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    // Utiliza el método sendMail para enviar el correo electrónico
    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email: " + error.message);
    return { success: false, message: "Error sending email" };
  }
};

module.exports = {
  sendEmail,
};