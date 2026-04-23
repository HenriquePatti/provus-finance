import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Sistema]
 *     summary: Verifica se a API está online
 *     description: Endpoint público para health check. Retorna status da API e timestamp.
 *     responses:
 *       200:
 *         description: API está funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 mensagem:
 *                   type: string
 *                   example: "API do Provus Finance está no ar"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 versao:
 *                   type: string
 *                   example: "0.1.0"
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensagem: 'API do Provus Finance está no ar',
    timestamp: new Date().toISOString(),
    versao: '0.1.0',
  });
});

export default router;