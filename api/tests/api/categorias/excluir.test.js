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

describe('DELETE /api/categorias/:id — Excluir categoria personalizada (US-019)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP004-US019-01][US-019][RK-045,RK-047] deve excluir categoria sem transações e retornar 204', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const cat = criarCategoriaNoBanco(usuario.id, { nome: 'Para Excluir', tipo: 'despesa' });

      const res = await agent
        .delete(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
      expect(res.body).to.be.empty;

      // Confirma que foi removida
      const consulta = await agent
        .get(`/api/categorias/${cat.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(consulta.status).to.equal(404);
    });
  });

  describe('Proteção de categorias padrão', () => {
    it('[CT-EP004-US019-02][US-019][RK-044] deve retornar 403 ao tentar excluir categoria padrão', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const padrao = buscarCategoriaPadrao();

      const res = await agent
        .delete(`/api/categorias/${padrao.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(403);
      expect(res.body.erro.codigo).to.equal('ACESSO_NEGADO');
    });
  });

  describe('Erros', () => {
    it('[CT-EP004-US019-03][US-019] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .delete('/api/categorias/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CATEGORIA_NAO_ENCONTRADA');
    });

    it('[CT-EP004-US019-04][US-019][RK-044] deve retornar 404 para categoria de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const catUser2 = criarCategoriaNoBanco(user2.usuario.id, { nome: 'Alheia' });

      const res = await agent
        .delete(`/api/categorias/${catUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP004-US019-05][US-019][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.delete('/api/categorias/1');
      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
