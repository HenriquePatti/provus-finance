import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('Seguranca — XSS em campos de texto (Issue #89)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // Melhoria de seguranca identificada na sessao exploratoria 001
  // docs/06-testes/sessoes-exploratorias/sessao-001-seguranca-xss.md
  //
  // Classificacao: MELHORIA (nao bug)
  // Justificativa: nenhuma regra de negocio (RU/RC/RK/RT/RG), user story
  // ou criterio de aceitacao especifica sanitizacao de HTML.
  // A API armazena texto e devolve texto — comportamento correto conforme
  // especificado. O risco de XSS so se materializa quando houver frontend
  // (Fase 7) renderizando campos sem escape.
  //
  // Testes marcados como skip ate implementacao da melhoria.
  // Refs: Issue #89

  it.skip('[MELHORIA][RG-004] POST /api/usuarios deve rejeitar tags HTML no nome', async () => {
    const res = await agent
      .post('/api/usuarios')
      .send({
        nome: '<script>alert(1)</script>',
        email: 'xss@teste.local',
        senha: 'SenhaForte1',
      });

    expect(res.status).to.equal(400);
    expect(res.body.erro.detalhes[0].campo).to.equal('nome');
  });

  it.skip('[MELHORIA][RG-004] POST /api/transacoes deve rejeitar tags HTML na descricao', async () => {
    const { token, usuario } = await criarUsuarioAutenticado(agent);

    // Criar conta
    const conta = await agent
      .post('/api/contas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Conta', tipo: 'corrente', saldoInicial: 1000 });

    // Buscar categoria
    const cats = await agent
      .get('/api/categorias')
      .set('Authorization', `Bearer ${token}`);
    const catId = cats.body.find((c) => c.tipo === 'despesa').id;

    const res = await agent
      .post('/api/transacoes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'despesa',
        valor: 100,
        descricao: '<img src=x onerror=alert(1)>',
        dataTransacao: '2026-04-30',
        contaId: conta.body.id,
        categoriaId: catId,
      });

    expect(res.status).to.equal(400);
    expect(res.body.erro.detalhes[0].campo).to.equal('descricao');
  });

  it.skip('[MELHORIA][RG-004] POST /api/contas deve rejeitar tags HTML no nome', async () => {
    const { token } = await criarUsuarioAutenticado(agent);

    const res = await agent
      .post('/api/contas')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: '<div onmouseover=alert(1)>Conta</div>', tipo: 'corrente' });

    expect(res.status).to.equal(400);
    expect(res.body.erro.detalhes[0].campo).to.equal('nome');
  });

  it.skip('[MELHORIA][RG-004] POST /api/categorias deve rejeitar tags HTML no nome', async () => {
    const { token } = await criarUsuarioAutenticado(agent);

    const res = await agent
      .post('/api/categorias')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: '<script>alert(1)</script>', tipo: 'despesa' });

    expect(res.status).to.equal(400);
    expect(res.body.erro.detalhes[0].campo).to.equal('nome');
  });
});
