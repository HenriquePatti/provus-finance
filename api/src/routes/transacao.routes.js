import { Router } from 'express';
import transacaoController from '../controllers/transacao.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transacao:
 *       type: object
 *       required: [id, tipo, valor, descricao, dataTransacao, contaId, categoriaId, criadoEm, atualizadoEm]
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           example: 1
 *         tipo:
 *           type: string
 *           enum: [receita, despesa]
 *           readOnly: true
 *           description: "Imutável após criação (RT-012)"
 *           example: "despesa"
 *         valor:
 *           type: number
 *           minimum: 0.01
 *           maximum: 999999999.99
 *           description: "Valor em reais (máx. 2 casas decimais). Armazenado internamente em centavos (RT-016)."
 *           example: 150.50
 *         descricao:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Supermercado Extra"
 *         dataTransacao:
 *           type: string
 *           format: date
 *           description: "Formato ISO 8601 (RT-022). Datas passadas e futuras são permitidas."
 *           example: "2026-04-30"
 *         contaId:
 *           type: integer
 *           readOnly: true
 *           description: "Imutável após criação (RT-030). Conta deve estar ativa e pertencer ao usuário."
 *           example: 1
 *         categoriaId:
 *           type: integer
 *           description: "Categoria deve ser compatível com o tipo da transação (RK-005). Editável após criação."
 *           example: 1
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *     Erro:
 *       type: object
 *       required: [erro]
 *       properties:
 *         erro:
 *           type: object
 *           required: [codigo, mensagem]
 *           properties:
 *             codigo:
 *               type: string
 *               description: "Código de erro padronizado (ex: VALIDACAO, CAMPO_OBRIGATORIO, TOKEN_AUSENTE)"
 *               example: "VALIDACAO"
 *             mensagem:
 *               type: string
 *               description: "Mensagem legível em português"
 *               example: "Existem campos inválidos na requisição."
 *             detalhes:
 *               type: array
 *               description: "Presente apenas quando há múltiplos erros de validação"
 *               items:
 *                 type: object
 *                 required: [campo, problema]
 *                 properties:
 *                   campo:
 *                     type: string
 *                   problema:
 *                     type: string
 */

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
 *                 description: "Imutável após criação"
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 999999999.99
 *                 description: "Máximo 2 casas decimais"
 *                 example: 150.50
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Supermercado Extra"
 *               dataTransacao:
 *                 type: string
 *                 format: date
 *                 description: "Formato ISO 8601"
 *                 example: "2026-04-30"
 *               contaId:
 *                 type: integer
 *                 description: "Conta deve existir, estar ativa e pertencer ao usuário. Imutável após criação."
 *               categoriaId:
 *                 type: integer
 *                 description: "Categoria deve ser compatível com o tipo da transação"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       400:
 *         description: Dados inválidos (VALIDACAO ou CAMPO_OBRIGATORIO)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Conta ou categoria não encontrada
 *       422:
 *         description: Conta inativa (CONTA_INATIVA) ou categoria incompatível (CATEGORIA_INCOMPATIVEL)
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transacao'
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get('/', authMiddleware, transacaoController.listar);

/**
 * @swagger
 * /api/transacoes/{id}:
 *   get:
 *     tags: [Transações]
 *     summary: Consulta uma transação específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Dados da transação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Transação não encontrada (TRANSACAO_NAO_ENCONTRADA)
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
 *             minProperties: 1
 *             description: "Envie ao menos um campo. tipo e contaId são imutáveis e serão ignorados."
 *             properties:
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 999999999.99
 *                 description: "Máximo 2 casas decimais"
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               dataTransacao:
 *                 type: string
 *                 format: date
 *                 description: "Formato ISO 8601"
 *               categoriaId:
 *                 type: integer
 *                 description: "Deve ser compatível com o tipo da transação"
 *     responses:
 *       200:
 *         description: Transação atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transacao'
 *       400:
 *         description: Dados inválidos ou body vazio (VALIDACAO ou CORPO_VAZIO)
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Transação não encontrada (TRANSACAO_NAO_ENCONTRADA)
 *       422:
 *         description: Categoria incompatível (CATEGORIA_INCOMPATIVEL)
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
 *         description: Transação não encontrada (TRANSACAO_NAO_ENCONTRADA)
 */
router.delete('/:id', authMiddleware, transacaoController.excluir);

export default router;
