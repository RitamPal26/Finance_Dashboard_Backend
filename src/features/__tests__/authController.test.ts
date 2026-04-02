import { Request, Response } from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../auth/controllers/authController';
import { AuthService } from '../auth/services/authService';

vi.mock('../auth/services/authService', () => ({
  AuthService: {
    registerUser: vi.fn(),
    loginUser: vi.fn(),
  },
}));

describe('AuthController Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseStatus: number;
  let responseJson: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockResponse = {
      status: vi.fn().mockImplementation((code: number) => {
        responseStatus = code;
        return mockResponse;
      }),
      json: vi.fn().mockImplementation((data: any) => {
        responseJson = data;
        return mockResponse;
      }),
    } as unknown as Response;

    mockRequest = {};
  });

  describe('register()', () => {
    it('should return 201 when registration is successful', async () => {
      const mockResult = {
        token: 'fake-jwt-token',
        user: { id: 'user-123', email: 'test@example.com', role: 'VIEWER' },
      };

      vi.mocked(AuthService.registerUser).mockResolvedValue(mockResult);
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toBe(201);
      expect(responseJson.message).toBe('User registered successfully');
      expect(responseJson.token).toBe('fake-jwt-token');
      expect(AuthService.registerUser).toHaveBeenCalledWith(mockRequest.body);
    });

    it('should return 400 when user already exists', async () => {
      vi.mocked(AuthService.registerUser).mockRejectedValue(new Error('User already exists'));
      mockRequest.body = { email: 'duplicate@example.com', password: 'password123' };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toBe(400);
      expect(responseJson.error).toBe('User already exists');
    });
  });

  describe('login()', () => {
    it('should return 200 and a token on valid login', async () => {
      const mockResult = {
        token: 'login-token',
        user: { id: 'user-123', email: 'test@example.com', role: 'VIEWER' },
      };

      vi.mocked(AuthService.loginUser).mockResolvedValue(mockResult);
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toBe(200);
      expect(responseJson.message).toBe('Login successful');
      expect(responseJson.token).toBe('login-token');
    });

    it('should return 500 for generic server errors', async () => {
      vi.mocked(AuthService.loginUser).mockRejectedValue(new Error('Database connection failed'));
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toBe(500);
      expect(responseJson.error).toBe('Database connection failed');
    });
  });
});
