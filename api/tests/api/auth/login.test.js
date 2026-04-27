import { expect } from 'chai';
import request from 'supertest';
import app from '../../../src/app.js';
import { limparBanco } from '../../helpers/database.helper.js';
import { decodificarPayload } from '../../helpers/jwt.helper.js';
import {
  criarUsuarioParaLogin,
  gerarCredenciaisValidas,
} from '../../fixtures/auth.fixtures.js';

describe('POST /api/auth/login — Autenticar usuário com JWT (US-006)', () => {
  beforeEach(() => {
    limparBanco();
  });

  // ============================================================
  // Fluxo feliz
  // ============================================================

  describe('Fluxo feliz', () => {
    it('[CT-EP002-US006-01][US-006][RU-021,RU-023,RU-024,RU-026,RG-001] deve autenticar com credenciais válidas e devolver token + usuário', async () => {
      const { usuario, credenciais } = await criarUsuarioParaLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
      expect(response.body).to.have.property('usuario');
      expect(response.body.usuario.id).to.equal(usuario.id);
      expect(response.body.usuario.nome).to.equal(usuario.nome);
      expect(response.body.usuario.email).to.equal(credenciais.email);
      expect(response.body.usuario).to.not.have.property('senha');
      expect(response.body.usuario).to.not.have.property('senha_hash');
      expect(response.body.usuario).to.not.have.property('senhaHash');
    });
  });

  // ============================================================
  // Anti-enumeração (RU-022)
  // ============================================================

  describe('Credenciais inválidas — anti-enumeração', () => {
    it('[CT-EP002-US006-02][US-006][RU-022] deve retornar 401 CREDENCIAIS_INVALIDAS quando o e-mail não está cadastrado', async () => {
      const credenciais = gerarCredenciaisValidas();

      const response = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(response.status).to.equal(401);
      expect(response.body.erro.codigo).to.equal('CREDENCIAIS_INVALIDAS');
      expect(response.body.erro.mensagem).to.be.a('string').and.is.not.empty;
    });

    it('[CT-EP002-US006-03][US-006][RU-022,RU-026] deve retornar 401 com body IDÊNTICO ao caso de e-mail inexistente quando a senha está incorreta', async () => {
      const respostaEmailInexistente = await request(app)
        .post('/api/auth/login')
        .send(gerarCredenciaisValidas());

      const { credenciais } = await criarUsuarioParaLogin();
      const respostaSenhaErrada = await request(app)
        .post('/api/auth/login')
        .send({ email: credenciais.email, senha: 'SenhaErrada999' });

      expect(respostaSenhaErrada.status).to.equal(401);
      expect(respostaSenhaErrada.body.erro.codigo).to.equal('CREDENCIAIS_INVALIDAS');
      expect(respostaSenhaErrada.body).to.deep.equal(respostaEmailInexistente.body);
    });
  });

  // ============================================================
  // Campos obrigatórios
  // ============================================================

  describe('Campos obrigatórios ausentes', () => {
    it('[CT-EP002-US006-04][US-006][RU-021,RG-014] deve retornar 400 CAMPO_OBRIGATORIO quando email está ausente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ senha: 'Senha123' });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
      expect(response.body.erro.detalhes).to.be.an('array');
      expect(response.body.erro.detalhes.some((d) => d.campo === 'email')).to.be.true;
    });

    it('[CT-EP002-US006-05][US-006][RU-021,RG-014] deve retornar 400 CAMPO_OBRIGATORIO quando senha está ausente', async () => {
      const { credenciais } = await criarUsuarioParaLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: credenciais.email });

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('CAMPO_OBRIGATORIO');
      expect(response.body.erro.detalhes.some((d) => d.campo === 'senha')).to.be.true;
    });
  });

  // ============================================================
  // Body inválido
  // ============================================================

  describe('Body inválido', () => {
    it('[CT-EP002-US006-06][US-006][RG-007] deve retornar 400 FORMATO_INVALIDO quando body não é JSON válido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('isto nao e um json valido');

      expect(response.status).to.equal(400);
      expect(response.body.erro.codigo).to.equal('FORMATO_INVALIDO');
    });
  });

  // ============================================================
  // Estrutura do JWT
  // ============================================================

  describe('Payload do JWT', () => {
    it('[CT-EP002-US006-07][US-006][RU-025,RG-013] payload do token deve conter sub, email, iat e exp com duração ~24h', async () => {
      const { usuario, credenciais } = await criarUsuarioParaLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(response.status).to.equal(200);

      const payload = decodificarPayload(response.body.token);
      expect(payload).to.have.property('sub').that.equals(usuario.id);
      expect(payload).to.have.property('email').that.equals(credenciais.email);
      expect(payload).to.have.property('iat').that.is.a('number');
      expect(payload).to.have.property('exp').that.is.a('number');

      const VINTE_QUATRO_HORAS_EM_SEGUNDOS = 24 * 60 * 60;
      const TOLERANCIA_SEGUNDOS = 5;
      expect(payload.exp - payload.iat).to.be.closeTo(
        VINTE_QUATRO_HORAS_EM_SEGUNDOS,
        TOLERANCIA_SEGUNDOS
      );
    });
  });

  // ============================================================
  // Normalização (RU-010, RG-020)
  // ============================================================

  describe('Normalização case-insensitive do e-mail', () => {
    it('[CT-EP002-US006-08][US-006][RU-010,RG-020] deve aceitar login com e-mail em caixa alta e devolver email em minúsculas no payload', async () => {
      const { credenciais } = await criarUsuarioParaLogin();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: credenciais.email.toUpperCase(),
          senha: credenciais.senha,
        });

      expect(response.status).to.equal(200);
      expect(response.body.usuario.email).to.equal(credenciais.email);

      const payload = decodificarPayload(response.body.token);
      expect(payload.email).to.equal(credenciais.email);
    });
  });

  // ============================================================
  // Múltiplas sessões (RU-027)
  // ============================================================

  describe('Múltiplas sessões simultâneas', () => {
    it('[CT-EP002-US006-09][US-006][RU-027] deve permitir múltiplas sessões — dois logins consecutivos retornam tokens distintos para o mesmo usuário', async () => {
      // Cobertura PARCIAL — a validação de "ambos os tokens funcionam em rota
      // protegida" será adicionada no PR da US-002 (GET /api/usuarios/me),
      // quando a primeira rota protegida real existir. Aqui validamos o que
      // já é possível sem inventar rota: dois logins distintos geram tokens
      // diferentes, ambos decodificáveis e referenciando o mesmo usuário.
      const { usuario, credenciais } = await criarUsuarioParaLogin();

      const primeiraResposta = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      // iat do JWT é em segundos — espera 1.1s para garantir tokens distintos
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const segundaResposta = await request(app)
        .post('/api/auth/login')
        .send(credenciais);

      expect(primeiraResposta.status).to.equal(200);
      expect(segundaResposta.status).to.equal(200);

      const tokenA = primeiraResposta.body.token;
      const tokenB = segundaResposta.body.token;
      expect(tokenA).to.not.equal(tokenB);

      const payloadA = decodificarPayload(tokenA);
      const payloadB = decodificarPayload(tokenB);

      expect(payloadA.sub).to.equal(usuario.id);
      expect(payloadB.sub).to.equal(usuario.id);
      expect(payloadA.email).to.equal(payloadB.email);
      expect(payloadB.iat).to.be.greaterThan(payloadA.iat);
    });
  });
});
