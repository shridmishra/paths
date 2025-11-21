import type { Request, Response, NextFunction } from 'express';
import { usersService } from '../services/users.service.js';
import { BadRequestError } from '../lib/errors.js';

export class UsersController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new BadRequestError('User ID is required');
      }
      
      const user = await usersService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;

      if (!email) {
        throw new BadRequestError('Email is required');
      }

      const user = await usersService.createUser({ email, name });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      if (!id) {
        throw new BadRequestError('User ID is required');
      }

      const user = await usersService.updateUser(id, { email, name });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new BadRequestError('User ID is required');
      }
      
      await usersService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
