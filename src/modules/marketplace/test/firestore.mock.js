const docMock = {
    id: 'mock-id',
    set: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ id: 'mock-id', isDeleted: false }),
    }),
};

const querySnapshotMock = {
    docs: [],
    forEach: jest.fn((cb) => querySnapshotMock.docs.forEach(cb)),
    empty: true,
};

const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn(() => docMock),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue(querySnapshotMock),
    batch: jest.fn(() => ({
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(true),
    })),
};

const mockAdmin = {
    firestore: Object.assign(() => mockFirestore, {
        FieldValue: {
            serverTimestamp: jest.fn().mockReturnValue('mock-timestamp'),
        },
    }),
};

module.exports = { mockAdmin, mockFirestore, docMock, querySnapshotMock };
