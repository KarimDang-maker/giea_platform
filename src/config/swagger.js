const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GIEA Platform API',
      version: '1.0.0',
      description: 'Authentication and User Management API for GIEA Platform',
      contact: {
        name: 'GIEA Platform',
        email: 'guegouoguiddel@gmail.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.giea-platform.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'firstName', 'lastName', 'password', 'role'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'Password123!',
            },
            role: {
              type: 'string',
              enum: ['student', 'entrepreneur', 'company', 'investor', 'mentor', 'admin'],
              example: 'student',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            location: {
              type: 'string',
              example: 'New York',
            },
            bio: {
              type: 'string',
              example: 'Software developer',
            },
            avatar: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/avatar.jpg',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
          },
        },
        CompanyPage: {
          type: 'object',
          required: ['idUser', 'name', 'description', 'secteurActivite', 'localisation'],
          properties: {
            id: { type: 'string', readOnly: true },
            idUser: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'Ma Super Entreprise' },
            description: { type: 'string', example: 'Description de l\'entreprise' },
            secteurActivite: { type: 'string', example: 'Technologie' },
            localisation: { type: 'string', example: 'Paris, France' },
            logoUrl: { type: 'string', format: 'uri' },
            coverUrl: { type: 'string', format: 'uri' },
            createdAt: { type: 'string', format: 'date-time', readOnly: true },
            updatedAt: { type: 'string', format: 'date-time', readOnly: true },
            isDeleted: { type: 'boolean', readOnly: true },
          },
        },
        CompanyNews: {
          type: 'object',
          required: ['companyPageId', 'title', 'content'],
          properties: {
            id: { type: 'string', readOnly: true },
            companyPageId: { type: 'string' },
            title: { type: 'string', example: 'Nouvelle levée de fonds' },
            content: { type: 'string', example: 'Nous avons levé 1M€...' },
            imageUrl: { type: 'string', format: 'uri' },
            publishedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time', readOnly: true },
            updatedAt: { type: 'string', format: 'date-time', readOnly: true },
            isDeleted: { type: 'boolean', readOnly: true },
          },
        },
        CompanyService: {
          type: 'object',
          required: ['companyPageId', 'name', 'description'],
          properties: {
            id: { type: 'string', readOnly: true },
            companyPageId: { type: 'string' },
            name: { type: 'string', example: 'Développement Web' },
            description: { type: 'string', example: 'Création de sites internet sur mesure' },
            price: { type: 'number', example: 1500 },
            isAvailable: { type: 'boolean', default: true },
            createdAt: { type: 'string', format: 'date-time', readOnly: true },
            updatedAt: { type: 'string', format: 'date-time', readOnly: true },
            isDeleted: { type: 'boolean', readOnly: true },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    `${__dirname}/../routes/*.js`,
    `${__dirname}/../modules/marketplace/routes/*.js`
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
