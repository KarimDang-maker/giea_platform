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
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            location: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            coverImage: { type: 'string' },
            createdBy: { type: 'string' },
            isDeleted: { type: 'boolean' },
          },
        },
        EventRegistration: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            eventId: { type: 'string' },
            idUser: { type: 'string', nullable: true },
            email: { type: 'string' },
            fullName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
            isDeleted: { type: 'boolean' },
          },
        },
        EventSession: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            eventId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string' },
            lead: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            maxParticipants: { type: 'integer' },
            isDeleted: { type: 'boolean' },
          },
        },
        SessionParticipant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            sessionId: { type: 'string' },
            idUser: { type: 'string', nullable: true },
            email: { type: 'string' },
            fullName: { type: 'string' },
            isDeleted: { type: 'boolean' },
          },
        },
        CompanyPage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            idUser: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            logo: { type: 'string' },
            coverImage: { type: 'string' },
            category: { type: 'string' },
            contactEmail: { type: 'string' },
            contactPhone: { type: 'string' },
            website: { type: 'string' },
            address: { type: 'string' },
            socialLinks: {
              type: 'object',
              properties: {
                facebook: { type: 'string' },
                instagram: { type: 'string' },
                linkedin: { type: 'string' },
                twitter: { type: 'string' },
              },
            },
            isDeleted: { type: 'boolean' },
          },
        },
        CompanyProduct: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyPageId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            image: { type: 'string' },
            isDeleted: { type: 'boolean' },
          },
        },
        CompanyService: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyPageId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            duration: { type: 'string' },
            image: { type: 'string' },
            isDeleted: { type: 'boolean' },
          },
        },
        CompanyNews: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyPageId: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string' },
            isDeleted: { type: 'boolean' },
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
    `${__dirname}/../modules/authentication/routes/*.js`,
    `${__dirname}/../modules/marketplace/routes/*.js`,
    `${__dirname}/../modules/events/routes/*.js`,
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
