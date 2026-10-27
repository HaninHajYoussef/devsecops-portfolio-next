process.env.RATE_LIMIT_MAX = '5';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../app');

test('le 6e envoi en moins d\'une minute reçoit 429', async () => {
  const invalide = { name: 'H', email: 'x', message: 'c' };

  for (let i = 0; i < 5; i++) {
    const res = await request(app).post('/api/contact').send(invalide);
    assert.equal(res.status, 400);
  }

  const res = await request(app).post('/api/contact').send(invalide);
  assert.equal(res.status, 429);
  assert.deepEqual(res.body, { error: 'Trop de requêtes, réessayez plus tard.' });
});
