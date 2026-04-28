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
 *   put:
 *     tags: [Usuários]
 *     summary: Atualiza próprio nome e/ou e-mail
 *     description: |
 *       Atualização parcial: envie apenas `nome`, apenas `email`, ou ambos.
 *       Mesmas regras do cadastro. E-mail usado por outro usuário retorna 409.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *       400:
 *         description: VALIDACAO ou CORPO_VAZIO
 *       401:
 *         description: Token ausente ou inválido
 *       409:
 *         description: E-mail já usado por outro usuário
 */
router.get('/me', authMiddleware, usuarioController.obterPerfil);
router.put('/me', authMiddleware, usuarioController.atualizarPerfil);

/**
 * @swagger
 * /api/usuarios/me/senha:
 *   put:
 *     tags: [Usuários]
 *     summary: Altera a senha do usuário autenticado
 *     description: |
 *       Exige `senhaAtual` correta e `senhaNova` que atenda às mesmas regras do cadastro.
 *       Token JWT permanece válido após a alteração.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [senhaAtual, senhaNova]
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 format: password
 *               senhaNova:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha atualizada — body `{ mensagem }` apenas
 *       400:
 *         description: VALIDACAO, SENHA_IGUAL_ATUAL ou CAMPO_OBRIGATORIO
 *       401:
 *         description: CREDENCIAIS_INVALIDAS (senha atual incorreta)
 */
router.put('/me/senha', authMiddleware, usuarioController.alterarSenha);

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

/**
 * @swagger
 * /api/usuarios/me:
 *   delete:
 *     tags: [Usuários]
 *     summary: Exclui a conta do usuário autenticado
 *     description: |
 *       Remove permanentemente a conta do usuário autenticado.
 *       Exige confirmação de senha no body por segurança.
 *
 *       **Após exclusão:**
 *       - Token JWT antigo torna-se inválido (usuário não existe mais)
 *       - E-mail volta a ficar disponível para novo cadastro
 *       - Operação é atômica (transação única)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [senha]
 *             properties:
 *               senha:
 *                 type: string
 *                 format: password
 *                 description: Senha atual do usuário (confirmação obrigatória)
 *                 example: "SenhaForte1"
 *     responses:
 *       204:
 *         description: Conta excluída com sucesso (sem body)
 *       400:
 *         description: Senha de confirmação ausente (CAMPO_OBRIGATORIO)
 *       401:
 *         description: Token ausente/inválido OU senha incorreta (CREDENCIAIS_INVALIDAS)
 */
router.delete('/me', authMiddleware, usuarioController.excluirConta);

export default router;
