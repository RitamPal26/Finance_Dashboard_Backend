import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id as string, req.body);
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }

  static async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deactivateUser(req.params.id as string);
      res.status(200).json({
        status: 'success',
        message: 'User deactivated successfully (Soft Delete)',
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      next(error);
    }
  }
}
