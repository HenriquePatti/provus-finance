import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import { criarUsuarioParaLogin } from '../../fixtures/auth.fixtures.js';
import { gerarUsuarioValido } from '../../fixtures/usuarios.fixtures.js';

describe('DELETE /api/usuarios/me — Excluir própria conta (US-005)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ==========================================================
  // Helper local: cadastra + faz login e devolve { token, usuario, credenciais }
  // ==========================================================
  async function logarComUsuarioCadastrado() {
    const { usuario, credenciais } = await criarUsuarioParaLogin();
    const login = await request(app).post('/api/auth/login').send(credenciais);
    expect(login.status).to.equal(200);
    return { token: login.body.token, usuario, credenciais };
  }

  // ==========================================================
  // CT-EP001-US005-01 — Exclusão com senha correta
  // ==========================================================
  describe('Exclusão com senha correta', () => {
    it('[CT-EP001-US005-01][US-005][RU-043,RU-044,RU-047] deve retornar 204 sem body quando senha confere', async () => {
      const { token, credenciais } = await logarComUsuarioCadastrado();

      const response = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: credenciais.senha });

      expect(response.status).to.equal(204);
      // 204 não tem body — supertest devolve objeto vazio
      expect(response.body).to.deep.equal({});
    });
  });

  // ==========================================================
  // CT-EP001-US005-02 — Exclusão com senha incorreta
  // ==========================================================
  describe('Exclusão com senha incorreta', () => {
    it('[CT-EP001-US005-02][US-005][RU-044] deve retornar 401 CREDENCIAIS_INVALIDAS', async () => {
      const { token } = await logarComUsuarioCadastrado();

      const response = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: 'SenhaErrada123' });

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('CREDENCIAIS_INVALIDAS');
    });
  });

  // ==========================================================
  // CT-EP001-US005-03 — Exclusão sem senha de confirmação
  // ==========================================================
  describe('Exclusão sem senha de confirmação', () => {
    it('[CT-EP001-US005-03][US-005][RU-044,RG-014] deve retornar 400 CAMPO_OBRIGATORIO sem campo senha', async () => {
      const { token } = await logarComUsuarioCadastrado();

      const response = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
      expect(response.body.erro.detalhes).to.be.an('array');
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });

    it('[CT-EP001-US005-03][US-005][RU-044,RG-014] deve retornar 400 CAMPO_OBRIGATORIO com senha vazia', async () => {
      const { token } = await logarComUsuarioCadastrado();

      const response = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: '' });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
    });
  });

  // ==========================================================
  // CT-EP001-US005-04 — Token antigo torna-se inválido após exclusão
  // ==========================================================
  describe('Token após exclusão', () => {
    it('[CT-EP001-US005-04][US-005][RU-048] token antigo retorna 404 ao consultar perfil após exclusão', async () => {
      const { token, credenciais } = await logarComUsuarioCadastrado();

      // Exclui
      const exclusao = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: credenciais.senha });
      expect(exclusao.status).to.equal(204);

      // Tenta usar o mesmo token em rota autenticada
      const consulta = await request(app)
        .get('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`);

      expect(consulta.status).to.equal(404);
      expect(consulta.body.erro.codigo).to.equal('USUARIO_NAO_ENCONTRADO');
    });
  });

  // ==========================================================
  // CT-EP001-US005-05 — Reuso do e-mail após exclusão
  // ==========================================================
  describe('Reuso do e-mail após exclusão', () => {
    it('[CT-EP001-US005-05][US-005][RU-049] e-mail volta a ficar disponível para novo cadastro', async () => {
      const { token, credenciais } = await logarComUsuarioCadastrado();

      // Exclui o usuário
      const exclusao = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: credenciais.senha });
      expect(exclusao.status).to.equal(204);

      // Tenta cadastrar novo usuário com o mesmo e-mail
      const novoCadastro = await request(app)
        .post('/api/usuarios')
        .send({
          nome: 'Outro Usuario',
          email: credenciais.email,
          senha: 'OutraSenha456',
        });

      expect(novoCadastro.status).to.equal(201);
      expect(novoCadastro.body.email).to.equal(credenciais.email);
    });
  });

  // ==========================================================
  // CT-EP001-US005-06 — Exclusão remove o registro do banco
  //
  // Nota: cobertura de cascata real será adicionada quando
  //       existirem tabelas filhas (contas, transações, etc.).
  //       Por enquanto validamos que o usuário some do banco.
  // ==========================================================
  describe('Remoção efetiva do banco', () => {
    it('[CT-EP001-US005-06][US-005][RU-045,RT-071] usuário não deve mais ser encontrado após exclusão', async () => {
      const { token, credenciais } = await logarComUsuarioCadastrado();

      // Exclui
      await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: credenciais.senha });

      // Login com mesmas credenciais já não funciona
      const loginAposExclusao = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(loginAposExclusao.status).to.equal(401);
      expect(loginAposExclusao.body.erro.codigo).to.equal('CREDENCIAIS_INVALIDAS');
    });
  });

  // ==========================================================
  // CT-EP001-US005-07 — Atomicidade
  //
  // Por enquanto sem tabelas relacionadas. Validamos que ou tudo
  // dá certo (204 + sumiço do registro) ou nada acontece.
  // Quando houver contas/transações, este teste será expandido
  // para forçar falhas intermediárias e provar rollback.
  // ==========================================================
  describe('Atomicidade da exclusão', () => {
    it('[CT-EP001-US005-07][US-005][RU-046,RG-038] exclusão é tudo-ou-nada (204 + registro removido)', async () => {
      const { token, credenciais } = await logarComUsuarioCadastrado();

      const exclusao = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ senha: credenciais.senha });

      // Estado consistente: ou 204 + removido, ou erro + intacto.
      // Nesse caminho feliz: 204 e o usuário desaparece.
      expect(exclusao.status).to.equal(204);

      // Tenta autenticar de novo: garantia de que o usuário sumiu
      const tentativaLogin = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(tentativaLogin.status).to.equal(401);
    });
  });

  // ==========================================================
  // Cenários de autenticação (cobertos pelo middleware)
  // ==========================================================
  describe('Autenticação', () => {
    it('[US-005][RG-009] deve retornar 401 TOKEN_AUSENTE sem header Authorization', async () => {
      const response = await request(app)
        .delete('/api/usuarios/me')
        .send({ senha: 'qualquer' });

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_AUSENTE');
    });

    it('[US-005][RG-010] deve retornar 401 TOKEN_INVALIDO com token mal formado', async () => {
      const response = await request(app)
        .delete('/api/usuarios/me')
        .set('Authorization', 'Bearer xpto-token-invalido')
        .send({ senha: 'qualquer' });

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('TOKEN_INVALIDO');
    });
  });
});