/**
 * Erro de aplicação controlado (lançado propositalmente pelas regras de negócio).
 *
 * Uso:
 *   throw new AppError('EMAIL_JA_CADASTRADO', 'Já existe um usuário com esse e-mail.', 409);
 */
export class AppError extends Error {
  constructor(codigo, mensagem, statusCode = 400, detalhes = null) {
    super(mensagem);
    this.name = 'AppError';
    this.codigo = codigo;
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

/**
 * Middleware de tratamento centralizado de erros.
 *
 * Captura erros lançados durante a requisição e devolve resposta
 * no formato padronizado da API.
 */
export function errorMiddleware(err, req, res, next) {
  // Erros controlados (AppError)
  if (err instanceof AppError) {
    const resposta = {
      erro: {
        codigo: err.codigo,
        mensagem: err.mensagem || err.message,
      },
    };

    if (err.detalhes) {
      resposta.erro.detalhes = err.detalhes;
    }

    return res.status(err.statusCode).json(resposta);
  }

  // Erros de token (vindos do jwt.js)
  if (err.codigo === 'TOKEN_INVALIDO' || err.codigo === 'TOKEN_EXPIRADO') {
    return res.status(401).json({
      erro: {
        codigo: err.codigo,
        mensagem: err.message,
      },
    });
  }

  // Erros de sintaxe JSON no body
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      erro: {
        codigo: 'FORMATO_INVALIDO',
        mensagem: 'O corpo da requisição não é um JSON válido.',
      },
    });
  }

  // Erros inesperados (bug no código ou problema de infraestrutura)
  console.error('Erro não tratado:', err);

  return res.status(500).json({
    erro: {
      codigo: 'ERRO_INTERNO',
      mensagem: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
    },
  });
}