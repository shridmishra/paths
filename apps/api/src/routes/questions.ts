import { Router, type Request, type Response } from 'express';
import { prisma } from '@workspace/db';

const router: Router = Router();

// Get all questions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, difficulty, topicId } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (topicId) where.topicId = topicId;
    
    const questions = await prisma.question.findMany({
      where,
      include: {
        topic: {
          select: { id: true, title: true }
        }
      }
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get question by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            path: true
          }
        }
      }
    });
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Create question
router.post('/', async (req: Request, res: Response) => {
  try {
    const { question, answer, difficulty, type, topicId } = req.body;
    
    if (!question || !answer || !topicId) {
      return res.status(400).json({ error: 'Question, answer, and topicId are required' });
    }
    
    const newQuestion = await prisma.question.create({
      data: {
        question,
        answer,
        difficulty: difficulty || 'medium',
        type: type || 'quiz',
        topicId
      }
    });
    
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Update question
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer, difficulty, type } = req.body;
    
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: { question, answer, difficulty, type }
    });
    
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.question.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
