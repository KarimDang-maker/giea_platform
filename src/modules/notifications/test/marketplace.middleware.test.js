const marketplaceNotify = require('../middlewares/marketplace');
const notificationQueue = require('../services/queue.service');
const { NotificationType } = require('../models/notification.model');

jest.mock('../services/queue.service');
jest.mock('bullmq');

describe('Marketplace Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('companyNewsAdded', () => {
        it('should enqueue a COMPANIE_NEWS_ADD notification', async () => {
            const targets = ['user1', 'user2'];
            const newsData = { title: 'Big News' };

            await marketplaceNotify.companyNewsAdded(targets, newsData);

            expect(notificationQueue.add).toHaveBeenCalledWith(
                NotificationType.COMPANIE_NEWS_ADD,
                expect.objectContaining({
                    type: NotificationType.COMPANIE_NEWS_ADD,
                    targets: targets,
                    data: newsData
                })
            );
        });
    });

    describe('productAdded', () => {
        it('should enqueue a COMPANIE_PRODUCT_ADD notification', async () => {
            const targets = 'user1';
            const productData = { name: 'New Phone' };

            await marketplaceNotify.productAdded(targets, productData);

            expect(notificationQueue.add).toHaveBeenCalledWith(
                NotificationType.COMPANIE_PRODUCT_ADD,
                expect.objectContaining({
                    targets: [targets],
                    data: productData
                })
            );
        });
    });

    describe('serviceAdded', () => {
        it('should enqueue a COMPANIE_SERVICE_ADD notification', async () => {
            const targets = ['user1'];
            const serviceData = { name: 'Cleaning' };

            await marketplaceNotify.serviceAdded(targets, serviceData);

            expect(notificationQueue.add).toHaveBeenCalledWith(
                NotificationType.COMPANIE_SERVICE_ADD,
                expect.objectContaining({
                    targets: targets,
                    data: serviceData
                })
            );
        });
    });
});
