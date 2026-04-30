import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  gerarContaValida,
  criarUsuarioAutenticado,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('POST /api/contas — Criar nova conta (US-009)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US009-01][US-009][RC-001,RC-002] deve criar conta com dados válidos', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const conta = gerarContaValida();

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send(conta);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.nome).to.equal(conta.nome);
      expect(res.body.tipo).to.equal(conta.tipo);
      expect(res.body.saldoInicial).to.equal(conta.saldoInicial);
      expect(res.body.ativo).to.equal(true);
      expect(res.body).to.have.property('criadoEm');
      expect(res.body).to.have.property('atualizadoEm');
    });

    it('[CT-EP003-US009-02][US-009][RC-003] deve aceitar saldoInicial = 0 (padrão)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const conta = gerarContaValida({ saldoInicial: 0 });

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send(conta);

      expect(res.status).to.equal(201);
      expect(res.body.saldoInicial).to.equal(0);
    });

    it('[CT-EP003-US009-03][US-009][RC-003] deve usar saldoInicial = 0 quando campo não informado', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta Teste', tipo: 'corrente' });

      expect(res.status).to.equal(201);
      expect(res.body.saldoInicial).to.equal(0);
    });

    it('[CT-EP003-US009-04][US-009][RC-002] deve aceitar todos os 5 tipos válidos', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const tipos = ['corrente', 'poupanca', 'carteira_digital', 'dinheiro', 'investimento'];

      for (const tipo of tipos) {
        const res = await agent
          .post('/api/contas')
          .set('Authorization', `Bearer ${token}`)
          .send({ nome: `Conta ${tipo}`, tipo, saldoInicial: 100 });

        expect(res.status).to.equal(201);
        expect(res.body.tipo).to.equal(tipo);
      }
    });
  });

  // ============================================================
  // Validações
  // ============================================================

  describe('Validações', () => {
    it('[CT-EP003-US009-05][US-009][RC-006] deve rejeitar nome ausente (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'corrente', saldoInicial: 100 });

      expect(res.status).to.equal(400);
      expect(res.body.erro.detalhes).to.deep.include({ campo: 'nome', problema: 'Nome é obrigatório.' });
    });

    it('[CT-EP003-US009-06][US-009][RC-002] deve rejeitar tipo inválido (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta', tipo: 'invalido', saldoInicial: 100 });

      expect(res.status).to.equal(400);
      expect(res.body.erro.detalhes).to.be.an('array');
      expect(res.body.erro.detalhes[0].campo).to.equal('tipo');
    });

    it('[CT-EP003-US009-07][US-009][RC-003] deve rejeitar saldoInicial negativo (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta', tipo: 'corrente', saldoInicial: -100 });

      expect(res.status).to.equal(400);
      expect(res.body.erro.detalhes[0].campo).to.equal('saldoInicial');
    });

    it('[CT-EP003-US009-08][US-009] deve rejeitar tipo ausente (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/contas')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Conta', saldoInicial: 100 });

      expect(res.status).to.equal(400);
      expect(res.body.erro.detalhes[0].campo).to.equal('tipo');
    });
  });

  // ============================================================
  // Autenticação
  // ============================================================

  describe('Autenticação', () => {
    it('[CT-EP003-US009-09][US-009][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent
        .post('/api/contas')
        .send(gerarContaValida());

      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
