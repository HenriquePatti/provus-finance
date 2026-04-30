import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarContaNoBanco,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('GET /api/contas/:id — Consultar conta específica (US-011)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US011-01][US-011][RC-020] deve retornar conta com saldoCalculado', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, {
        nome: 'Nubank', tipo: 'corrente', saldoInicial: 1500,
      });

      const res = await agent
        .get(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(conta.id);
      expect(res.body.nome).to.equal('Nubank');
      expect(res.body.tipo).to.equal('corrente');
      expect(res.body.saldoInicial).to.equal(1500);
      expect(res.body).to.have.property('saldoCalculado');
      expect(res.body.saldoCalculado).to.equal(1500); // Sem transações = saldo inicial
      expect(res.body).to.have.property('criadoEm');
      expect(res.body).to.have.property('atualizadoEm');
    });
  });

  // ============================================================
  // Conta não encontrada
  // ============================================================

  describe('Conta não encontrada', () => {
    it('[CT-EP003-US011-02][US-011][RC-022] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .get('/api/contas/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });

    it('[CT-EP003-US011-03][US-011][RC-022,RG-012] deve retornar 404 para conta de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const contaUser2 = criarContaNoBanco(user2.usuario.id, { nome: 'Conta Alheia' });

      const res = await agent
        .get(`/api/contas/${contaUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });
  });

  // ============================================================
  // Autenticação
  // ============================================================

  describe('Autenticação', () => {
    it('[CT-EP003-US011-04][US-011][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/contas/1');

      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
