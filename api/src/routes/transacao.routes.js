import { Router } from 'express';
import transacaoController from '../controllers/transacao.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/transacoes:
 *   post:
 *     tags: [Transações]
 *     summary: Registra uma nova transação (receita ou despesa)
 *     description: |
 *       Cria uma transação vinculada a uma conta e categoria do usuário autenticado.
 *       Valor armazenado internamente em centavos. Tipo e contaId são imutáveis após criação.
 *
 *       **Compatibilidade de categoria:** a categoria deve ser do mesmo tipo da transação ou tipo "ambos".
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, valor, descricao, dataTransacao, contaId, categoriaId]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [receita, despesa]
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 150.50
 *               descricao:
 *                 type: string
 *                 example: "Supermercado Extra"
 *               dataTransacao:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-30"
 *               contaId:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta ou categoria não encontrada
 *       422:
 *         description: Conta inativa ou categoria incompatível
 */
router.post('/', authMiddleware, transacaoController.criar);

/**
 * @swagger
 * /api/transacoes:
 *   get:
 *     tags: [Transações]
 *     summary: Lista transações do usuário com filtros
 *     description: |
 *       Retorna transações do usuário autenticado, ordenadas por data decrescente.
 *       Todos os filtros são opcionais e combináveis (AND lógico).
 *
 *       **Busca textual:** use `?q=termo` para buscar por descrição (case-insensitive).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [receita, despesa]
 *       - in: query
 *         name: contaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Busca textual por descrição (case-insensitive)
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Lista de transações (pode ser vazia)
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get('/', authMiddleware, transacaoController.listar);

/**
 * @swagger
 * /api/transacoes/{id}:
 *   get:
 *     tags: [Transações]
 *     summary: Consulta uma transação espec��fica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da transação
 *       401:
 *         description: Token ausente, inv��lido ou expirado
 *       404:
 *         description: Transação não encontrada
 */
router.get('/:id', authMiddleware, transacaoController.consultar);

/**
 * @swagger
 * /api/transacoes/{id}:
 *   put:
 *     tags: [Transações]
 *     summary: Atualiza campos editáveis de uma transação
 *     description: |
 *       Campos editáveis: valor, descricao, dataTransacao, categoriaId.
 *       Campos imutáveis: tipo, contaId (ignorados se enviados).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *               descricao:
 *                 type: string
 *               dataTransacao:
 *                 type: string
 *                 format: date
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Transação atualizada
 *       400:
 *         description: Dados inválidos ou body vazio
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Transação não encontrada
 *       422:
 *         description: Categoria incompatível
 */
router.put('/:id', authMiddleware, transacaoController.atualizar);

/**
 * @swagger
 * /api/transacoes/{id}:
 *   delete:
 *     tags: [Transações]
 *     summary: Exclui uma transação (hard delete)
 *     description: |
 *       Remove permanentemente a transação. O saldo da conta é recalculado automaticamente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Transação excluída (sem body)
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Transação não encontrada
 */
router.delete('/:id', authMiddleware, transacaoController.excluir);

export default router;
