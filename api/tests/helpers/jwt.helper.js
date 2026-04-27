import jwt from 'jsonwebtoken';

/**
 * JWT assinado com `exp` já no passado — útil apenas em testes (CT token expirado).
 * Usa JWT_SECRET do ambiente como a API real.
 * Chame só depois de importar `app` (carrega dotenv via `src/utils/jwt.js`).
 *
 * @param {{ sub: number, email: string }} usuario
 * @returns {string} Token que `validarToken()` rejeitará como expirado
 */
export function gerarJwtExpiradoAssinado({ sub, email }) {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    throw new Error('JWT_SECRET obrigatório nos testes (api/.env).');
  }
  const exp = Math.floor(Date.now() / 1000) - 600;
  return jwt.sign({ sub, email, exp }, SECRET);
}

/**
 * Decodifica o payload de um JWT SEM validar assinatura nem expiração.
 *
 * Uso EXCLUSIVO em testes — permite inspecionar o conteúdo do token
 * (sub, email, iat, exp) sem depender do JWT_SECRET do ambiente.
 *
 * NUNCA usar em código de produção. A validação real (assinatura +
 * expiração + emissor) acontece em src/utils/jwt.js → validarToken().
 *
 * @param {string} token - JWT a ser inspecionado
 * @returns {Object|null} Payload decodificado ({ sub, email, iat, exp }) ou null se inválido
 */
export function decodificarPayload(token) {
  return jwt.decode(token);
}

export default {
  gerarJwtExpiradoAssinado,
  decodificarPayload,
};
