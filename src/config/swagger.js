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
            secteur: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'cat_123', description: 'ID de la catégorie (null si création)', nullable: true },
                name: { type: 'string', example: 'Environnement', description: 'Nom du secteur' }
              },
              required: ['name']
            },
            sousSecteur: {
              type: 'string',
              example: 'Recyclage plastique',
              description: 'Sous-catégorie précise du projet',
              nullable: true
            },
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
        Statistics: {
          type: 'object',
          properties: {
            userStatistics: {
              type: 'object',
              properties: {
                totalUsers: { type: 'integer', example: 150 },
                activeUsers: { type: 'integer', example: 120 },
                usersByRole: {
                  type: 'object',
                  properties: {
                    student: { type: 'integer' },
                    entrepreneur: { type: 'integer' },
                    company: { type: 'integer' },
                    investor: { type: 'integer' },
                    mentor: { type: 'integer' },
                    admin: { type: 'integer' }
                  }
                },
                newUsersThisMonth: { type: 'integer', example: 25 },
                verifiedUsers: { type: 'integer', example: 145 },
                unverifiedUsers: { type: 'integer', example: 5 }
              }
            },
            projectStatistics: {
              type: 'object',
              properties: {
                totalProjects: { type: 'integer', example: 45 },
                projectsByStatus: {
                  type: 'object',
                  properties: {
                    soumis: { type: 'integer' },
                    en_evaluation: { type: 'integer' },
                    en_revision: { type: 'integer' },
                    bancable: { type: 'integer' },
                    rejete: { type: 'integer' },
                    archivé: { type: 'integer' }
                  }
                },
                projectsByFunding: {
                  type: 'object',
                  properties: {
                    subvention: { type: 'integer' },
                    investissement: { type: 'integer' },
                    mixte: { type: 'integer' }
                  }
                },
                totalFundingRequested: { type: 'number', example: 5000000 },
                averageFundingPerProject: { type: 'number', example: 111111.11 }
              }
            },
            marketplaceStatistics: {
              type: 'object',
              properties: {
                totalCompanies: { type: 'integer', example: 30 },
                totalProducts: { type: 'integer', example: 85 },
                totalServices: { type: 'integer', example: 45 },
                totalNews: { type: 'integer', example: 120 }
              }
            },
            generatedAt: { type: 'string', format: 'date-time' },
            period: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'yearly'] }
          }
        },
        Report: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            title: { type: 'string', example: 'Monthly Activity Report' },
            description: { type: 'string', example: 'Platform activity analysis' },
            reportType: { type: 'string', enum: ['activity', 'analytics', 'custom'] },
            scope: { type: 'string', enum: ['platform', 'users', 'projects', 'marketplace'] },
            periodStart: { type: 'string', format: 'date-time' },
            periodEnd: { type: 'string', format: 'date-time' },
            summary: { type: 'string' },
            metrics: { type: 'object' },
            insights: {
              type: 'array',
              items: { type: 'string' }
            },
            status: { type: 'string', enum: ['generated', 'scheduled', 'archived'] },
            format: { type: 'string', enum: ['json', 'csv', 'pdf'] },
            generatedBy: { type: 'string', format: 'email' },
            generatedAt: { type: 'string', format: 'date-time', readOnly: true },
            isScheduled: { type: 'boolean' },
            recipients: {
              type: 'array',
              items: { type: 'string', format: 'email' }
            },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            userId: { type: 'string' },
            type: { type: 'string', example: 'project_created', description: 'Type of activity' },
            title: { type: 'string', example: 'New Project Created' },
            description: { type: 'string', example: 'You created a new project' },
            entityType: { type: 'string', enum: ['project', 'resource', 'comment', 'message', 'profile'] },
            entityId: { type: 'string' },
            actionBy: { type: 'string' },
            actionByName: { type: 'string' },
            relatedData: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time', readOnly: true },
            isRead: { type: 'boolean', default: false },
            metadata: { type: 'object' }
          }
        },
        Recommendation: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            userId: { type: 'string' },
            type: { type: 'string', example: 'project', description: 'Type of recommendation' },
            title: { type: 'string', example: 'Explore Collaborative Projects' },
            description: { type: 'string', example: 'Join projects matching your skills' },
            reason: { type: 'string', example: 'Based on your profile' },
            targetId: { type: 'string' },
            targetType: { type: 'string' },
            relevanceScore: { type: 'integer', minimum: 0, maximum: 100, example: 85 },
            metadata: { type: 'object' },
            isDismissed: { type: 'boolean', default: false },
            createdAt: { type: 'string', format: 'date-time', readOnly: true },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        },
        Dashboard: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            userName: { type: 'string' },
            userRole: { type: 'string', enum: ['student', 'entrepreneur', 'company', 'investor', 'mentor', 'admin'] },
            recentActivities: {
              type: 'array',
              items: { $ref: '#/components/schemas/Activity' }
            },
            recommendations: {
              type: 'array',
              items: { $ref: '#/components/schemas/Recommendation' }
            },
            quickLinks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  path: { type: 'string' },
                  icon: { type: 'string' }
                }
              }
            },
            statistics: {
              type: 'object',
              properties: {
                totalProjects: { type: 'integer' },
                totalResources: { type: 'integer' },
                profileCompletion: { type: 'integer' },
                role: { type: 'string' },
                joinedDate: { type: 'string', format: 'date-time' }
              }
            },
            notifications: {
              type: 'array',
              items: { type: 'object' }
            },
            createdAt: { type: 'string', format: 'date-time', readOnly: true },
            updatedAt: { type: 'string', format: 'date-time', readOnly: true }
          }
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
    `${__dirname}/../modules/categories/routes/*.js`,
    `${__dirname}/../modules/authentication/routes/*.js`,
    `${__dirname}/../modules/gestion_projets/routes/*.js`,
    `${__dirname}/../modules/gestion_projets/docs/*.js`,
    `${__dirname}/../modules/marketplace/routes/*.js`,
    `${__dirname}/../modules/report/routes/*.js`,
    `${__dirname}/../modules/dashboard/routes/*.js`,
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
