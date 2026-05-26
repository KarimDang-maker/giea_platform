const nodemailer = require("nodemailer");


/*const transporter = nodemailer.createTransport({
  host: "://votre-domaine.com",
  port: 465,
  secure: true, // Utilisation de SSL/TLS
  auth: {
    user: "contact@votre-domaine.com",
    pass: "votre_mot_de_passe",
  },
  // Optionnel : forcer l'envoi même si le certificat SSL est auto-signé
  tls: {
    rejectUnauthorized: false
  }
});
*/


const emailMode = process.env.NODE_MAILER_MODE;


let transporter;

emailMode == "service" ? transporter = nodemailer.createTransport({
  service:process.env.EMAIL_SERVICE,
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASSWORD
  }
}) : transporter = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST,
  port: process.env.NODE_MAILER_PORT,
  secure: parseInt(process.env.NODE_MAILER_PORT) == 465 ? true : false,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports = transporter;

