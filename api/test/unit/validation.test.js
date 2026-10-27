process.env.RATE_LIMIT_MAX = '1000';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../app');

const valid = {
  name: 'Hanin',
  email: 'hanin@example.com',
  message: 'Un message de test valide.',
};

// Étape 58 : test d'une route de l'API
test('GET /api/health retourne 200 et {"status":"ok"}', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('les headers de sécurité Helmet sont présents', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.headers['x-content-type-options'], 'nosniff');
  assert.ok(res.headers['content-security-policy']);
});

// Étape 59 : entrées invalides, injections et requêtes malformées
test('route inconnue : 404 en JSON', async () => {
  const res = await request(app).get('/api/nimportequoi');
  assert.equal(res.status, 404);
  assert.deepEqual(res.body, { error: 'Route introuvable' });
});

test('champs manquants : 400', async () => {
  const res = await request(app).post('/api/contact').send({ name: 'Hanin' });
  assert.equal(res.status, 400);
});

test('email invalide : 400', async () => {
  const res = await request(app).post('/api/contact').send({ ...valid, email: 'pas-un-email' });
  assert.equal(res.status, 400);
});

test('injection SQL dans le champ email : 400', async () => {
  const res = await request(app)
    .post('/api/contact')
    .send({ ...valid, email: "' OR '1'='1" });
  assert.equal(res.status, 400);
});

test('objet de type injection NoSQL à la place du nom : 400', async () => {
  const res = await request(app)
    .post('/api/contact')
    .send({ ...valid, name: { $ne: null } });
  assert.equal(res.status, 400);
});

test('champ inattendu (mass assignment) : 400', async () => {
  const res = await request(app)
    .post('/api/contact')
    .send({ ...valid, role: 'admin' });
  assert.equal(res.status, 400);
});

test('message trop long : 400', async () => {
  const res = await request(app)
    .post('/api/contact')
    .send({ ...valid, message: 'a'.repeat(3000) });
  assert.equal(res.status, 400);
});

test('JSON mal formé : 400 en JSON', async () => {
  const res = await request(app)
    .post('/api/contact')
    .set('Content-Type', 'application/json')
    .send('{"name":');
  assert.equal(res.status, 400);
  assert.ok(res.body.error);
});

test('corps trop volumineux : 413', async () => {
  const res = await request(app)
    .post('/api/contact')
    .send({ ...valid, message: 'a'.repeat(20000) });
  assert.equal(res.status, 413);
});

test('requête sans corps JSON : 400', async () => {
  const res = await request(app)
    .post('/api/contact')
    .set('Content-Type', 'text/plain')
    .send('bonjour');
  assert.equal(res.status, 400);
});
