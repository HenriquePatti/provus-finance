import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  gerarTransacaoValida,
  criarAmbienteTransacao,
} from '../../fixtures/transacoes.fixtures.js';
import contaRepository from '../../../src/repositories/conta.repository.js';

const agent = request(app);

describe('POST /api/transacoes — Registrar nova transação (US-020)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP005-US020-01][US-020][RT-004,RT-007] deve criar despesa com dados válidos', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      const dados = gerarTransacaoValida(conta.id, categoriaDespesa.id);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send(dados);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.tipo).to.equal('despesa');
      expect(res.body.valor).to.equal(dados.valor);
      expect(res.body.contaId).to.equal(conta.id);
      expect(res.body.categoriaId).to.equal(categoriaDespesa.id);
      expect(res.body).to.have.property('criadoEm');
    });

    it('[CT-EP005-US020-02][US-020][RT-001] deve criar receita com dados válidos', async () => {
      const { token, conta, categoriaReceita } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tipo: 'receita',
          valor: 3000,
          descricao: 'Salário mensal',
          dataTransacao: '2026-04-30',
          contaId: conta.id,
          categoriaId: categoriaReceita.id,
        });

      expect(res.status).to.equal(201);
      expect(res.body.tipo).to.equal('receita');
      expect(res.body.valor).to.equal(3000);
    });

    it('[CT-EP005-US020-03][US-020][RT-066] deve impactar saldo calculado da conta', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);

      await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tipo: 'despesa', valor: 200, descricao: 'Mercado',
          dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaDespesa.id,
        });

      const saldoRes = await agent
        .get(`/api/contas/${conta.id}/saldo`)
        .set('Authorization', `Bearer ${token}`);

      expect(saldoRes.body.saldoCalculado).to.equal(4800); // 5000 - 200
    });
  });

  describe('Validações de campos', () => {
    it('[CT-EP005-US020-04][US-020][RT-013] deve rejeitar valor <= 0', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 0, descricao: 'Teste', dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP005-US020-05][US-020][RT-009] deve rejeitar tipo inválido', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'invalido', valor: 100, descricao: 'Teste', dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP005-US020-06][US-020][RT-019] deve rejeitar descrição vazia', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 100, descricao: '', dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP005-US020-07][US-020][RT-025] deve rejeitar data inválida', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 100, descricao: 'Teste', dataTransacao: 'nao-e-data', contaId: conta.id, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(400);
    });
  });

  describe('Validações de relacionamento', () => {
    it('[CT-EP005-US020-08][US-020][RT-028] deve rejeitar conta inexistente (404)', async () => {
      const { token, categoriaDespesa } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 100, descricao: 'Teste', dataTransacao: '2026-04-30', contaId: 99999, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });

    it('[CT-EP005-US020-09][US-020][RK-005] deve rejeitar categoria incompatível (422)', async () => {
      const { token, conta, categoriaReceita } = await criarAmbienteTransacao(agent);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 100, descricao: 'Teste', dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaReceita.id });

      expect(res.status).to.equal(422);
      expect(res.body.erro.codigo).to.equal('CATEGORIA_INCOMPATIVEL');
    });

    it('[CT-EP005-US020-10][US-020][RT-029] deve rejeitar conta inativa (422)', async () => {
      const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
      contaRepository.desativar(conta.id);

      const res = await agent
        .post('/api/transacoes')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa', valor: 100, descricao: 'Teste', dataTransacao: '2026-04-30', contaId: conta.id, categoriaId: categoriaDespesa.id });

      expect(res.status).to.equal(422);
      expect(res.body.erro.codigo).to.equal('CONTA_INATIVA');
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP005-US020-11][US-020][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.post('/api/transacoes').send({ tipo: 'despesa', valor: 100 });
      expect(res.status).to.equal(401);
    });
  });
});
