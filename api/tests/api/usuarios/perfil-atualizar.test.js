import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import { criarUsuarioParaLogin } from '../../fixtures/auth.fixtures.js';

async function loginToken(credenciais) {
  const res = await request(app).post('/api/auth/login').send(credenciais);
  expect(res.status).to.equal(200);
  return res.body.token;
}

describe('PUT /api/usuarios/me — Atualizar dados do perfil (US-003)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Atualização autorizada', () => {
    it('[CT-EP001-US003-01][US-003][RU-031,RU-036] deve atualizar nome e e-mail quando ambos válidos', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await loginToken(credenciais);
      const novoEmail = 'perfil.us003.novo@teste.local';

      const response = await request(app)
        .put('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Nome Atualizado US003', email: novoEmail });

      expect(response.status).to.equal(200);
      expect(response.body.nome).to.equal('Nome Atualizado US003');
      expect(response.body.email).to.equal(novoEmail);
      expect(response.body).to.not.have.any.keys('senha', 'senha_hash', 'senhaHash');

      const getPerfil = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`);
      expect(getPerfil.status).to.equal(200);
      expect(getPerfil.body.email).to.equal(novoEmail);
    });

    it('[CT-EP001-US003-02][US-003][RU-032] deve atualizar apenas o nome quando só nome é enviado', async () => {
      const { usuario, credenciais } = await criarUsuarioParaLogin();
      const token = await loginToken(credenciais);
      const emailAntes = usuario.email;

      const response = await request(app)
        .put('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'SomenteNome Novo' });

      expect(response.status).to.equal(200);
      expect(response.body.nome).to.equal('SomenteNome Novo');
      expect(response.body.email).to.equal(emailAntes);
    });

    it('[CT-EP001-US003-04][US-003][RU-034] deve aceitar atualização quando o e-mail mantido é o mesmo do usuário', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await loginToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'MesmoEmail OK',
          email: credenciais.email,
        });

      expect(response.status).to.equal(200);
      expect(response.body.nome).to.equal('MesmoEmail OK');
      expect(response.body.email).to.equal(credenciais.email.trim().toLowerCase());
    });
  });

  describe('Conflito e validação', () => {
    it('[CT-EP001-US003-03][US-003][RU-033] deve retornar 409 quando o e-mail pertence a outro usuário', async () => {
      const usuarioA = await criarUsuarioParaLogin({
        nome: 'User A US003',
        email: 'user-a-us003@teste.local',
        senha: 'SenhaForteA1',
      });
      await criarUsuarioParaLogin({
        nome: 'User B US003',
        email: 'user-b-us003@teste.local',
        senha: 'SenhaForteB1',
      });

      const tokenA = await loginToken(usuarioA.credenciais);

      const response = await request(app)
        .put('/api/usuarios/me')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: 'user-b-us003@teste.local' });

      expect(response.status).to.equal(409);
      expect(response.body.erro.codigo).to.equal('EMAIL_JA_CADASTRADO');
    });

    it('[CT-EP001-US003-05][US-003][RU-017,RU-019] deve retornar 400 quando o nome só contém dígitos', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await loginToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '12345' });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('VALIDACAO');
      expect(response.body.erro.detalhes.some((d) => d.campo === 'nome')).to.be.true;
    });
  });

  describe('Autenticação', () => {
    it('[CT-EP001-US003-06][US-003][RG-009] deve retornar 401 TOKEN_AUSENTE sem header Authorization', async () => {
      const response = await request(app).put('/api/usuarios/me').send({
        nome: 'Qualquer Nome Validado Pelo Middleware',
      });

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });
  });
});
