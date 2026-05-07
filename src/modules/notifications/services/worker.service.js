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
            console.log('[Worker] Handling PLATFORM_EVENT_CREATED for event:', event.data.title);
            const allUsers = await userRepository.findAll();
            console.log(`[Worker] Found ${allUsers.length} users to notify`);
            
            const creatorId = event.data.creatorId;
            const creatorName = event.data.creatorName;
            const eventTitle = event.data.title;

            for (const user of allUsers) {
                console.log(`[Worker] Notifying user: ${user.email} (${user.role})`);
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
                try {
                    const notificationData = {
                        userId: user.email,
                        title: inAppTitle,
                        message: inAppMessage
                    };
                    console.log(`[Worker] Attempting to create in-app notification for ${user.email}`);
                    await notificationService.createNotification(notificationData);
                    console.log(`[Worker] In-app notification created for ${user.email}`);
                } catch (error) {
                    console.error(`[Worker] Failed to create in-app notification for ${user.email}:`, error.message);
                }

                // 2. Send email notification
                try {
                    if (user.preferences && user.preferences.emailNotifications !== false) {
                        console.log(`[Worker] Attempting to send email to ${user.email}`);
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
                        console.log(`[Worker] Email sent to ${user.email}`);
                    }
                } catch (error) {
                    console.error(`[Worker] Failed to send email to ${user.email}:`, error.message);
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