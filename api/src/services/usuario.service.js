import usuarioRepository from '../repositories/usuario.repository.js';
import { compararHash, gerarHash } from '../utils/hash.js';
import { AppError } from '../middlewares/error.middleware.js';

// ============================================================
// VALIDAÇÕES
// ============================================================

/**
 * Valida o e-mail.
 */
function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return { campo: 'email', problema: 'E-mail é obrigatório.' };
  }

  const emailTrim = email.trim();

  if (emailTrim.length === 0) {
    return { campo: 'email', problema: 'E-mail é obrigatório.' };
  }

  if (emailTrim.length > 254) {
    return { campo: 'email', problema: 'E-mail excede o tamanho máximo de 254 caracteres.' };
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(emailTrim)) {
    return { campo: 'email', problema: 'Formato de e-mail inválido.' };
  }

  return null;
}

/**
 * Valida a senha.
 */
function validarSenha(senha) {
  if (!senha || typeof senha !== 'string') {
    return { campo: 'senha', problema: 'Senha é obrigatória.' };
  }

  if (senha.length < 8) {
    return { campo: 'senha', problema: 'Senha deve ter no mínimo 8 caracteres.' };
  }

  if (senha.length > 64) {
    return { campo: 'senha', problema: 'Senha deve ter no máximo 64 caracteres.' };
  }

  if (!/[A-Z]/.test(senha)) {
    return { campo: 'senha', problema: 'Senha deve conter ao menos uma letra maiúscula.' };
  }

  if (!/[a-z]/.test(senha)) {
    return { campo: 'senha', problema: 'Senha deve conter ao menos uma letra minúscula.' };
  }

  if (!/[0-9]/.test(senha)) {
    return { campo: 'senha', problema: 'Senha deve conter ao menos um número.' };
  }

  return null;
}

/**
 * Valida o nome.
 */
function validarNome(nome) {
  if (!nome || typeof nome !== 'string') {
    return { campo: 'nome', problema: 'Nome é obrigatório.' };
  }

  const nomeNormalizado = nome.trim().replace(/\s+/g, ' ');

  if (nomeNormalizado.length < 2) {
    return { campo: 'nome', problema: 'Nome deve ter no mínimo 2 caracteres.' };
  }

  if (nomeNormalizado.length > 100) {
    return { campo: 'nome', problema: 'Nome deve ter no máximo 100 caracteres.' };
  }

  if (/^\d+$/.test(nomeNormalizado)) {
    return { campo: 'nome', problema: 'Nome não pode conter apenas números.' };
  }

  return null;
}

/**
 * Normaliza os dados de entrada.
 */
function normalizarDados({ nome, email, senha }) {
  return {
    nome: typeof nome === 'string' ? nome.trim().replace(/\s+/g, ' ') : nome,
    email: typeof email === 'string' ? email.trim().toLowerCase() : email,
    senha,
  };
}

/**
 * Remove dados sensíveis antes de retornar.
 */
function formatarResposta(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    criadoEm: usuario.criado_em,
    atualizadoEm: usuario.atualizado_em,
  };
}

// ============================================================
// OPERAÇÕES
// ============================================================

/**
 * Cria um novo usuário.
 *
 * @param {Object} dados - { nome, email, senha }
 * @returns {Object} Usuário criado (sem senha)
 * @throws {AppError} Se validações falharem ou e-mail já existir
 */
export async function criar(dados) {
  // 1. Normaliza os dados
  const { nome, email, senha } = normalizarDados(dados);

  // 2. Valida todos os campos e acumula erros
  const erros = [];

  const erroNome = validarNome(nome);
  if (erroNome) erros.push(erroNome);

  const erroEmail = validarEmail(email);
  if (erroEmail) erros.push(erroEmail);

  const erroSenha = validarSenha(senha);
  if (erroSenha) erros.push(erroSenha);

  if (erros.length > 0) {
    // Determina o código: se todos os erros são de "obrigatório", usa CAMPO_OBRIGATORIO
    const todosSaoObrigatorios = erros.every((e) =>
      e.problema.toLowerCase().includes('obrigatóri')
    );

    const codigo = todosSaoObrigatorios ? 'CAMPO_OBRIGATORIO' : 'VALIDACAO';
    const mensagem = todosSaoObrigatorios
      ? 'Um ou mais campos obrigatórios não foram informados.'
      : 'Existem campos inválidos na requisição.';

    throw new AppError(codigo, mensagem, 400, erros);
  }

  // 3. Verifica se o e-mail já existe
  if (usuarioRepository.emailExiste(email)) {
    throw new AppError(
      'EMAIL_JA_CADASTRADO',
      'Já existe um usuário com esse e-mail.',
      409
    );
  }

  // 4. Gera hash da senha
  const senhaHash = await gerarHash(senha);

  // 5. Persiste no banco
  const usuarioCriado = usuarioRepository.inserir({
    nome,
    email,
    senhaHash,
  });

  // 6. Retorna sem dados sensíveis
  return formatarResposta(usuarioCriado);
}

/**
 * Retorna o perfil público do usuário (GET /api/usuarios/me).
 *
 * @param {number} usuarioId — id vindos do payload JWT (`sub`)
 * @returns {Object} `{ id, nome, email, criadoEm, atualizadoEm }` — sem campos sensíveis
 */
export function obterPerfil(usuarioId) {
  const usuario = usuarioRepository.buscarPorId(usuarioId);

  if (!usuario) {
    throw new AppError(
      'USUARIO_NAO_ENCONTRADO',
      'Usuário não encontrado.',
      404
    );
  }

  return formatarResposta(usuario);
}

/**
 * PUT /api/usuarios/me — atualiza nome e/ou e-mail (US-003).
 *
 * Aceita corpo parcial: só `nome`, só `email`, ou ambos.
 * Exige pelo menos um campo presente no body.
 *
 * @param {number} usuarioId
 * @param {Object} body - { nome?, email? }
 */
export function atualizarPerfil(usuarioId, body = {}) {
  const temNome = Object.prototype.hasOwnProperty.call(body, 'nome');
  const temEmail = Object.prototype.hasOwnProperty.call(body, 'email');

  if (!temNome && !temEmail) {
    throw new AppError(
      'CORPO_VAZIO',
      'Informe ao menos um campo (nome ou email) para atualizar.',
      400
    );
  }

  const atual = usuarioRepository.buscarPorId(usuarioId);
  if (!atual) {
    throw new AppError('USUARIO_NAO_ENCONTRADO', 'Usuário não encontrado.', 404);
  }

  const erros = [];
  if (temNome) {
    const erroNome = validarNome(body.nome);
    if (erroNome) erros.push(erroNome);
  }
  if (temEmail) {
    const erroEmail = validarEmail(body.email);
    if (erroEmail) erros.push(erroEmail);
  }

  if (erros.length > 0) {
    const todosSaoObrigatorios = erros.every((e) =>
      e.problema.toLowerCase().includes('obrigatóri')
    );
    const codigo = todosSaoObrigatorios ? 'CAMPO_OBRIGATORIO' : 'VALIDACAO';
    const mensagem = todosSaoObrigatorios
      ? 'Um ou mais campos obrigatórios não foram informados.'
      : 'Existem campos inválidos na requisição.';
    throw new AppError(codigo, mensagem, 400, erros);
  }

  let nomeFinal = atual.nome;
  let emailFinal = atual.email;

  if (temNome) {
    nomeFinal = typeof body.nome === 'string' ? body.nome.trim().replace(/\s+/g, ' ') : body.nome;
  }
  if (temEmail) {
    emailFinal = typeof body.email === 'string' ? body.email.trim().toLowerCase() : body.email;
  }

  if (temEmail) {
    const outro = usuarioRepository.buscarPorEmail(emailFinal);
    if (outro && outro.id !== usuarioId) {
      throw new AppError(
        'EMAIL_JA_CADASTRADO',
        'Já existe um usuário com esse e-mail.',
        409
      );
    }
  }

  const atualizado = usuarioRepository.atualizarDados(usuarioId, {
    nome: nomeFinal,
    email: emailFinal,
  });

  return formatarResposta(atualizado);
}

/**
 * PUT /api/usuarios/me/senha — altera senha (US-004).
 *
 * JWT continua válido após alteração (RU-041) — apenas o hash na base muda.
 *
 * @param {number} usuarioId
 * @param {{ senhaAtual?: string, senhaNova?: string }} body
 * @returns {Promise<{ mensagem: string }>}
 */
export async function alterarSenha(usuarioId, body = {}) {
  const temSenhaAtual = Object.prototype.hasOwnProperty.call(body, 'senhaAtual');
  const temSenhaNova = Object.prototype.hasOwnProperty.call(body, 'senhaNova');

  const errosObrigatorio = [];
  if (!temSenhaAtual) {
    errosObrigatorio.push({ campo: 'senhaAtual', problema: 'Senha atual é obrigatória.' });
  }
  if (!temSenhaNova) {
    errosObrigatorio.push({ campo: 'senhaNova', problema: 'Senha nova é obrigatória.' });
  }

  if (errosObrigatorio.length > 0) {
    throw new AppError(
      'CAMPO_OBRIGATORIO',
      'Um ou mais campos obrigatórios não foram informados.',
      400,
      errosObrigatorio
    );
  }

  const senhaAtual = body.senhaAtual;
  const senhaNova = body.senhaNova;

  const usuario = usuarioRepository.buscarPorId(usuarioId);
  if (!usuario) {
    throw new AppError('USUARIO_NAO_ENCONTRADO', 'Usuário não encontrado.', 404);
  }

  const atualConfere = await compararHash(senhaAtual, usuario.senha_hash);

  if (!atualConfere) {
    throw new AppError('CREDENCIAIS_INVALIDAS', 'Senha atual incorreta.', 401);
  }

  if (senhaNova === senhaAtual) {
    throw new AppError(
      'SENHA_IGUAL_ATUAL',
      'A nova senha deve ser diferente da senha atual.',
      400
    );
  }

  const erroSenhaNova = validarSenha(senhaNova);
  if (erroSenhaNova) {
    throw new AppError('VALIDACAO', 'Existem campos inválidos na requisição.', 400, [
      erroSenhaNova,
    ]);
  }

  const novoHash = await gerarHash(senhaNova);
  usuarioRepository.atualizarSenhaHash(usuarioId, novoHash);

  return {
    mensagem: 'Senha alterada com sucesso.',
  };
}

export default {
  criar,
  obterPerfil,
  atualizarPerfil,
  alterarSenha,
};