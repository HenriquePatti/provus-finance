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

describe('GET /api/categorias/:id — Consultar categoria específica (US-017)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP004-US017-01][US-017][RK-034] deve consultar categoria padrão com sucesso', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const padrao = buscarCategoriaPadrao('despesa');

      const res = await agent
        .get(`/api/categorias/${padrao.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.padrao).to.equal(true);
      expect(res.body).to.have.property('nome');
      expect(res.body).to.have.property('tipo');
    });

    it('[CT-EP004-US017-02][US-017][RK-033] deve consultar categoria personalizada própria', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Minha Cat', tipo: 'receita', icone: '🎯' });

      const res = await agent
        .get(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(cat.id);
      expect(res.body.nome).to.equal('Minha Cat');
      expect(res.body.padrao).to.equal(false);
    });
  });

  describe('Categoria não encontrada', () => {
    it('[CT-EP004-US017-03][US-017][RK-036] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .get('/api/categorias/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CATEGORIA_NAO_ENCONTRADA');
    });

    it('[CT-EP004-US017-04][US-017][RK-035] deve retornar 404 para categoria personalizada de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const catUser2 = criarCategoriaNoBanco(user2.usuario.id, { nome: 'Alheia' });

      const res = await agent
        .get(`/api/categorias/${catUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CATEGORIA_NAO_ENCONTRADA');
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP004-US017-05][US-017][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.get('/api/categorias/1');
      expect(res.status).to.equal(401);
    });
  });
});
