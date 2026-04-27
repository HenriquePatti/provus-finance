import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

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
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT assinado, válido por 24h
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "Ana Martins"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "ana@provus.com"
 *       400:
 *         description: Campos obrigatórios ausentes ou JSON malformado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: string
 *                       enum: [CAMPO_OBRIGATORIO, FORMATO_INVALIDO]
 *                       example: "CAMPO_OBRIGATORIO"
 *                     mensagem:
 *                       type: string
 *                       example: "Um ou mais campos obrigatórios não foram informados."
 *                     detalhes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           campo:
 *                             type: string
 *                           problema:
 *                             type: string
 *       401:
 *         description: Credenciais inválidas (e-mail não cadastrado ou senha incorreta)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: string
 *                       example: "CREDENCIAIS_INVALIDAS"
 *                     mensagem:
 *                       type: string
 *                       example: "E-mail ou senha incorretos."
 */
router.post('/login', authController.login);

export default router;
