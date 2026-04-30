import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';

const agent = request(app);

describe('PUT /api/transacoes/:id — Atualizar transação (US-023)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US023-01][US-023][RT-053] deve atualizar valor e descrição', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { valor: 100, descricao: 'Original' });

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ valor: 200, descricao: 'Atualizada' });

      expect(res.status).to.equal(200);
      expect(res.body.valor).to.equal(200);
      expect(res.body.descricao).to.equal('Atualizada');
    });

    it('[CT-EP005-US023-02][US-023][RT-034] deve permitir alterar categoriaId', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id);

      // Busca outra categoria de despesa padrão
      const listaRes = await agent
        .get('/api/categorias?tipo=despesa&origem=padrao')
        .set('Authorization', `Bearer ${token}`);
      const outraCategoria = listaRes.body.find((c) => c.id !== categoriaDespesa.id);

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ categoriaId: outraCategoria.id });

      expect(res.status).to.equal(200);
      expect(res.body.categoriaId).to.equal(outraCategoria.id);
    });

    it('[CT-EP005-US023-03][US-023][RT-054] tipo e contaId devem permanecer imutáveis', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { tipo: 'despesa' });

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ valor: 300 });

      expect(res.status).to.equal(200);
      expect(res.body.tipo).to.equal('despesa');
      expect(res.body.contaId).to.equal(conta.id);
    });

    it('[CT-EP005-US023-04][US-023][RT-059] saldo deve refletir valor atualizado', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { valor: 100 });

      await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ valor: 500 });

      const saldoRes = await agent
        .get(`/api/contas/${conta.id}/saldo`)
        .set('Authorization', `Bearer ${token}`);

      expect(saldoRes.body.saldoCalculado).to.equal(4500); // 5000 - 500
    });
  });

  describe('Validações', () => {
    it('[CT-EP005-US023-05][US-023] deve rejeitar body vazio (400)', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id);

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.erro.codigo).to.equal('CORPO_VAZIO');
    });

    it('[CT-EP005-US023-06][US-023][RT-033] deve rejeitar categoria incompatível (422)', async () => {
      const { token, conta, categoriaDespesa, categoriaReceita } = await criarAmbienteTransacao(agent);
      const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { tipo: 'despesa' });

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ categoriaId: categoriaReceita.id });

      expect(res.status).to.equal(422);
      expect(res.body.erro.codigo).to.equal('CATEGORIA_INCOMPATIVEL');
    });
  });

  describe('Transação não encontrada', () => {
    it('[CT-EP005-US023-07][US-023] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarAmbienteTransacao(agent);

      const res = await agent
        .put('/api/transacoes/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ valor: 100 });

      expect(res.status).to.equal(404);
    });

    it('[CT-EP005-US023-08][US-023] deve retornar 404 para transação de outro usuário', async () => {
      const user1 = await criarAmbienteTransacao(agent);
      const user2 = await criarAmbienteTransacao(agent);

      const trans = criarTransacaoNoBanco(user2.conta.id, user2.categoriaDespesa.id);

      const res = await agent
        .put(`/api/transacoes/${trans.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ valor: 999 });

      expect(res.status).to.equal(404);
    });
  });
});
