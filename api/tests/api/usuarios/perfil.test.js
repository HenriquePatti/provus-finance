import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import { gerarJwtExpiradoAssinado } from '../../helpers/jwt.helper.js';
import { criarUsuarioParaLogin } from '../../fixtures/auth.fixtures.js';

describe('GET /api/usuarios/me — Consultar próprio perfil (US-002)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Consulta autorizada', () => {
    it('[CT-EP001-US002-01][US-002][RU-028,RU-029,RG-008] deve retornar 200 com dados do próprio usuário sem campos sensíveis', async () => {
      const { usuario, credenciais } = await criarUsuarioParaLogin();

      const login = await request(app).post('/api/auth/login').send(credenciais);
      expect(login.status).to.equal(200);
      const { token } = login.body;

      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.id).to.equal(usuario.id);
      expect(response.body.nome).to.equal(usuario.nome);
      expect(response.body.email).to.equal(credenciais.email.trim().toLowerCase());
      expect(response.body).to.have.property('criadoEm');
      expect(response.body).to.have.property('atualizadoEm');
      expect(response.body).to.not.have.property('senha');
      expect(response.body).to.not.have.property('senha_hash');
      expect(response.body).to.not.have.property('senhaHash');
    });

    it('[CT-EP001-US002-05][US-002][RG-004] resposta não deve expor senha nem senha_hash', async () => {
      const { credenciais } = await criarUsuarioParaLogin();

      const login = await request(app).post('/api/auth/login').send(credenciais);
      const { token } = login.body;

      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.not.have.any.keys('senha', 'senha_hash', 'senhaHash');
    });
  });

  describe('Token ausente ou inválido', () => {
    it('[CT-EP001-US002-02][US-002][RG-009] deve retornar 401 TOKEN_AUSENTE sem header Authorization', async () => {
      const response = await request(app).get('/api/usuarios/me');

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });

    it('[CT-EP001-US002-03][US-002][RG-010] deve retornar 401 TOKEN_INVALIDO com token inválido', async () => {
      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', 'Bearer formato-invalido-nao-jwt-real');

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_INVALIDO');
    });

    it('[CT-EP001-US002-04][US-002][RG-011] deve retornar 401 TOKEN_EXPIRADO com token expirado', async () => {
      const { usuario } = await criarUsuarioParaLogin();
      expect(usuario.id).to.be.a('number');

      const tokenExpirado = gerarJwtExpiradoAssinado({
        sub: usuario.id,
        email: usuario.email,
      });

      const response = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${tokenExpirado}`);

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_EXPIRADO');
    });
  });
});
