import { Request, Response } from 'express';

import { AuthService, RegisterInput, LoginInput } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.registerUser(req.body as RegisterInput);
      res.status(201).json({ message: 'User registered successfully', ...result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server error';
      const status = message === 'User already exists' ? 400 : 500;
      res.status(status).json({ error: message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.loginUser(req.body as LoginInput);
      res.status(200).json({ message: 'Login successful', ...result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
}
