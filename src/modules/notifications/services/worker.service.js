'use strict';
const { Worker } = require('bullmq')
const redisConnection = require('./redis.config');
const { NotificationType } = require('../models/notification.model');
const notificationService = require('./notification.service');

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
    }
}, { connection: redisConnection });

worker.on('completed', (job)=>{
    console.log(`Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err)=>{
    console.log(`Job ${job.id ? job.id : 'unknown'} execution failed:`, err.message);
});

module.exports = worker;