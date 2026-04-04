import request from 'supertest';
import { describe, it, expect, afterAll } from 'vitest';
import app from '../../app';
import prisma from '../../config/db';

describe('API Integration Tests', () => {
  let adminToken: string;
  let viewerToken: string;

  const adminEmail = `admin-${Date.now()}@example.com`;
  const viewerEmail = `viewer-${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('1. should register a new Admin user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: adminEmail,
      password: 'password123',
      role: 'ADMIN',
    });

    console.log('SERVER ERROR:', res.body);

    expect(res.status).toBe(201);
  });

  it('2. should login and return a JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  it('3. should block access to protected routes without a token', async () => {
    const res = await request(app).get('/api/transactions');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access denied');
  });

  it('4. should create a transaction when authenticated as Admin', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 1500,
        type: 'INCOME',
        category: 'Salary',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.transaction).toHaveProperty('id');
  });

  it('5. should prevent a VIEWER from deleting users (RBAC Test)', async () => {
    await request(app).post('/api/auth/register').send({
      email: viewerEmail,
      password: 'password123',
      role: 'VIEWER',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: viewerEmail,
      password: 'password123',
    });

    viewerToken = loginRes.body.token;

    const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';
    const res = await request(app)
      .delete(`/api/users/${fakeUuid}`)
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(res.status).toBe(403);
  });
});
