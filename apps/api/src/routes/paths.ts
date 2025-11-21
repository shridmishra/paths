import { Router, type Request, type Response } from 'express';
import { prisma } from '@workspace/db';

const router: Router = Router();

// Get all paths
router.get('/', async (_req: Request, res: Response) => {
  try {
    const paths = await prisma.path.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        topics: {
          include: {
            _count: {
              select: { questions: true }
            }
          }
        },
        _count: {
          select: { topics: true }
        }
      }
    });
    res.json(paths);
  } catch (error) {
    console.error('Error fetching paths:', error);
    res.status(500).json({ error: 'Failed to fetch paths' });
  }
});

// Get path by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const path = await prisma.path.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        topics: {
          include: {
            questions: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!path) {
      return res.status(404).json({ error: 'Path not found' });
    }
    
    res.json(path);
  } catch (error) {
    console.error('Error fetching path:', error);
    res.status(500).json({ error: 'Failed to fetch path' });
  }
});

// Create path
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, category, userId } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ error: 'Title and userId are required' });
    }
    
    const path = await prisma.path.create({
      data: {
        title,
        description,
        difficulty: difficulty || 'beginner',
        category: category || 'general',
        userId
      },
      include: {
        topics: true
      }
    });
    
    res.status(201).json(path);
  } catch (error) {
    console.error('Error creating path:', error);
    res.status(500).json({ error: 'Failed to create path' });
  }
});

// Update path
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, category } = req.body;
    
    const path = await prisma.path.update({
      where: { id },
      data: { title, description, difficulty, category }
    });
    
    res.json(path);
  } catch (error) {
    console.error('Error updating path:', error);
    res.status(500).json({ error: 'Failed to update path' });
  }
});

// Delete path
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.path.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting path:', error);
    res.status(500).json({ error: 'Failed to delete path' });
  }
});

export default router;
