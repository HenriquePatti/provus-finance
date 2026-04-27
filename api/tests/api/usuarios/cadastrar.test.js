import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  gerarUsuarioValido,
  gerarUsuarioComEspacos,
  gerarUsuarioEmailCaixaMista,
  gerarNomeApenasNumeros,
  gerarEmailFormatoInvalido,
  gerarEmailMuitoLongo,
  gerarSenhaMuitoCurta,
  gerarSenhaSemMaiuscula,
  gerarSenhaSemMinuscula,
  gerarSenhaSemNumero,
} from '../../fixtures/usuarios.fixtures.js';

describe('POST /api/usuarios — Cadastrar novo usuário', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP001-US001-01][US-001][RU-001,RU-002] deve criar usuário com dados válidos', async () => {
      const usuario = gerarUsuarioValido();

      const response = await request(app)
        .post('/api/usuarios')
        .send(usuario);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.nome).to.equal(usuario.nome);
      expect(response.body.email).to.equal(usuario.email);
      expect(response.body).to.have.property('criadoEm');
      expect(response.body).to.have.property('atualizadoEm');
    });

    it('[CT-EP001-US001-01][RG-004] não deve expor senha na resposta', async () => {
      const usuario = gerarUsuarioValido();

      const response = await request(app)
        .post('/api/usuarios')
        .send(usuario);

      expect(response.status).to.equal(201);
      expect(response.body).to.not.have.property('senha');
      expect(response.body).to.not.have.property('senha_hash');
      expect(response.body).to.not.have.property('senhaHash');
    });
  });

  // ============================================================
  // Conflito de e-mail
  // ============================================================

  describe('Conflito de e-mail', () => {
    it('[CT-EP001-US001-02][US-001][RU-003] deve retornar 409 para e-mail já cadastrado', async () => {
      const usuario = gerarUsuarioValido();

      // primeiro cadastro
      await request(app).post('/api/usuarios').send(usuario);

      // tentativa de duplicar (mesmo e-mail)
      const response = await request(app)
        .post('/api/usuarios')
        .send(usuario);

      expect(response.status).to.equal(409);
      expect(response.body.erro.codigo).to.equal('EMAIL_JA_CADASTRADO');
    });
  });

  // ============================================================
  // Campos obrigatórios ausentes
  // ============================================================

  describe('Campos obrigatórios ausentes', () => {
    it('[CT-EP001-US001-03][US-001][RU-001,RG-014] deve retornar 400 quando nome ausente', async () => {
      const { nome, ...semNome } = gerarUsuarioValido();

      const response = await request(app).post('/api/usuarios').send(semNome);

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.be.oneOf(['CAMPO_OBRIGATORIO', 'VALIDACAO']);
      expect(response.body.erro.detalhes).to.be.an('array');
      expect(response.body.erro.detalhes.some((d) => d.campo === 'nome')).to.be.true;
    });

    it('[CT-EP001-US001-04][US-001][RU-001,RG-014] deve retornar 400 quando email ausente', async () => {
      const { email, ...semEmail } = gerarUsuarioValido();

      const response = await request(app).post('/api/usuarios').send(semEmail);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'email')).to.be.true;
    });

    it('[CT-EP001-US001-05][US-001][RU-001,RG-014] deve retornar 400 quando senha ausente', async () => {
      const { senha, ...semSenha } = gerarUsuarioValido();

      const response = await request(app).post('/api/usuarios').send(semSenha);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });
  });

  // ============================================================
  // Validações de e-mail
  // ============================================================

  describe('Validação de e-mail', () => {
    it('[CT-EP001-US001-06][US-001][RU-008,RU-011] deve retornar 400 para e-mail com formato inválido', async () => {
      const usuario = gerarUsuarioValido({ email: gerarEmailFormatoInvalido() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'email')).to.be.true;
    });

    it('[CT-EP001-US001-07][US-001][RU-009] deve retornar 400 para e-mail acima de 254 caracteres', async () => {
      const usuario = gerarUsuarioValido({ email: gerarEmailMuitoLongo() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'email')).to.be.true;
    });
  });

  // ============================================================
  // Validações de senha
  // ============================================================

  describe('Validação de senha', () => {
    it('[CT-EP001-US001-08][US-001][RU-012] deve retornar 400 para senha menor que 8 caracteres', async () => {
      const usuario = gerarUsuarioValido({ senha: gerarSenhaMuitoCurta() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });

    it('[CT-EP001-US001-09][US-001][RU-014] deve retornar 400 para senha sem letra maiúscula', async () => {
      const usuario = gerarUsuarioValido({ senha: gerarSenhaSemMaiuscula() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });

    it('[CT-EP001-US001-10][US-001][RU-014] deve retornar 400 para senha sem letra minúscula', async () => {
      const usuario = gerarUsuarioValido({ senha: gerarSenhaSemMinuscula() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });

    it('[CT-EP001-US001-11][US-001][RU-014] deve retornar 400 para senha sem número', async () => {
      const usuario = gerarUsuarioValido({ senha: gerarSenhaSemNumero() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });
  });

  // ============================================================
  // Normalização
  // ============================================================

  describe('Normalização de dados', () => {
    it('[CT-EP001-US001-12][US-001][RU-010,RG-020] deve normalizar e-mail para minúsculas', async () => {
      const usuario = gerarUsuarioEmailCaixaMista();

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(201);
      expect(response.body.email).to.equal(usuario.email.toLowerCase().trim());
    });

    it('[CT-EP001-US001-13][US-001][RU-020,RG-016] deve normalizar espaços no nome', async () => {
      const usuario = gerarUsuarioComEspacos();

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(201);
      // não deve conter múltiplos espaços consecutivos
      expect(response.body.nome).to.not.match(/\s{2,}/);
      // não deve começar ou terminar com espaço
      expect(response.body.nome.trim()).to.equal(response.body.nome);
    });
  });

  // ============================================================
  // Validações de nome
  // ============================================================

  describe('Validação de nome', () => {
    it('[CT-EP001-US001-14][US-001][RU-019] deve retornar 400 para nome apenas com números', async () => {
      const usuario = gerarUsuarioValido({ nome: gerarNomeApenasNumeros() });

      const response = await request(app).post('/api/usuarios').send(usuario);

      expect(response.status).to.equal(400);
      expect(response.body.erro.detalhes.some((d) => d.campo === 'nome')).to.be.true;
    });
  });
});