import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';

const agent = request(app);

describe('DELETE /api/transacoes/:id — Excluir transação (US-024)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US024-01][US-024][RT-060,RT-064] deve excluir transação e retornar 204', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id);

      const res = await agent
        .delete(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
      expect(res.body).to.be.empty;

      // Confirma remoção
      const consulta = await agent
        .get(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(consulta.status).to.equal(404);
    });

    it('[CT-EP005-US024-02][US-024][RT-065,RT-068] saldo deve ser recalculado após exclusão de despesa', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { valor: 200 });

      // Saldo antes: 5000 - 200 = 4800
      const antes = await agent.get(`/api/contas/${conta.id}/saldo`).set('Authorization', `Bearer ${token}`);
      expect(antes.body.saldoCalculado).to.equal(4800);

      await agent.delete(`/api/transacoes/${trans.id}`).set('Authorization', `Bearer ${token}`);

      // Saldo depois: volta a 5000
      const depois = await agent.get(`/api/contas/${conta.id}/saldo`).set('Authorization', `Bearer ${token}`);
      expect(depois.body.saldoCalculado).to.equal(5000);
    });

    it('[CT-EP005-US024-03][US-024][RT-065] saldo deve ser recalculado após exclusão de receita', async () => {
      const { token, conta, categoriaReceita } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaReceita.id, { tipo: 'receita', valor: 500 });

      // Saldo antes: 5000 + 500 = 5500
      const antes = await agent.get(`/api/contas/${conta.id}/saldo`).set('Authorization', `Bearer ${token}`);
      expect(antes.body.saldoCalculado).to.equal(5500);

      await agent.delete(`/api/transacoes/${trans.id}`).set('Authorization', `Bearer ${token}`);

      // Saldo depois: volta a 5000
      const depois = await agent.get(`/api/contas/${conta.id}/saldo`).set('Authorization', `Bearer ${token}`);
      expect(depois.body.saldoCalculado).to.equal(5000);
    });
  });

  describe('Erros', () => {
    it('[CT-EP005-US024-04][US-024] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarAmbienteTransacao(agent);

      const res = await agent
        .delete('/api/transacoes/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
    });

    it('[CT-EP005-US024-05][US-024][RT-062] deve retornar 404 para transação de outro usuário', async () => {
      const user1 = await criarAmbienteTransacao(agent);
      const user2 = await criarAmbienteTransacao(agent);

      const trans = criarTransacaoNoBanco(user2.conta.id, user2.categoriaDespesa.id);

      const res = await agent
        .delete(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP005-US024-06][US-024][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.delete('/api/transacoes/1');
      expect(res.status).to.equal(401);
    });
  });
});
