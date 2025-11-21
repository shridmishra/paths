import { usersRepository } from '../repositories/users.repository.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.util.js';
import type { User, Prisma } from '@workspace/db';

export class UsersService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return usersRepository.findAll();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Create a new user
   */
  async createUser(data: { email: string; name?: string }): Promise<User> {
    // Check if email already exists
    const emailExists = await usersRepository.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError('Email already in use');
    }

    return usersRepository.create(data);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: { email?: string; name?: string }): Promise<User> {
    // Check if user exists
    const exists = await usersRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    // If updating email, check if it's already taken by another user
    if (data.email) {
      const emailExists = await usersRepository.emailExists(data.email, id);
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    return usersRepository.update(id, data);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    const exists = await usersRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    await usersRepository.delete(id);
  }
}

export const usersService = new UsersService();
