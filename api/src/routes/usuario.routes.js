import { Router } from 'express';
import usuarioController from '../controllers/usuario.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/usuarios/me:
 *   get:
 *     tags: [Usuários]
 *     summary: Consulta próprio perfil autenticado
 *     description: |
 *       Devolve dados do usuário autenticado (sem dados sensíveis).
 *       Requer `Authorization: Bearer <token>` obtido via `POST /api/auth/login`.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil público do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                 atualizadoEm:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Usuário associado ao token não existe mais
 */
router.get('/me', authMiddleware, usuarioController.obterPerfil);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     tags: [Usuários]
 *     summary: Cadastra um novo usuário
 *     description: |
 *       Cria uma conta de usuário no sistema. Rota pública (não exige autenticação).
 *
 *       **Requisitos da senha:**
 *       - Mínimo de 8 caracteres
 *       - Máximo de 64 caracteres
 *       - Ao menos uma letra maiúscula
 *       - Ao menos uma letra minúscula
 *       - Ao menos um número
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Ana Martins"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ana@provus.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "Senha123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                 criadoEm:
 *                   type: string
 *                   format: date-time
 *                 atualizadoEm:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/', usuarioController.criar);

export default router;
