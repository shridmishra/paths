import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@paths.dev' },
    update: {},
    create: {
      email: 'demo@paths.dev',
      name: 'Demo User',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create learning paths
  const frontendPath = await prisma.path.upsert({
    where: { id: 'frontend-path-1' },
    update: {},
    create: {
      id: 'frontend-path-1',
      title: 'Frontend Development',
      description: 'Master modern frontend development with React, TypeScript, and Next.js',
      difficulty: 'intermediate',
      category: 'frontend',
      userId: user.id,
    },
  });

  const backendPath = await prisma.path.upsert({
    where: { id: 'backend-path-1' },
    update: {},
    create: {
      id: 'backend-path-1',
      title: 'Backend Development',
      description: 'Learn backend development with Node.js, Express, and databases',
      difficulty: 'intermediate',
      category: 'backend',
      userId: user.id,
    },
  });

  console.log('✅ Created learning paths');

  // Create topics for frontend path
  const reactTopic = await prisma.topic.upsert({
    where: { id: 'react-basics-topic' },
    update: {},
    create: {
      id: 'react-basics-topic',
      title: 'React Basics',
      description: 'Learn the fundamentals of React',
      order: 1,
      pathId: frontendPath.id,
    },
  });

  const typescriptTopic = await prisma.topic.upsert({
    where: { id: 'typescript-basics-topic' },
    update: {},
    create: {
      id: 'typescript-basics-topic',
      title: 'TypeScript Fundamentals',
      description: 'Master TypeScript for type-safe development',
      order: 2,
      pathId: frontendPath.id,
    },
  });

  // Create topics for backend path
  const nodeTopic = await prisma.topic.upsert({
    where: { id: 'node-basics-topic' },
    update: {},
    create: {
      id: 'node-basics-topic',
      title: 'Node.js Basics',
      description: 'Learn server-side JavaScript with Node.js',
      order: 1,
      pathId: backendPath.id,
    },
  });

  console.log('✅ Created topics');

  // Create questions for React topic
  await prisma.question.createMany({
    data: [
      {
        question: 'What is JSX?',
        answer: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
        difficulty: 'easy',
        type: 'quiz',
        topicId: reactTopic.id,
      },
      {
        question: 'What are React Hooks?',
        answer: 'React Hooks are functions that let you use state and other React features in functional components.',
        difficulty: 'medium',
        type: 'quiz',
        topicId: reactTopic.id,
      },
      {
        question: 'Explain the useEffect hook',
        answer: 'useEffect is a hook that lets you perform side effects in functional components. It runs after render and can be used for data fetching, subscriptions, or manually changing the DOM.',
        difficulty: 'medium',
        type: 'interview',
        topicId: reactTopic.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create questions for TypeScript topic
  await prisma.question.createMany({
    data: [
      {
        question: 'What is TypeScript?',
        answer: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
        difficulty: 'easy',
        type: 'quiz',
        topicId: typescriptTopic.id,
      },
      {
        question: 'What are interfaces in TypeScript?',
        answer: 'Interfaces define the structure of an object, specifying what properties and methods it should have.',
        difficulty: 'medium',
        type: 'quiz',
        topicId: typescriptTopic.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create questions for Node.js topic
  await prisma.question.createMany({
    data: [
      {
        question: 'What is Node.js?',
        answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine that allows running JavaScript on the server.',
        difficulty: 'easy',
        type: 'quiz',
        topicId: nodeTopic.id,
      },
      {
        question: 'What is the event loop in Node.js?',
        answer: 'The event loop is what allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.',
        difficulty: 'hard',
        type: 'interview',
        topicId: nodeTopic.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created questions');

  // Create some sample progress
  const questions = await prisma.question.findMany({
    take: 2,
  });

  for (const question of questions) {
    await prisma.progress.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        questionId: question.id,
        completed: true,
        score: 90,
        completedAt: new Date(),
      },
    });
  }

  console.log('✅ Created sample progress');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
