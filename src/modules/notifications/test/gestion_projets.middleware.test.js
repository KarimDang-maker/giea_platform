const gestionProjetsNotify = require('../middlewares/gestion_projets');
const notificationQueue = require('../services/queue.service');
const { NotificationType } = require('../models/notification.model');

jest.mock('../services/queue.service');
jest.mock('bullmq');

describe('Gestion Projets Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('projectCreated', () => {
        it('should enqueue a PROJECT_NEW notification', async () => {
            const targets = ['admin'];
            const data = { projectName: 'Apollo' };
            await gestionProjetsNotify.projectCreated(targets, data);
            expect(notificationQueue.add).toHaveBeenCalledWith(NotificationType.PROJECT_NEW, expect.objectContaining({ targets, data }));
        });
    });

    describe('projectUpdated', () => {
        it('should enqueue a PROJECT_UPDATE notification', async () => {
            const targets = ['member1'];
            const data = { status: 'completed' };
            await gestionProjetsNotify.projectUpdated(targets, data);
            expect(notificationQueue.add).toHaveBeenCalledWith(NotificationType.PROJECT_UPDATE, expect.objectContaining({ targets, data }));
        });
    });

    describe('membersAdded', () => {
        it('should enqueue a PROJECT_MEMBERS_ADD notification', async () => {
            const targets = ['new-member'];
            const data = { addedBy: 'admin' };
            await gestionProjetsNotify.membersAdded(targets, data);
            expect(notificationQueue.add).toHaveBeenCalledWith(NotificationType.PROJECT_MEMBERS_ADD, expect.objectContaining({ targets, data }));
        });
    });

    describe('documentAdded', () => {
        it('should enqueue a PROJECT_DOCC_ADD notification', async () => {
            const targets = ['all-members'];
            const data = { docName: 'Specs.pdf' };
            await gestionProjetsNotify.documentAdded(targets, data);
            expect(notificationQueue.add).toHaveBeenCalledWith(NotificationType.PROJECT_DOCC_ADD, expect.objectContaining({ targets, data }));
        });
    });
});
