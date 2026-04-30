import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import {
  criarUsuarioAutenticado,
  criarContaNoBanco,
} from '../../fixtures/contas.fixtures.js';

const agent = request(app);

describe('DELETE /api/contas/:id — Desativar conta, soft delete (US-013)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP003-US013-01][US-013][RC-040] deve desativar conta e retornar 204', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Conta para Desativar' });

      const res = await agent
        .delete(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
      expect(res.body).to.be.empty;
    });

    it('[CT-EP003-US013-02][US-013][RC-042] conta desativada não aparece na listagem padrão', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      criarContaNoBanco(usuario.id, { nome: 'Conta Ativa' });
      const contaDesativar = criarContaNoBanco(usuario.id, { nome: 'Vai Desativar' });

      await agent
        .delete(`/api/contas/${contaDesativar.id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await agent
        .get('/api/contas')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].nome).to.equal('Conta Ativa');
    });

    it('[CT-EP003-US013-03][US-013][RC-042] conta desativada aparece com ?ativo=false', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Desativada' });

      await agent
        .delete(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await agent
        .get('/api/contas?ativo=false')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0].nome).to.equal('Desativada');
      expect(res.body[0].ativo).to.equal(false);
    });
  });

  // ============================================================
  // Erros
  // ============================================================

  describe('Erros', () => {
    it('[CT-EP003-US013-04][US-013] deve retornar 400 ao desativar conta já inativa', async () => {
      const { token, usuario } = await criarUsuarioAutenticado(agent);
      const conta = criarContaNoBanco(usuario.id, { nome: 'Já Inativa' });

      // Primeira desativação
      await agent
        .delete(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`);

      // Segunda tentativa
      const res = await agent
        .delete(`/api/contas/${conta.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body.erro.codigo).to.equal('CONTA_JA_INATIVA');
    });

    it('[CT-EP003-US013-05][US-013] deve retornar 404 para ID inexistente', async () => {
      const { token } = await criarUsuarioAutenticado(agent);

      const res = await agent
        .delete('/api/contas/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });

    it('[CT-EP003-US013-06][US-013][RG-012] deve retornar 404 para conta de outro usuário', async () => {
      const user1 = await criarUsuarioAutenticado(agent);
      const user2 = await criarUsuarioAutenticado(agent);

      const contaUser2 = criarContaNoBanco(user2.usuario.id, { nome: 'Alheia' });

      const res = await agent
        .delete(`/api/contas/${contaUser2.id}`)
        .set('Authorization', `Bearer ${user1.token}`);

      expect(res.status).to.equal(404);
      expect(res.body.erro.codigo).to.equal('CONTA_NAO_ENCONTRADA');
    });
  });

  // ============================================================
  // Autenticação
  // ============================================================

  describe('Autenticação', () => {
    it('[CT-EP003-US013-07][US-013][RG-009] deve retornar 401 sem token', async () => {
      const res = await agent.delete('/api/contas/1');

      expect(res.status).to.equal(401);
      expect(res.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
