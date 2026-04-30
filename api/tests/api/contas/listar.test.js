import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarContaNoBanco,
} from '../../fixtures/contas.fixtures.js';
import contaRepository from '../../../src/repositories/conta.repository.js';

const agent = request(app);

describe('GET /api/contas — Listar contas do usuário (US-010)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US010-01][US-010][RC-010] deve listar apenas contas ativas do usuário', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarContaNoBanco(usuario.id, { nome: 'Conta A', tipo: 'corrente' });
      criarContaNoBanco(usuario.id, { nome: 'Conta B', tipo: 'poupanca' });

      const res = await agent
        .get('/api/contas')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('nome');
      expect(res.body[0]).to.have.property('tipo');
      expect(res.body[0]).to.have.property('saldoInicial');
      expect(res.body[0].ativo).to.equal(true);
    });

    it('[CT-EP003-US010-02][US-010][RC-011] não deve listar contas inativas por padrão', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta Inativa' });
      contaRepository.desativar(conta.id);
      criarContaNoBanco(usuario.id, { nome: 'Conta Ativa' });

      const res = await agent
        .get('/api/contas')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].nome).to.equal('Conta Ativa');
    });

    it('[CT-EP003-US010-03][US-010][RC-012] deve listar contas inativas com ?ativo=false', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta Desativada' });
      contaRepository.desativar(conta.id);

      const res = await agent
        .get('/api/contas?ativo=false')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].ativo).to.equal(false);
    });

    it('[CT-EP003-US010-04][US-010][RC-013] deve filtrar por tipo', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarContaNoBanco(usuario.id, { tipo: 'corrente' });
      criarContaNoBanco(usuario.id, { tipo: 'poupanca' });
      criarContaNoBanco(usuario.id, { tipo: 'corrente' });

      const res = await agent
        .get('/api/contas?tipo=corrente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(2);
      res.body.forEach((c) => expect(c.tipo).to.equal('corrente'));
    });

    it('[CT-EP003-US010-05][US-010] deve retornar lista vazia quando sem contas', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .get('/api/contas')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(0);
    });
  });

  // ============================================================
  // Isolamento entre usuários
  // ============================================================

  describe('Isolamento', () => {
    it('[CT-EP003-US010-06][US-010][RG-012] não deve listar contas de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      criarContaNoBanco(user1.usuario.id, { nome: 'Conta do User 1' });
      criarContaNoBanco(user2.usuario.id, { nome: 'Conta do User 2' });

      const res = await agent
        .get('/api/contas')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].nome).to.equal('Conta do User 1');
    });
  });

  // ============================================================
  // Autenticação
  // ============================================================

  describe('Autenticação', () => {
    it('[CT-EP003-US010-07][US-010][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/contas');

      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
