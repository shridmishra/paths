import { Router, type Request, type Response } from 'express';
import { prisma } from '@workspace/db';

const router: Router = Router();

// Get all topics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        path: {
          select: { id: true, title: true }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { order: 'asc' }
    });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get topic by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        path: true,
        questions: true
      }
    });
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Create topic
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, order, pathId } = req.body;
    
    if (!title || !pathId) {
      return res.status(400).json({ error: 'Title and pathId are required' });
    }
    
    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        order: order || 0,
        pathId
      }
    });
    
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Update topic
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;
    
    const topic = await prisma.topic.update({
      where: { id },
      data: { title, description, order }
    });
    
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// Delete topic
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.topic.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

export default router;
