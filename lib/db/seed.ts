
import { db } from './index';
import { users, paths, topics, questions, progress } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  let user = await db.query.users.findFirst({
    where: eq(users.email, 'demo@paths.dev'),
  });

  if (!user) {
    [user] = await db.insert(users).values({
      email: 'demo@paths.dev',
      name: 'Demo User',
    }).returning();
  }

  console.log('✅ Created demo user:', user!.email);

  // Create learning paths
  const pathsData = [
    {
      id: 'frontend-path-1',
      title: 'Frontend Development',
      description: 'Master modern frontend development with React, TypeScript, and Next.js',
      difficulty: 'intermediate',
      category: 'frontend',
      userId: user!.id,
    },
    {
      id: 'backend-path-1',
      title: 'Backend Development',
      description: 'Learn backend development with Node.js, Express, and databases',
      difficulty: 'intermediate',
      category: 'backend',
      userId: user!.id,
    },
  ];

  for (const p of pathsData) {
    await db.insert(paths).values(p).onConflictDoNothing().execute();
  }

  console.log('✅ Created learning paths');

  // Create topics for frontend path
  const topicsData = [
    {
      id: 'react-basics-topic',
      title: 'React Basics',
      description: 'Learn the fundamentals of React',
      order: 1,
      pathId: 'frontend-path-1',
    },
    {
      id: 'typescript-basics-topic',
      title: 'TypeScript Fundamentals',
      description: 'Master TypeScript for type-safe development',
      order: 2,
      pathId: 'frontend-path-1',
    },
    {
      id: 'node-basics-topic',
      title: 'Node.js Basics',
      description: 'Learn server-side JavaScript with Node.js',
      order: 1,
      pathId: 'backend-path-1',
    },
  ];

  for (const t of topicsData) {
    await db.insert(topics).values(t).onConflictDoNothing().execute();
  }

  console.log('✅ Created topics');

  // Create questions
  const questionsData = [
    {
      question: 'What is JSX?',
      answer: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
      difficulty: 'easy',
      type: 'quiz',
      topicId: 'react-basics-topic',
    },
    {
      question: 'What are React Hooks?',
      answer: 'React Hooks are functions that let you use state and other React features in functional components.',
      difficulty: 'medium',
      type: 'quiz',
      topicId: 'react-basics-topic',
    },
    {
      question: 'Explain the useEffect hook',
      answer: 'useEffect is a hook that lets you perform side effects in functional components. It runs after render and can be used for data fetching, subscriptions, or manually changing the DOM.',
      difficulty: 'medium',
      type: 'interview',
      topicId: 'react-basics-topic',
    },
    {
      question: 'What is TypeScript?',
      answer: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
      difficulty: 'easy',
      type: 'quiz',
      topicId: 'typescript-basics-topic',
    },
    {
      question: 'What are interfaces in TypeScript?',
      answer: 'Interfaces define the structure of an object, specifying what properties and methods it should have.',
      difficulty: 'medium',
      type: 'quiz',
      topicId: 'typescript-basics-topic',
    },
    {
      question: 'What is Node.js?',
      answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows running JavaScript on the server.',
      difficulty: 'easy',
      type: 'quiz',
      topicId: 'node-basics-topic',
    },
    {
      question: 'What is the event loop in Node.js?',
      answer: 'The event loop is what allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.',
      difficulty: 'hard',
      type: 'interview',
      topicId: 'node-basics-topic',
    },
  ];

  // We can't easily skip duplicates with random IDs unless we check content.
  // But for seeding, we might just want to insert if empty or just ignore.
  // Since we don't have stable IDs for questions in the data above (except implicitly),
  // I'll just insert them. If run multiple times, it might duplicate questions.
  // To avoid this, I should check if questions exist for the topic.
  
  // For simplicity, I'll delete existing questions for these topics and re-insert?
  // Or just check count.
  
  for (const q of questionsData) {
    const existing = await db.query.questions.findFirst({
      where: (questions, { eq, and }) => and(eq(questions.question, q.question), eq(questions.topicId, q.topicId)),
    });
    
    if (!existing) {
      await db.insert(questions).values(q).execute();
    }
  }

  console.log('✅ Created questions');

  // Create sample progress
  const someQuestions = await db.query.questions.findMany({ limit: 2 });

  for (const q of someQuestions) {
    await db.insert(progress).values({
      userId: user!.id,
      questionId: q.id,
      completed: true,
      score: 90,
      completedAt: new Date(),
    }).onConflictDoNothing().execute();
  }

  console.log('✅ Created sample progress');
  console.log('🎉 Database seeding completed!');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ Error seeding database:', e);
  process.exit(1);
});
