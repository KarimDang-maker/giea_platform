const notificationService = require('../services/notification.service');
const notificationRepository = require('../repositories/notification.repository');

jest.mock('../repositories/notification.repository');

describe('NotificationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification and return it', async () => {
      const mockData = {
        userId: 'user123',
        title: 'Test Title',
        message: 'Test Message'
      };

      const mockCreatedNotification = {
        id: 'notif123',
        ...mockData,
        read: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      };

      notificationRepository.create.mockResolvedValue(mockCreatedNotification);

      const result = await notificationService.createNotification(mockData);

      expect(notificationRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user123',
        title: 'Test Title',
        message: 'Test Message',
        read: false
      }));
      expect(result).toEqual(mockCreatedNotification);
    });
  });

  describe('getUserNotifications', () => {
    it('should return a list of notifications for a user', async () => {
      const userId = 'user123';
      const mockNotifications = [
        { id: '1', userId, title: 'Notif 1', message: 'Msg 1' },
        { id: '2', userId, title: 'Notif 2', message: 'Msg 2' }
      ];

      notificationRepository.findAllByUserId.mockResolvedValue(mockNotifications);

      const result = await notificationService.getUserNotifications(userId);

      expect(notificationRepository.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('getNotificationById', () => {
    it('should return a notification by its id', async () => {
      const id = 'notif123';
      const mockNotification = { id, title: 'Test' };

      notificationRepository.findById.mockResolvedValue(mockNotification);

      const result = await notificationService.getNotificationById(id);

      expect(notificationRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const id = 'notif123';
      const mockUpdatedNotification = { id, read: true };

      notificationRepository.update.mockResolvedValue(mockUpdatedNotification);

      const result = await notificationService.markAsRead(id);

      expect(notificationRepository.update).toHaveBeenCalledWith(id, { read: true });
      expect(result).toEqual(mockUpdatedNotification);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const id = 'notif123';
      notificationRepository.delete.mockResolvedValue(true);

      const result = await notificationService.deleteNotification(id);

      expect(notificationRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
