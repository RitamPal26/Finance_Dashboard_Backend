import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../../config/env';
import prisma from '../../../config/db';

import { Role } from '@prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  private static generateToken(id: string, role: string): string {
    return jwt.sign({ id, role }, env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }

  static async registerUser(data: RegisterInput) {
    const { email, password, role } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'VIEWER',
      },
    });

    const token = this.generateToken(user.id, user.role);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  static async loginUser(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = this.generateToken(user.id, user.role);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
