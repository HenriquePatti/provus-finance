import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarCategoriaNoBanco,
} from '../../fixtures/categorias.fixtures.js';

const agent = request(app);

describe('GET /api/categorias — Listar categorias disponíveis (US-015)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP004-US015-01][US-015][RK-027] deve listar categorias padrão + personalizadas do usuário', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarCategoriaNoBanco(usuario.id, { nome: 'Minha Categoria', tipo: 'despesa' });

      const res = await agent
        .get('/api/categorias')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');

      const padrao = res.body.filter((c) => c.padrao === true);
      const personalizada = res.body.filter((c) => c.padrao === false);

      expect(padrao.length).to.be.greaterThan(0);
      expect(personalizada).to.have.lengthOf(1);
      expect(personalizada[0].nome).to.equal('Minha Categoria');
    });

    it('[CT-EP004-US015-02][US-015][RK-028] categorias padrão aparecem primeiro, ordenadas por nome', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .get('/api/categorias')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      // Primeira categoria deve ser padrão
      expect(res.body[0].padrao).to.equal(true);
    });

    it('[CT-EP004-US015-03][US-015][RK-029] deve filtrar por tipo (inclui tipo ambos)', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarCategoriaNoBanco(usuario.id, { nome: 'Cat Ambos', tipo: 'ambos' });

      const res = await agent
        .get('/api/categorias?tipo=despesa')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      res.body.forEach((c) => {
        expect(['despesa', 'ambos']).to.include(c.tipo);
      });
    });

    it('[CT-EP004-US015-04][US-015][RK-030] deve filtrar por origem=padrao', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarCategoriaNoBanco(usuario.id, { nome: 'Personalizada', tipo: 'despesa' });

      const res = await agent
        .get('/api/categorias?origem=padrao')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      res.body.forEach((c) => expect(c.padrao).to.equal(true));
    });

    it('[CT-EP004-US015-05][US-015][RK-030] deve filtrar por origem=personalizada', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarCategoriaNoBanco(usuario.id, { nome: 'Minha', tipo: 'receita' });

      const res = await agent
        .get('/api/categorias?origem=personalizada')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      res.body.forEach((c) => expect(c.padrao).to.equal(false));
    });
  });

  describe('Isolamento', () => {
    it('[CT-EP004-US015-06][US-015][RK-003] não deve listar categorias personalizadas de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      criarCategoriaNoBanco(user2.usuario.id, { nome: 'Categoria do User 2', tipo: 'despesa' });

      const res = await agent
        .get('/api/categorias?origem=personalizada')
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(0);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP004-US015-07][US-015][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/categorias');
      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
