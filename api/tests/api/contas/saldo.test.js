import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarContaNoBanco,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('GET /api/contas/:id/saldo — Consultar saldo calculado (US-014)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US014-01][US-014][RC-052] conta sem transações retorna saldoInicial', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, {
        nome: 'Nubank', tipo: 'corrente', saldoInicial: 2500,
      });

      const res = await agent
        .get(`/api/contas/${conta.id}/saldo`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.contaId).to.equal(conta.id);
      expect(res.body.nome).to.equal('Nubank');
      expect(res.body.saldoCalculado).to.equal(2500);
    });

    it('[CT-EP003-US014-02][US-014][RC-052] conta com saldoInicial = 0 retorna 0', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, {
        nome: 'Conta Zerada', tipo: 'dinheiro', saldoInicial: 0,
      });

      const res = await agent
        .get(`/api/contas/${conta.id}/saldo`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.saldoCalculado).to.equal(0);
    });
  });

  // ============================================================
  // Conta não encontrada
  // ============================================================

  describe('Conta não encontrada', () => {
    it('[CT-EP003-US014-03][US-014] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .get('/api/contas/99999/saldo')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });

    it('[CT-EP003-US014-04][US-014][RG-012] deve retornar 404 para conta de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const contaUser2 = criarContaNoBanco(user2.usuario.id, { saldoInicial: 1000 });

      const res = await agent
        .get(`/api/contas/${contaUser2.id}/saldo`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });
  });

  // ============================================================
  // Autenticação
  // ============================================================

  describe('Autenticação', () => {
    it('[CT-EP003-US014-05][US-014][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/contas/1/saldo');

      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
