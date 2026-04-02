import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../../app';
import { AuthService } from '../auth/services/authService';

vi.mock('../auth/services/authService');

describe('Auth Routes Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 on successful registration', async () => {
      vi.mocked(AuthService.registerUser).mockResolvedValue({
        token: 'fake-jwt-token',
        user: { id: '1', email: 'test@example.com', role: 'VIEWER' },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.token).toBe('fake-jwt-token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 500 if the service throws an unexpected error', async () => {
      vi.mocked(AuthService.loginUser).mockRejectedValue(new Error('Unexpected Database Failure'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Unexpected Database Failure');
    });
  });
});
