const nodemailer = require("nodemailer");
require("dotenv").config();

// Función para enviar correo electrónico
const sendEmail = async (recipient, subject, message) => {
  try {
    // Configura el transporte para el servidor SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.SMTP_PORT, // Utilice puerto 465 para SSL y puerto 587 para TLS
      secure: true, // Utilice SSL (true) o TLS (false)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Crea el mensaje de correo electrónico
    let mailOptions = {
      from: process.env.EMAIL_USER,
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
