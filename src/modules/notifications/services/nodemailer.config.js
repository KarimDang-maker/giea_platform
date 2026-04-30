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

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD
    }
});

module.exports = transporter;

