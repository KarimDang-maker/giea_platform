const authenticationNotify = require('../middlewares/authentication');
const notificationQueue = require('../services/queue.service');
const userRepository = require('../../authentication/repositories/user.repository');
const { NotificationType } = require('../models/notification.model');

jest.mock('../services/queue.service');
jest.mock('../../authentication/repositories/user.repository');
jest.mock('bullmq');

describe('Authentication Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('completeProfile', () => {
        it('should enqueue a COMPLETE_PROFILE notification with user data', async () => {
            const userId = 'user@example.com';
            const mockUser = {
                firstName: 'John',
                lastName: 'Doe',
                email: userId
            };
            userRepository.findById.mockResolvedValue(mockUser);

            await authenticationNotify.completeProfile(userId);

            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(notificationQueue.add).toHaveBeenCalledWith(
                NotificationType.COMPLETE_PROFILE,
                expect.objectContaining({
                    type: NotificationType.COMPLETE_PROFILE,
                    targets: [userId],
                    data: expect.objectContaining({
                        firstName: 'John',
                        lastName: 'Doe',
                        email: userId
                    })
                })
            );
        });

        it('should enqueue a COMPLETE_PROFILE notification even if user not found', async () => {
            const userId = 'unknown@example.com';
            userRepository.findById.mockResolvedValue(null);

            await authenticationNotify.completeProfile(userId);

            expect(notificationQueue.add).toHaveBeenCalledWith(
                NotificationType.COMPLETE_PROFILE,
                expect.objectContaining({
                    targets: [userId],
                    data: expect.objectContaining({
                        date: expect.any(String)
                    })
                })
            );
        });

        it('should log error if queueing fails', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            userRepository.findById.mockRejectedValue(new Error('DB Error'));

            await authenticationNotify.completeProfile('123');

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });
});
