import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import { criarUsuarioParaLogin } from '../../fixtures/auth.fixtures.js';

async function obterToken(credenciais) {
  const res = await request(app).post('/api/auth/login').send(credenciais);
  expect(res.status).to.equal(200);
  return res.body.token;
}

describe('PUT /api/usuarios/me/senha — Alterar senha (US-004)', () => {
  beforeEach(() => {
    limparBanco();
  });

  describe('Fluxo feliz e resposta', () => {
    it('[CT-EP001-US004-01][US-004][RU-037,RU-038,RU-039,RU-042] deve retornar 200 com mensagem quando senhas são válidas', async () => {
      const senhaNova = 'OutraSenha forte2';

      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({ senhaAtual: credenciais.senha, senhaNova });

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        mensagem: 'Senha alterada com sucesso.',
      });
    });

    it('[CT-EP001-US004-07][US-004][RG-004] resposta não deve expor senha nem hash', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({
          senhaAtual: credenciais.senha,
          senhaNova: 'NovaSenha Forte3',
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.keys('mensagem');
      expect(JSON.stringify(response.body)).to.not.match(/senha_hash|senhaHash/i);
    });
  });

  describe('Senha atual e nova', () => {
    it('[CT-EP001-US004-02][US-004][RU-038] deve retornar 401 CREDENCIAIS_INVALIDAS quando senha atual incorreta', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({
          senhaAtual: 'SenhaErrada999',
          senhaNova: 'NovaSenha Forte3',
        });

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('CREDENCIAIS_INVALIDAS');
    });

    it('[CT-EP001-US004-03][US-004][RU-040] deve retornar 400 SENHA_IGUAL_ATUAL quando nova senha é igual à atual', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({
          senhaAtual: credenciais.senha,
          senhaNova: credenciais.senha,
        });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('SENHA_IGUAL_ATUAL');
    });

    it('[CT-EP001-US004-04][US-004][RU-039,RU-012,RU-014] deve retornar 400 VALIDACAO quando nova senha não atende complexidade', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const response = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({
          senhaAtual: credenciais.senha,
          senhaNova: 'curta1',
        });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('VALIDACAO');
    });
  });

  describe('Campos obrigatórios', () => {
    it('[CT-EP001-US004-05][US-004][RU-037,RG-014] deve retornar 400 CAMPO_OBRIGATORIO sem senhaAtual e/ou senhaNova', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const semAtual = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({ senhaNova: 'NovaSenha Forte3' });

      expect(semAtual.status).to.equal(400);
      expect(semAtual.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
      expect(
        semAtual.body.erro.detalhes.some((d) => d.campo === 'senhaAtual')
      ).to.be.true;

      const semNova = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({ senhaAtual: credenciais.senha });

      expect(semNova.status).to.equal(400);
      expect(semNova.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
      expect(semNova.body.erro.detalhes.some((d) => d.campo === 'senhaNova')).to
        .be.true;
    });
  });

  describe('Token após alteração', () => {
    it('[CT-EP001-US004-06][US-004][RU-041] token JWT deve permanecer válido para GET /me após alterar senha', async () => {
      const { credenciais } = await criarUsuarioParaLogin();
      const token = await obterToken(credenciais);

      const putSenha = await request(app)
        .put('/api/usuarios/me/senha')
        .set('Authorization', `Bearer ${token}`)
        .send({
          senhaAtual: credenciais.senha,
          senhaNova: 'NovaClave Forte5',
        });

      expect(putSenha.status).to.equal(200);

      const me = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`);

      expect(me.status).to.equal(200);
      expect(me.body).to.have.property('email').that.is.a('string');

      const loginNova = await request(app).post('/api/auth/login').send({
        email: credenciais.email,
        senha: 'NovaClave Forte5',
      });
      expect(loginNova.status).to.equal(200);
    });
  });
});
