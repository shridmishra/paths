import type { Request, Response } from 'express';
import { pathsService } from '../services/paths.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export class PathsController {
  /**
   * Get all paths
   */
  async getAll(_req: Request, res: Response) {
    const paths = await pathsService.getAllPaths();
    res.status(HTTP_STATUS.OK).json(paths);
  }

  /**
   * Get path by ID
   */
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const path = await pathsService.getPathById(id as string);
    res.status(HTTP_STATUS.OK).json(path);
  }

  /**
   * Create path
   */
  async create(req: Request, res: Response) {
    const path = await pathsService.createPath(req.body);
    res.status(HTTP_STATUS.CREATED).json(path);
  }

  /**
   * Update path
   */
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const path = await pathsService.updatePath(id as string, req.body);
    res.status(HTTP_STATUS.OK).json(path);
  }

  /**
   * Delete path
   */
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await pathsService.deletePath(id as string);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  }
}

export const pathsController = new PathsController();
