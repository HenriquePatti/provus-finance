import { Router } from 'express';
import categoriaController from '../controllers/categoria.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: "Alimentação"
 *         tipo:
 *           type: string
 *           enum: [receita, despesa, ambos]
 *           example: "despesa"
 *         icone:
 *           type: string
 *           nullable: true
 *           example: "🍔"
 *         padrao:
 *           type: boolean
 *           example: true
 *         usuarioId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     tags: [Categorias]
 *     summary: Lista categorias acessíveis ao usuário
 *     description: |
 *       Retorna categorias padrão do sistema + categorias personalizadas do usuário.
 *       Categorias personalizadas de outros usuários não aparecem.
 *
 *       **Filtros:**
 *       - `?tipo=despesa` — filtra por tipo (inclui categorias do tipo "ambos")
 *       - `?origem=padrao` ou `?origem=personalizada` — filtra por origem
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [receita, despesa, ambos]
 *         description: Filtra por tipo de categoria
 *       - in: query
 *         name: origem
 *         schema:
 *           type: string
 *           enum: [padrao, personalizada]
 *         description: Filtra por origem da categoria
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.get('/', authMiddleware, categoriaController.listar);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     tags: [Categorias]
 *     summary: Cria uma categoria personalizada
 *     description: |
 *       Cria uma categoria vinculada ao usuário autenticado.
 *       Categorias personalizadas têm `padrao = false`.
 *
 *       **Tipos aceitos:** receita, despesa, ambos.
 *       **Ícone:** emoji opcional (máx. 4 caracteres).
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
 *                 example: "Jogos e Hobbies"
 *               tipo:
 *                 type: string
 *                 enum: [receita, despesa, ambos]
 *                 example: "despesa"
 *               icone:
 *                 type: string
 *                 nullable: true
 *                 example: "🎲"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dados inválidos (VALIDACAO ou CAMPO_OBRIGATORIO)
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
router.post('/', authMiddleware, categoriaController.criar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     tags: [Categorias]
 *     summary: Consulta uma categoria específica
 *     description: |
 *       Retorna os dados completos de uma categoria.
 *       Categorias padrão são acessíveis por qualquer usuário autenticado.
 *       Categorias personalizadas são acessíveis apenas pelo criador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Dados da categoria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       404:
 *         description: Categoria não encontrada (CATEGORIA_NAO_ENCONTRADA)
 */
router.get('/:id', authMiddleware, categoriaController.consultar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     tags: [Categorias]
 *     summary: Atualiza uma categoria personalizada
 *     description: |
 *       Apenas nome e ícone são editáveis. Tipo é imutável após criação.
 *       Categorias padrão não podem ser modificadas (retorna 403).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Jogos"
 *               icone:
 *                 type: string
 *                 nullable: true
 *                 example: "🎮"
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Campos inválidos ou body vazio
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Categoria padrão não pode ser modificada (ACESSO_NEGADO)
 *       404:
 *         description: Categoria não encontrada (CATEGORIA_NAO_ENCONTRADA)
 */
router.put('/:id', authMiddleware, categoriaController.atualizar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     tags: [Categorias]
 *     summary: Exclui uma categoria personalizada
 *     description: |
 *       Exclusão permanente (hard delete). Bloqueada quando há transações vinculadas.
 *       Categorias padrão não podem ser excluídas (retorna 403).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria excluída com sucesso (sem body)
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       403:
 *         description: Categoria padrão não pode ser excluída (ACESSO_NEGADO)
 *       404:
 *         description: Categoria não encontrada (CATEGORIA_NAO_ENCONTRADA)
 *       409:
 *         description: Categoria possui transações vinculadas (CATEGORIA_EM_USO)
 */
router.delete('/:id', authMiddleware, categoriaController.excluir);

export default router;
