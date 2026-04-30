import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarContaNoBanco,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('PUT /api/contas/:id — Atualizar dados da conta (US-012)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US012-01][US-012][RC-030] deve atualizar o nome da conta', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, {
        nome: 'Nome Antigo', tipo: 'corrente', saldoInicial: 500,
      });

      const res = await agent
        .put(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Nome Novo' });

      expect(res.status).to.equal(200);
      expect(res.body.nome).to.equal('Nome Novo');
      expect(res.body.tipo).to.equal('corrente');
      expect(res.body.saldoInicial).to.equal(500);
    });

    it('[CT-EP003-US012-02][US-012][RC-034] deve retornar campo atualizadoEm na resposta', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta' });

      const res = await agent
        .put(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta Atualizada' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('atualizadoEm');
      expect(res.body.atualizadoEm).to.be.a('string');
      expect(res.body.nome).to.equal('Conta Atualizada');
    });

    it('[CT-EP003-US012-03][US-012][RC-031,RC-032] deve ignorar tipo e saldoInicial no body', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, {
        nome: 'Conta', tipo: 'corrente', saldoInicial: 1000,
      });

      const res = await agent
        .put(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta Nova', tipo: 'poupanca', saldoInicial: 5000 });

      expect(res.status).to.equal(200);
      expect(res.body.nome).to.equal('Conta Nova');
      expect(res.body.tipo).to.equal('corrente'); // Preservado
      expect(res.body.saldoInicial).to.equal(1000); // Preservado
    });
  });

  // ============================================================
  // Validações
  // ============================================================

  describe('Validações', () => {
    it('[CT-EP003-US012-04][US-012][RC-033] deve rejeitar nome vazio (400)', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta' });

      const res = await agent
        .put(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '' });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP003-US012-05][US-012] deve rejeitar body sem campo nome (400)', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta' });

      const res = await agent
        .put(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.erro.codigo).to.equal('CORPO_VAZIO');
    });
  });

  // ============================================================
  // Conta não encontrada / outro usuário
  // ============================================================

  describe('Conta não encontrada', () => {
    it('[CT-EP003-US012-06][US-012] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .put('/api/contas/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Teste' });

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });

    it('[CT-EP003-US012-07][US-012][RG-012] deve retornar 404 para conta de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const contaUser2 = criarContaNoBanco(user2.usuario.id, { nome: 'Alheia' });

      const res = await agent
        .put(`/api/contas/${contaUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ nome: 'Tentativa' });

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });
  });
});
