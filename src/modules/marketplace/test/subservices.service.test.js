jest.mock('../../../config/database', () => ({
    admin: require('./firestore.mock').mockAdmin,
}));

const companyNewsService = require('../services/companyNews.service');
const companyServiceService = require('../services/companyService.service');
const { mockFirestore, docMock } = require('./firestore.mock');

describe('CompanyNews and Services Shared Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('CompanyNewsService', () => {
        it('should throw an error with statusCode 404 if parent page does not exist', async () => {
            docMock.get.mockResolvedValue({ exists: false });

            try {
                await companyNewsService.create({ companyPageId: 'invalid' });
            } catch (error) {
                expect(error.message).toBe('Page entreprise non trouvée ou supprimée');
                expect(error.statusCode).toBe(404);
            }
        });

        it('should create news if parent page exists', async () => {
            docMock.get.mockResolvedValue({ exists: true, data: () => ({ isDeleted: false }) });
            docMock.set.mockResolvedValue(true);

            const result = await companyNewsService.create({
                companyPageId: 'page1',
                title: 'News'
            });

            expect(result.publishedAt).toBeDefined();
            expect(docMock.set).toHaveBeenCalled();
        });
    });

    describe('CompanyServiceService', () => {
        it('should throw an error with statusCode 404 if parent page does not exist', async () => {
            docMock.get.mockResolvedValue({ exists: false });

            try {
                await companyServiceService.create({ companyPageId: 'invalid' });
            } catch (error) {
                expect(error.message).toBe('Page entreprise non trouvée ou supprimée');
                expect(error.statusCode).toBe(404);
            }
        });

        it('should create service with default availability if not specified', async () => {
            docMock.get.mockResolvedValue({ exists: true, data: () => ({ isDeleted: false }) });
            docMock.set.mockResolvedValue(true);

            const result = await companyServiceService.create({
                companyPageId: 'page1',
                name: 'Web Dev'
            });

            expect(result.isAvailable).toBe(true);
            expect(docMock.set).toHaveBeenCalled();
        });
    });
});
