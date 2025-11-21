import { Router, type Request, type Response } from 'express';
import { prisma } from '@workspace/db';

const router: Router = Router();

// Get all progress for a user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: {
        question: {
          include: {
            topic: {
              include: {
                path: true
              }
            }
          }
        }
      }
    });
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get progress stats for a user
router.get('/user/:userId/stats', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const totalProgress = await prisma.progress.count({
      where: { userId }
    });
    
    const completedProgress = await prisma.progress.count({
      where: { userId, completed: true }
    });
    
    const averageScore = await prisma.progress.aggregate({
      where: { userId, completed: true },
      _avg: { score: true }
    });
    
    res.json({
      total: totalProgress,
      completed: completedProgress,
      averageScore: averageScore._avg.score || 0,
      completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ error: 'Failed to fetch progress stats' });
  }
});

// Create or update progress
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, questionId, completed, score } = req.body;
    
    if (!userId || !questionId) {
      return res.status(400).json({ error: 'userId and questionId are required' });
    }
    
    const progress = await prisma.progress.upsert({
      where: {
        userId_questionId: { userId, questionId }
      },
      update: {
        completed: completed ?? undefined,
        score: score ?? undefined,
        completedAt: completed ? new Date() : undefined
      },
      create: {
        userId,
        questionId,
        completed: completed || false,
        score: score || null,
        completedAt: completed ? new Date() : null
      }
    });
    
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Delete progress
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.progress.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

export default router;
