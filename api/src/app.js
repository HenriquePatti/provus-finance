import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

// Middlewares globais de segurança
app.use(helmet());
app.use(cors());

// Parsing de JSON no body das requisições
app.use(express.json({ limit: '10kb' }));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Provus Finance API - Docs',
}));

// Rotas da API
app.use('/api/health', healthRoutes);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    erro: {
      codigo: 'RECURSO_NAO_ENCONTRADO',
      mensagem: 'A rota solicitada não existe nesta API.',
    },
  });
});

// Tratamento de erros genéricos
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    erro: {
      codigo: 'ERRO_INTERNO',
      mensagem: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
    },
  });
});

export default app;