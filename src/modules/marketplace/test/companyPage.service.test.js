jest.mock('../../../config/database', () => ({
    admin: require('./firestore.mock').mockAdmin,
}));

const companyPageService = require('../services/companyPage.service');
const { mockAdmin, mockFirestore, docMock, querySnapshotMock } = require('./firestore.mock');

describe('CompanyPageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should throw an error if idUser is provided but user does not exist', async () => {
            docMock.get.mockResolvedValue({ exists: false });

            await expect(companyPageService.findAll({ idUser: 'invalid@test.com' }))
                .rejects.toThrow('Utilisateur non trouvé');

            try {
                await companyPageService.findAll({ idUser: 'invalid@test.com' });
            } catch (error) {
                expect(error.statusCode).toBe(404);
            }
        });

        it('should return pages if idUser exists', async () => {
            docMock.get.mockResolvedValueOnce({ exists: true });
            querySnapshotMock.docs = [{ data: () => ({ id: 'page1', isDeleted: false }) }];
            mockFirestore.get.mockResolvedValueOnce(querySnapshotMock);

            const result = await companyPageService.findAll({ idUser: 'user@test.com' });
            expect(result).toHaveLength(1);
        });
    });

    describe('create', () => {
        it('should throw an error with statusCode 404 if the user does not exist', async () => {
            docMock.get.mockResolvedValue({ exists: false });

            try {
                await companyPageService.create({ idUser: 'nonexistent@test.com' });
            } catch (error) {
                expect(error.message).toBe('Utilisateur non trouvé');
                expect(error.statusCode).toBe(404);
            }
        });

        it('should create the page if the user exists', async () => {
            docMock.get.mockResolvedValue({ exists: true, data: () => ({ isDeleted: false }) });
            docMock.set.mockResolvedValue(true);

            const result = await companyPageService.create({ idUser: 'user@test.com', name: 'My Company' });

            expect(result.name).toBe('My Company');
            expect(docMock.set).toHaveBeenCalled();
        });
    });

    describe('delete (Cascade)', () => {
        it('should perform a batch update for the page and all related news/services', async () => {
            // 1. Mock page existence (doc().get())
            docMock.get.mockResolvedValueOnce({
                exists: true,
                data: () => ({ id: 'page1', isDeleted: false })
            });

            // 2. Mock associated news items (where().get())
            querySnapshotMock.docs = [{ ref: 'newsRef1' }, { ref: 'newsRef2' }];
            mockFirestore.get.mockResolvedValueOnce(querySnapshotMock);

            // 3. Mock associated services (where().get())
            const servicesSnapshot = {
                docs: [{ ref: 'serviceRef1' }],
                forEach: (cb) => [{ ref: 'serviceRef1' }].forEach(cb)
            };
            mockFirestore.get.mockResolvedValueOnce(servicesSnapshot);

            const result = await companyPageService.delete('page1');

            expect(result).toBe(true);
            expect(mockAdmin.firestore().batch).toHaveBeenCalled();
        });

        it('should return false if the page does not exist', async () => {
            docMock.get.mockResolvedValue({ exists: false });

            const result = await companyPageService.delete('invalid-id');

            expect(result).toBe(false);
        });
    });
});
