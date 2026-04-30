import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';

const agent = request(app);

describe('GET /api/transacoes?q= — Buscar transações por descrição (US-025)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US025-01][US-025][RT-045] deve buscar por substring na descrição', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Supermercado Extra' });
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Farmácia Popular' });
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Supermercado BH' });

      const res = await agent
        .get('/api/transacoes?q=supermercado')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(2);
    });

    it('[CT-EP005-US025-02][US-025][RT-045] busca deve ser case-insensitive', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Netflix Mensal' });

      const res1 = await agent.get('/api/transacoes?q=netflix').set('Authorization', `Bearer ${token}`);
      const res2 = await agent.get('/api/transacoes?q=NETFLIX').set('Authorization', `Bearer ${token}`);

      expect(res1.body).to.have.lengthOf(1);
      expect(res2.body).to.have.lengthOf(1);
    });

    it('[CT-EP005-US025-03][US-025][RT-046] deve combinar ?q= com outros filtros', async () => {
      const { token, conta, categoriaDespesa, categoriaReceita } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { tipo: 'despesa', descricao: 'Salário extra do mês' });
      criarTransacaoNoBanco(conta.id, categoriaReceita.id, { tipo: 'receita', descricao: 'Salário mensal CLT' });

      const res = await agent
        .get('/api/transacoes?q=salário&tipo=receita')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].tipo).to.equal('receita');
    });

    it('[CT-EP005-US025-04][US-025] busca sem resultados retorna lista vazia', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Mercado' });

      const res = await agent
        .get('/api/transacoes?q=termoinexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(0);
    });

    it('[CT-EP005-US025-05][US-025][RT-074] busca retorna apenas transações do usuário', async () => {
      const user1 = await criarAmbienteTransacao(agent);
      const user2 = await criarAmbienteTransacao(agent);

      criarTransacaoNoBanco(user1.conta.id, user1.categoriaDespesa.id, { descricao: 'Mercado user1' });
      criarTransacaoNoBanco(user2.conta.id, user2.categoriaDespesa.id, { descricao: 'Mercado user2' });

      const res = await agent
        .get('/api/transacoes?q=mercado')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].descricao).to.include('user1');
    });
  });
});
