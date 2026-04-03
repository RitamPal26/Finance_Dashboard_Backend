import prisma from '../../../config/db';
import { Role } from '@prisma/client';

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });

    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateUser(id: string, data: { role?: Role; isActive?: boolean }) {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) throw new Error('User not found');

    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, isActive: true, updatedAt: true },
    });
  }

  static async deactivateUser(id: string) {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) throw new Error('User not found');

    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, email: true, isActive: true },
    });
  }
}
