const transporter = require('./nodemailer.config');
const { NotificationType } = require('../models/notification.model');

class EmailService {
    /**
     * Envoie un email.
     * En fonction de la catégorie, détermine si l'on doit reformater l'email en HTML.
     * 
     * @param {string} to - L'adresse email du destinataire
     * @param {object} notification - L'objet contenant les détails (type, category, title, message, data)
     */
    async sendNotificationEmail(to, notification) {
        try {
            let subject = notification.title || "Nouvelle notification";
            let htmlContent = notification.message;

            // Si la catégorie est spécifiquement 'email', on reformate le message sous format HTML
            // en utilisant le switch case selon le type de l'événement.
            if (notification.category === 'email') {
                switch (notification.type) {
                    case NotificationType.COMPLETE_PROFILE:
                        subject = 'Complétez votre profil GIEA';
                        htmlContent = `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                                <h2 style="color: #333;">Bienvenue !</h2>
                                <p style="color: #555;">${notification.message}</p>
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/profile" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;">Compléter mon profil</a>
                                </div>
                            </div>
                        `;
                        break;

                    case NotificationType.COMPANIE_NEWS_ADD:
                    case NotificationType.COMPANIE_PRODUCT_ADD:
                    case NotificationType.COMPANIE_SERVICE_ADD:
                        subject = notification.title || 'Actualité entreprise';
                        htmlContent = `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                                <h2 style="color: #007bff;">${subject}</h2>
                                <p style="color: #555; line-height: 1.5;">${notification.message}</p>
                            </div>
                        `;
                        break;
                        
                    case NotificationType.PROJECT_NEW:
                    case NotificationType.PROJECT_UPDATE:
                        subject = notification.title || 'Mise à jour projet';
                        htmlContent = `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                                <h2 style="color: #28a745;">${subject}</h2>
                                <p style="color: #555; line-height: 1.5;">${notification.message}</p>
                            </div>
                        `;
                        break;

                    default:
                        // Format générique pour les catégories 'email' sans type spécifique défini
                        htmlContent = `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <h2>${subject}</h2>
                                <p>${notification.message}</p>
                            </div>
                        `;
                        break;
                }
            }

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.NODE_MAILER_EMAIL || '"GIEA Platform" <noreply@giea.com>',
                to: to,
                subject: subject,
                html: htmlContent, // Soit le HTML généré par le switch, soit le message envoyé tel quel
            };

            const info = await transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email de notification à ${to}:`, error);
            throw error;
        }
    }
}

module.exports = new EmailService();
