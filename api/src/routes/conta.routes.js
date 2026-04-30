import { Router } from 'express';
import contaController from '../controllers/conta.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Conta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Nubank Pessoal"
 *         tipo:
 *           type: string
 *           enum: [corrente, poupanca, carteira_digital, dinheiro, investimento]
 *           example: "corrente"
 *         saldoInicial:
 *           type: number
 *           example: 1000.50
 *         ativo:
 *           type: boolean
 *           example: true
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/contas:
 *   post:
 *     tags: [Contas]
 *     summary: Cria uma nova conta financeira
 *     description: |
 *       Cria uma conta vinculada ao usuário autenticado.
 *
 *       **Tipos aceitos:** corrente, poupanca, carteira_digital, dinheiro, investimento.
 *
 *       **Campos imutáveis após criação:** tipo e saldoInicial.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, tipo]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Nubank Pessoal"
 *               tipo:
 *                 type: string
 *                 enum: [corrente, poupanca, carteira_digital, dinheiro, investimento]
 *                 example: "corrente"
 *               saldoInicial:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 example: 1000.50
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conta'
 *       400:
 *         description: Dados inválidos (VALIDACAO ou CAMPO_OBRIGATORIO)
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.post('/', authMiddleware, contaController.criar);

/**
 * @swagger
 * /api/contas:
 *   get:
 *     tags: [Contas]
 *     summary: Lista contas do usuário autenticado
 *     description: |
 *       Retorna as contas do usuário. Por padrão, apenas contas ativas.
 *       Use `?ativo=false` para ver contas desativadas.
 *       Use `?tipo=corrente` para filtrar por tipo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [corrente, poupanca, carteira_digital, dinheiro, investimento]
 *         description: Filtra por tipo de conta
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: "Filtra por status: true (padrão) ou false"
 *     responses:
 *       200:
 *         description: Lista de contas (pode ser vazia)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conta'
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get('/', authMiddleware, contaController.listar);

/**
 * @swagger
 * /api/contas/{id}:
 *   get:
 *     tags: [Contas]
 *     summary: Consulta uma conta específica com saldo calculado
 *     description: |
 *       Retorna os dados completos da conta, incluindo o saldo calculado
 *       em tempo real (saldoInicial + receitas - despesas).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Dados completos da conta com saldo
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Conta'
 *                 - type: object
 *                   properties:
 *                     saldoCalculado:
 *                       type: number
 *                       example: 1200.75
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta não encontrada (CONTA_NAO_ENCONTRADA)
 */
router.get('/:id', authMiddleware, contaController.consultar);

/**
 * @swagger
 * /api/contas/{id}:
 *   put:
 *     tags: [Contas]
 *     summary: Atualiza o nome da conta
 *     description: |
 *       Apenas o nome é editável. Tipo e saldoInicial são imutáveis após criação.
 *       Campos tipo e saldoInicial enviados no body serão ignorados.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Nubank Conta Corrente"
 *     responses:
 *       200:
 *         description: Conta atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conta'
 *       400:
 *         description: Nome vazio ou ausente (CORPO_VAZIO ou VALIDACAO)
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta não encontrada (CONTA_NAO_ENCONTRADA)
 */
router.put('/:id', authMiddleware, contaController.atualizar);

/**
 * @swagger
 * /api/contas/{id}:
 *   delete:
 *     tags: [Contas]
 *     summary: Desativa uma conta (soft delete)
 *     description: |
 *       Seta `ativo = false`. A conta não é removida do banco.
 *       Transações associadas permanecem intactas.
 *       Conta desativada não aparece na listagem padrão, mas é visível com `?ativo=false`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     responses:
 *       204:
 *         description: Conta desativada com sucesso (sem body)
 *       400:
 *         description: Conta já está inativa (CONTA_JA_INATIVA)
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta não encontrada (CONTA_NAO_ENCONTRADA)
 */
router.delete('/:id', authMiddleware, contaController.desativar);

/**
 * @swagger
 * /api/contas/{id}/saldo:
 *   get:
 *     tags: [Contas]
 *     summary: Consulta o saldo calculado de uma conta
 *     description: |
 *       Retorna o saldo calculado em tempo real.
 *       Fórmula: `saldoInicial + sum(receitas) - sum(despesas)`.
 *       Conta sem transações retorna o saldoInicial.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conta
 *     responses:
 *       200:
 *         description: Saldo calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contaId:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Nubank Pessoal"
 *                 saldoCalculado:
 *                   type: number
 *                   example: 1200.75
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta não encontrada (CONTA_NAO_ENCONTRADA)
 */
router.get('/:id/saldo', authMiddleware, contaController.consultarSaldo);

export default router;
