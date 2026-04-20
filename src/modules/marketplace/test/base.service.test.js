// Mock the database dependency
jest.mock('../../../config/database', () => ({
    admin: require('./firestore.mock').mockAdmin,
}));

const BaseService = require('../services/base.service');
const { mockFirestore, docMock, querySnapshotMock } = require('./firestore.mock');

describe('BaseService', () => {
    let service;
    const collectionName = 'testCollection';

    beforeEach(() => {
        jest.clearAllMocks();
        service = new BaseService(collectionName);
    });

    describe('create', () => {
        it('should create a document and return the data with ID and timestamps', async () => {
            const inputData = { name: 'test' };

            const result = await service.create(inputData);

            expect(mockFirestore.collection).toHaveBeenCalledWith(collectionName);
            expect(result.name).toBe('test');
            expect(result.id).toBeDefined();
            expect(result.isDeleted).toBe(false);
            expect(docMock.set).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all documents that are not deleted', async () => {
            querySnapshotMock.docs = [
                { data: () => ({ id: '1', name: 'doc1', isDeleted: false }) },
                { data: () => ({ id: '2', name: 'doc2', isDeleted: false }) },
            ];

            const result = await service.findAll();

            expect(mockFirestore.where).toHaveBeenCalledWith('isDeleted', '==', false);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('1');
        });
    });

    describe('findById', () => {
        it('should return the document if it exists and is not deleted', async () => {
            docMock.get.mockResolvedValue({
                exists: true,
                data: () => ({ id: '1', isDeleted: false }),
            });

            const result = await service.findById('1');

            expect(result.id).toBe('1');
        });

        it('should return null if the document is deleted', async () => {
            docMock.get.mockResolvedValue({
                exists: true,
                data: () => ({ id: '1', isDeleted: true }),
            });

            const result = await service.findById('1');

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update and return the updated data', async () => {
            docMock.get
                .mockResolvedValueOnce({ exists: true, data: () => ({ id: '1', isDeleted: false }) })
                .mockResolvedValueOnce({ exists: true, data: () => ({ id: '1', name: 'new', isDeleted: false }) });

            docMock.update.mockResolvedValue(true);

            const result = await service.update('1', { name: 'new' });

            expect(docMock.update).toHaveBeenCalled();
            expect(result.name).toBe('new');
        });
    });

    describe('delete', () => {
        it('should perform a soft delete by setting isDeleted to true', async () => {
            docMock.get.mockResolvedValue({ exists: true, data: () => ({ id: '1', isDeleted: false }) });

            const result = await service.delete('1');

            expect(docMock.update).toHaveBeenCalledWith(expect.objectContaining({ isDeleted: true }));
            expect(result).toBe(true);
        });
    });
});
