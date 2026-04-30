import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';

const agent = request(app);

describe('GET /api/transacoes/:id — Consultar transação específica (US-022)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US022-01][US-022][RT-049] deve retornar transação com todos os campos', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { descricao: 'Mercado', valor: 250.50 });

      const res = await agent
        .get(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(trans.id);
      expect(res.body.descricao).to.equal('Mercado');
      expect(res.body.valor).to.equal(250.50);
      expect(res.body).to.have.property('tipo');
      expect(res.body).to.have.property('dataTransacao');
      expect(res.body).to.have.property('contaId');
      expect(res.body).to.have.property('categoriaId');
      expect(res.body).to.have.property('criadoEm');
    });
  });

  describe('Transação não encontrada', () => {
    it('[CT-EP005-US022-02][US-022][RT-051] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarAmbienteTransacao(agent);

      const res = await agent
        .get('/api/transacoes/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('TRANSACAO_NAO_ENCONTRADA');
    });

    it('[CT-EP005-US022-03][US-022][RT-050] deve retornar 404 para transação de outro usuário', async () => {
      const user1 = await criarAmbienteTransacao(agent);
      const user2 = await criarAmbienteTransacao(agent);

      const trans = criarTransacaoNoBanco(user2.conta.id, user2.categoriaDespesa.id);

      const res = await agent
        .get(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP005-US022-04][US-022][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/transacoes/1');
      expect(res.status).to.equal(401);
    });
  });
});
