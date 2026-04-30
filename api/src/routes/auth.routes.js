import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       required: [token, usuario]
 *       properties:
 *         token:
 *           type: string
 *           description: "JWT assinado com payload { sub, email, iat, exp }. Válido por 24h (configurável via JWT_EXPIRES_IN)."
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         usuario:
 *           type: object
 *           required: [id, nome, email]
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             nome:
 *               type: string
 *               example: "Ana Martins"
 *             email:
 *               type: string
 *               format: email
 *               example: "ana@provus.com"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Autentica um usuário e devolve um JWT
 *     description: |
 *       Autentica um usuário e devolve um token JWT. Rota pública (não exige autenticação).
 *
 *       **Estrutura do token (payload):**
 *       - sub — id do usuário
 *       - email — e-mail do usuário (em minúsculas)
 *       - iat — timestamp de emissão
 *       - exp — timestamp de expiração (padrão 24h)
 *
 *       Por segurança, a resposta para e-mail não cadastrado e senha incorreta é exatamente a mesma (401 CREDENCIAIS_INVALIDAS), evitando enumeração de e-mails válidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ana@provus.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "Senha123"
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Campos obrigatórios ausentes ou JSON malformado (CAMPO_OBRIGATORIO ou FORMATO_INVALIDO)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Credenciais inválidas — mesma resposta para e-mail inexistente e senha incorreta (CREDENCIAIS_INVALIDAS)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/login', authController.login);

export default router;
