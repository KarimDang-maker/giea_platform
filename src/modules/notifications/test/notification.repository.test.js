const notificationRepository = require('../repositories/notification.repository');
const { getFirestore } = require('firebase-admin/firestore');

jest.mock('firebase-admin/firestore');

describe('NotificationRepository', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      add: jest.fn(),
      where: jest.fn().mockReturnThis(),
      get: jest.fn(),
      doc: jest.fn().mockReturnThis(),
      update: jest.fn(),
      delete: jest.fn()
    };

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    getFirestore.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should add a notification to the collection', async () => {
      const data = { userId: '123', title: 'Test' };
      mockCollection.add.mockResolvedValue({ id: 'newId' });

      const result = await notificationRepository.create(data);

      expect(mockDb.collection).toHaveBeenCalledWith('notifications');
      expect(mockCollection.add).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 'newId', ...data });
    });
  });

  describe('findAllByUserId', () => {
    it('should return all notifications for a user', async () => {
      const userId = '123';
      const mockDocs = [
        { id: '1', data: () => ({ title: 'N1', userId }) },
        { id: '2', data: () => ({ title: 'N2', userId }) }
      ];
      mockCollection.get.mockResolvedValue({
        empty: false,
        docs: mockDocs
      });

      const result = await notificationRepository.findAllByUserId(userId);

      expect(mockCollection.where).toHaveBeenCalledWith('userId', '==', userId);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1', title: 'N1', userId });
    });

    it('should return empty array if no notifications found', async () => {
      mockCollection.get.mockResolvedValue({ empty: true });
      const result = await notificationRepository.findAllByUserId('123');
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a notification by id', async () => {
      const id = 'notif123';
      mockCollection.get.mockResolvedValue({
        exists: true,
        id,
        data: () => ({ title: 'Test' })
      });

      const result = await notificationRepository.findById(id);

      expect(mockCollection.doc).toHaveBeenCalledWith(id);
      expect(result).toEqual({ id, title: 'Test' });
    });

    it('should return null if notification not found', async () => {
      mockCollection.get.mockResolvedValue({ exists: false });
      const result = await notificationRepository.findById('invalid');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      const id = 'notif123';
      const data = { read: true };
      
      // Mock findById for the return value
      mockCollection.get.mockResolvedValue({
        exists: true,
        id,
        data: () => ({ ...data, title: 'Updated' })
      });

      const result = await notificationRepository.update(id, data);

      expect(mockCollection.doc).toHaveBeenCalledWith(id);
      expect(mockCollection.update).toHaveBeenCalledWith(expect.objectContaining({
        read: true,
        updatedAt: expect.any(Date)
      }));
      expect(result.id).toBe(id);
    });
  });

  describe('delete', () => {
    it('should delete a notification', async () => {
      const id = 'notif123';
      const result = await notificationRepository.delete(id);
      expect(mockCollection.doc).toHaveBeenCalledWith(id);
      expect(mockCollection.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
