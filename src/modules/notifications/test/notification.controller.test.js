const notificationController = require('../controllers/notification.controller');
const notificationService = require('../services/notification.service');

jest.mock('../services/notification.service');

describe('NotificationController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification and return 201', async () => {
      const mockNotif = { id: '1', title: 'Test' };
      req.body = { title: 'Test' };
      notificationService.createNotification.mockResolvedValue(mockNotif);

      await notificationController.createNotification(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockNotif
      });
    });

    it('should call next with error if service fails', async () => {
      const error = new Error('Failed');
      notificationService.createNotification.mockRejectedValue(error);

      await notificationController.createNotification(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserNotifications', () => {
    it('should return 200 and user notifications', async () => {
      const notifications = [{ id: '1' }];
      req.params.userId = 'user123';
      notificationService.getUserNotifications.mockResolvedValue(notifications);

      await notificationController.getUserNotifications(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: notifications
      });
    });
  });

  describe('getNotificationById', () => {
    it('should return 200 if notification found', async () => {
      const notification = { id: '1' };
      req.params.id = '1';
      notificationService.getNotificationById.mockResolvedValue(notification);

      await notificationController.getNotificationById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: notification
      });
    });

    it('should return 404 if notification not found', async () => {
      req.params.id = 'invalid';
      notificationService.getNotificationById.mockResolvedValue(null);

      await notificationController.getNotificationById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Notification not found'
      });
    });
  });

  describe('markAsRead', () => {
    it('should return 200 and updated notification', async () => {
      const notification = { id: '1', read: true };
      req.params.id = '1';
      notificationService.markAsRead.mockResolvedValue(notification);

      await notificationController.markAsRead(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: notification
      });
    });
  });

  describe('deleteNotification', () => {
    it('should return 200 on success', async () => {
      req.params.id = '1';
      notificationService.deleteNotification.mockResolvedValue(true);

      await notificationController.deleteNotification(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notification deleted successfully'
      });
    });
  });
});
