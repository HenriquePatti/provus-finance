import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Provus Finance API',
      version: '0.1.0',
      description: 'API REST para gestão financeira pessoal.\n\nDocumentação interativa dos endpoints.',
      contact: {
        name: 'Henrique Patti',
        url: 'https://github.com/HenriquePatti/provus-finance',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido após login bem-sucedido',
        },
      },
    },
    tags: [
      { name: 'Sistema', description: 'Endpoints de sistema e saúde' },
      { name: 'Usuários', description: 'Gestão de usuários' },
      { name: 'Autenticação', description: 'Login e geração de tokens' },
      { name: 'Contas', description: 'Gestão de contas financeiras' },
      { name: 'Categorias', description: 'Gestão de categorias' },
      { name: 'Transações', description: 'Gestão de transações' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;