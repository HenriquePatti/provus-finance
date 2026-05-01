import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarAmbienteTransacao,
  criarTransacaoNoBanco,
} from '../../fixtures/transacoes.fixtures.js';
import contaRepository from '../../../src/repositories/conta.repository.js';

const agent = request(app);

describe('Regra de Negocio — Transacao em conta inativa (Issue #90)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // Bug encontrado na sessao exploratoria 002
  // docs/06-testes/sessoes-exploratorias/sessao-002-regras-conta-inativa.md
  // Regra: RT-057

  it.skip('[BUG-002][RT-057] PUT /api/transacoes/:id deve rejeitar atualizacao em conta inativa (422)', async () => {
    const { token, conta, categoriaDespesa } = await criarAmbienteTransacao(agent);
    const trans = criarTransacaoNoBanco(conta.id, categoriaDespesa.id, { valor: 50 });

    // Desativar a conta
    contaRepository.desativar(conta.id);

    // Tentar atualizar transacao da conta inativa
    const res = await agent
      .put(`/api/transacoes/${trans.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ valor: 999 });

    expect(res.status).to.equal(422);
    expect(res.body.erro.codigo).to.equal('CONTA_INATIVA');
  });
});
