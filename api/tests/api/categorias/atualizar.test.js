import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarCategoriaNoBanco,
  buscarCategoriaPadrao,
} from '../../fixtures/categorias.fixtures.js';

const agent = request(app);

describe('PUT /api/categorias/:id — Atualizar categoria personalizada (US-018)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP004-US018-01][US-018][RK-038] deve atualizar nome da categoria', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Nome Antigo', tipo: 'despesa' });

      const res = await agent
        .put(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Nome Novo' });

      expect(res.status).to.equal(200);
      expect(res.body.nome).to.equal('Nome Novo');
      expect(res.body.tipo).to.equal('despesa'); // Imutável
    });

    it('[CT-EP004-US018-02][US-018][RK-038] deve atualizar ícone da categoria', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Cat', icone: '🎯' });

      const res = await agent
        .put(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ icone: '🎮' });

      expect(res.status).to.equal(200);
      expect(res.body.icone).to.equal('🎮');
    });

    it('[CT-EP004-US018-03][US-018][RK-042] deve permitir remover ícone com null', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Cat', icone: '🎯' });

      const res = await agent
        .put(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ icone: null });

      expect(res.status).to.equal(200);
      expect(res.body.icone).to.equal(null);
    });
  });

  describe('Proteção de categorias padrão', () => {
    it('[CT-EP004-US018-04][US-018][RK-049] deve retornar 403 ao tentar editar categoria padrão', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const padrao = buscarCategoriaPadrao();

      const res = await agent
        .put(`/api/categorias/${padrao.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Tentativa' });

      expect(res.status).to.equal(403);
      expect(res.body.erro.codigo).to.equal('ACESSO_NEGADO');
    });
  });

  describe('Validações', () => {
    it('[CT-EP004-US018-05][US-018] deve rejeitar body vazio (400)', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Cat' });

      const res = await agent
        .put(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.erro.codigo).to.equal('CORPO_VAZIO');
    });

    it('[CT-EP004-US018-06][US-018][RK-041] deve rejeitar nome vazio (400)', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Cat' });

      const res = await agent
        .put(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '' });

      expect(res.status).to.equal(400);
    });
  });

  describe('Categoria não encontrada', () => {
    it('[CT-EP004-US018-07][US-018] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .put('/api/categorias/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Teste' });

      expect(res.status).to.equal(404);
    });

    it('[CT-EP004-US018-08][US-018][RK-037] deve retornar 404 para categoria de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const catUser2 = criarCategoriaNoBanco(user2.usuario.id, { nome: 'Alheia' });

      const res = await agent
        .put(`/api/categorias/${catUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ nome: 'Tentativa' });

      expect(res.status).to.equal(404);
    });
  });
});
