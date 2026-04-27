import jwt from 'jsonwebtoken';

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
  decodificarPayload,
};
