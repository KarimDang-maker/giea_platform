'use strict';
const { Worker } = require('bullmq')
const redisConnection = require('./redis.config');
const { NotificationType } = require('../models/notification.model');
const notificationService = require('./notification.service');
const userRepository = require('../../authentication/repositories/user.repository');
const emailService = require('./email.service');

/**
 * @param {import('bullmq').Job<import('../models/notification.model').NotificationEvent>} job
 */
const worker = new Worker('notificationQueue', async (job) => {
    const event = job.data;
    console.log(`Processing job ${job.id} of type ${event.type}`);

    switch(event.type){
        case NotificationType.COMPLETE_PROFILE:
            if (event.targets && Array.isArray(event.targets)) {
                for (const targetId of event.targets) {
                    const name = event.data.firstName ? ` ${event.data.firstName}` : '';
                    const date = event.data.date ? new Date(event.data.date).toLocaleDateString('fr-FR') : '';
                    
                    const notificationData = {
                        userId: targetId,
                        title: "Complete your profile",
                        message: `welcome ${name} ! Please complete your profile. (Sent on: ${date})`
                    };
                    await notificationService.createNotification(notificationData);
                }
            }
            break;

        case NotificationType.PLATFORM_EVENT_CREATED:
            const allUsers = await userRepository.findAll();
            const creatorId = event.data.creatorId;
            const creatorName = event.data.creatorName;
            const eventTitle = event.data.title;

            for (const user of allUsers) {
                let inAppTitle = `Nouvel événement : ${eventTitle}`;
                let inAppMessage = `Bonjour ${user.firstName} ${user.lastName}, un nouvel événement a été publié : ${eventTitle}.`;
                let emailSubject = `Invitation : ${eventTitle}`;
                let emailIntro = `Cher/Chère <strong>${user.firstName} ${user.lastName}</strong>,<br><br>En votre qualité de <strong>${user.role}</strong> au sein de notre plateforme, nous avons l'honneur de vous convier à un nouvel événement majeur :`;
                let isCreator = user.email === creatorId;
                let isAdmin = user.role === 'admin';

                if (isCreator) {
                    inAppTitle = `Succès : Événement créé`;
                    inAppMessage = `Votre événement "${eventTitle}" a été créé avec succès. Vous pouvez commencer à gérer les inscriptions.`;
                    emailSubject = `Votre événement "${eventTitle}" est en ligne`;
                    emailIntro = `Félicitations ${user.firstName}, votre événement a été créé avec succès. Vous pouvez maintenant commencer à gérer les inscriptions.`;
                } else if (isAdmin) {
                    inAppTitle = `Nouveau contenu (Admin)`;
                    inAppMessage = `Un nouvel événement "${eventTitle}" a été ajouté par ${creatorName}.`;
                    emailSubject = `[Admin] Nouvel événement ajouté par ${creatorName}`;
                    emailIntro = `Bonjour ${user.firstName}, nous vous informons qu'un nouvel événement "${eventTitle}" a été ajouté par ${creatorName}.`;
                }

                // 1. Create in-app notification
                const notificationData = {
                    userId: user.email,
                    title: inAppTitle,
                    message: inAppMessage
                };
                await notificationService.createNotification(notificationData);

                // 2. Send email notification
                if (user.preferences && user.preferences.emailNotifications !== false) {
                    await emailService.sendNotificationEmail(user.email, {
                        type: event.type,
                        category: 'email',
                        title: emailSubject,
                        message: emailIntro,
                        data: {
                            ...event.data,
                            user: {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role
                            }
                        }
                    });
                }
            }
            break;
    }
}, { connection: redisConnection });

worker.on('completed', (job)=>{
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err)=>{
    console.log(`Job ${job.id ? job.id : 'unknown'} execution failed:`, err.message);
});

module.exports = worker;