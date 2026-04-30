import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  gerarCategoriaValida,
  criarUsuarioAutenticado,
} from '../../fixtures/categorias.fixtures.js';

const agent = request(app);

describe('POST /api/categorias — Criar categoria personalizada (US-016)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz', () => {
    it('[CT-EP004-US016-01][US-016][RK-010,RK-012] deve criar categoria com dados válidos', async () => {
      const { token } = await criarUsuarioAutenticado(agent);
      const cat = gerarCategoriaValida();

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send(cat);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body.nome).to.equal(cat.nome);
      expect(res.body.tipo).to.equal(cat.tipo);
      expect(res.body.icone).to.equal(cat.icone);
      expect(res.body.padrao).to.equal(false);
      expect(res.body).to.have.property('criadoEm');
    });

    it('[CT-EP004-US016-02][US-016][RK-023] deve criar categoria sem ícone (null)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Sem Icone', tipo: 'despesa' });

      expect(res.status).to.equal(201);
      expect(res.body.icone).to.equal(null);
    });

    it('[CT-EP004-US016-03][US-016][RK-004] deve aceitar os 3 tipos válidos', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      for (const tipo of ['receita', 'despesa', 'ambos']) {
        const res = await agent
          .post('/api/categorias')
          .set('Authorization', `Bearer ${token}`)
          .send({ nome: `Cat ${tipo}`, tipo });

        expect(res.status).to.equal(201);
        expect(res.body.tipo).to.equal(tipo);
      }
    });

    it('[CT-EP004-US016-04][US-016][RK-008] padrao deve ser sempre false para criação via API', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Tentativa Padrão', tipo: 'despesa', padrao: true });

      expect(res.status).to.equal(201);
      expect(res.body.padrao).to.equal(false);
    });
  });

  describe('Validações', () => {
    it('[CT-EP004-US016-05][US-016][RK-010] deve rejeitar nome ausente (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo: 'despesa' });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP004-US016-06][US-016][RK-020] deve rejeitar tipo inválido (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Cat', tipo: 'invalido' });

      expect(res.status).to.equal(400);
    });

    it('[CT-EP004-US016-07][US-016][RK-017] deve rejeitar nome apenas com números (400)', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .post('/api/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '12345', tipo: 'despesa' });

      expect(res.status).to.equal(400);
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP004-US016-08][US-016][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.post('/api/categorias').send(gerarCategoriaValida());
      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
