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
        MembreProjet: {
          type: 'object',
          required: ['nom', 'role'],
          properties: {
            id: { type: 'string', readOnly: true },
            nom: { type: 'string', example: 'Alice Dupont' },
            role: { type: 'string', example: 'Directrice Technique' },
            addedAt: { type: 'string', format: 'date-time', readOnly: true },
          },
        },
        DocumentProjet: {
          type: 'object',
          required: ['nomDoc', 'type'],
          properties: {
            id: { type: 'string', readOnly: true },
            nomDoc: { type: 'string', example: 'Business Plan V1' },
            url: { type: 'string', format: 'uri', readOnly: true },
            type: { 
              type: 'string', 
              enum: ['business_plan', 'presentation', 'etude_de_marche', 'autre'],
              example: 'business_plan'
            },
            taille: { type: 'integer', example: 1048576, readOnly: true },
            uploadedAt: { type: 'string', format: 'date-time', readOnly: true },
          },
        },
        Projet: {
          type: 'object',
          required: ['nomPorteur', 'titre', 'description', 'secteur', 'montantRecherche', 'financement', 'niveauMaturite'],
          properties: {
            id: { type: 'string', readOnly: true },
            porteurId: { type: 'string', readOnly: true },
            nomPorteur: { type: 'string', example: 'John Doe' },
            titre: { type: 'string', example: 'Plateforme de Recyclage Innovante' },
            description: { 
              type: 'string', 
              example: 'Un projet visant à transformer les déchets plastiques en briques de construction abordables.' 
            },
            secteur: { type: 'string', example: 'Environnement' },
            montantRecherche: { type: 'number', example: 15000000 },
            financement: { 
              type: 'string', 
              enum: ['subvention', 'investissement', 'mixte'], 
              example: 'investissement' 
            },
            niveauMaturite: { 
              type: 'string', 
              enum: ['idée', 'prototype', 'productif'], 
              example: 'prototype' 
            },
            statut: { 
              type: 'string', 
              enum: ['soumis', 'en_evaluation', 'en_revision', 'bancable', 'rejete', 'archivé'],
              readOnly: true 
            },
            equipe: { 
              type: 'array', 
              items: { $ref: '#/components/schemas/MembreProjet' } 
            },
            documents: { 
              type: 'array', 
              items: { $ref: '#/components/schemas/DocumentProjet' } 
            },
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  commentaire: { type: 'string' },
                  date: { type: 'string', format: 'date-time' }
                }
              },
              readOnly: true
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
    `${__dirname}/../modules/gestion_projets/routes/*.js`,
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
