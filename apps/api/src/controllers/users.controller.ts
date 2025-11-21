import type { Request, Response } from 'express';
import { usersService } from '../services/users.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export class UsersController {
  /**
   * Get all users
   */
  async getAll(_req: Request, res: Response) {
    const users = await usersService.getAllUsers();
    res.status(HTTP_STATUS.OK).json(users);
  }

  /**
   * Get user by ID
   */
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await usersService.getUserById(id as string);
    res.status(HTTP_STATUS.OK).json(user);
  }

  /**
   * Create user
   */
  async create(req: Request, res: Response) {
    const user = await usersService.createUser(req.body);
    res.status(HTTP_STATUS.CREATED).json(user);
  }

  /**
   * Update user
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const user = await usersService.updateUser(id as string, req.body);
    res.status(HTTP_STATUS.OK).json(user);
  }

  /**
   * Delete user
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await usersService.deleteUser(id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export const usersController = new UsersController();
