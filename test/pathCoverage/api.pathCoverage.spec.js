const { expect } = require('chai');
const request = require('supertest');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const api = request(BASE_URL);

let serverProcess;

async function waitForHealthcheck(maxAttempts = 20) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await api.get('/api/healthcheck');
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      // Server may still be booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error('API server did not become healthy in time');
}

describe('Path Coverage - Stareast Commerce API', function pathCoverageSuite() {
  this.timeout(15000);

  let authToken;
  const uniqueEmail = `david.${Date.now()}@example.com`;

  before(async () => {
    serverProcess = spawn('node', ['src/server.js'], {
      stdio: 'ignore',
      shell: true,
      windowsHide: true,
    });

    await waitForHealthcheck();
  });

  after(() => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill();
    }
  });

  it('covers POST /api/register with valid README data', async () => {
    const response = await api.post('/api/register').send({
      name: 'David Lee',
      email: uniqueEmail,
      password: 'david123',
    });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    expect(response.body).to.include({
      name: 'David Lee',
      email: uniqueEmail,
    });
  });

  it('covers POST /api/login with an existing README user', async () => {
    const response = await api.post('/api/login').send({
      email: 'alice@example.com',
      password: 'alice123',
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body.token).to.be.a('string').and.not.empty;
    authToken = response.body.token;
  });

  it('covers POST /api/checkout using bearer token and README products', async () => {
    const response = await api
      .post('/api/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        paymentMethod: 'cash',
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.include({
      paymentMethod: 'cash',
      subtotal: 250,
      discount: 25,
      total: 225,
    });
    expect(response.body.items).to.be.an('array').with.lengthOf(2);
  });

  it('covers GET /api/healthcheck', async () => {
    const response = await api.get('/api/healthcheck');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ status: 'ok' });
  });
});
