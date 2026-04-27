import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import healthRoutes from './routes/health.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

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
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    erro: {
      codigo: 'RECURSO_NAO_ENCONTRADO',
      mensagem: 'A rota solicitada não existe nesta API.',
    },
  });
});

// Middleware centralizado de erros (sempre por último)
app.use(errorMiddleware);

export default app;