import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';

const agent = request(app);

describe('GET /api/transacoes — Listar transações com filtros (US-021)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US021-01][US-021][RT-036] deve listar transações do usuário', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Trans A' });
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Trans B' });

      const res = await agent
        .get('/api/transacoes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
    });

    it('[CT-EP005-US021-02][US-021][RT-041] deve filtrar por tipo', async () => {
      const { token, conta, categoriaDespesa, categoriaReceita } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { tipo: 'despesa' });
      criarTransacaoNoBanco(conta.id, categoriaReceita.id, { tipo: 'receita' });

      const res = await agent
        .get('/api/transacoes?tipo=despesa')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].tipo).to.equal('despesa');
    });

    it('[CT-EP005-US021-03][US-021][RT-044] deve filtrar por intervalo de datas', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { dataTransacao: '2026-01-15' });
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { dataTransacao: '2026-03-20' });
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { dataTransacao: '2026-04-25' });

      const res = await agent
        .get('/api/transacoes?dataInicio=2026-03-01&dataFim=2026-03-31')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
    });

    it('[CT-EP005-US021-04][US-021] deve retornar lista vazia sem transações', async () => {
      const { token } = await criarAmbienteTransacao(agent);

      const res = await agent
        .get('/api/transacoes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('Isolamento', () => {
    it('[CT-EP005-US021-05][US-021][RT-074] não deve listar transações de outro usuário', async () => {
      const user1 = await criarAmbienteTransacao(agent);
      const user2 = await criarAmbienteTransacao(agent);

      criarTransacaoNoBanco(user2.conta.id, user2.categoriaDespesa.id, { descricao: 'Alheia' });

      const res = await agent
        .get('/api/transacoes')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(0);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP005-US021-06][US-021][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/transacoes');
      expect(res.status).to.equal(401);
    });
  });
});
