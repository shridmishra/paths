# API Hooks Quick Reference

Quick reference for all available React Query hooks.

## Paths

### usePaths()
Fetch all learning paths.

```tsx
const { data, isLoading, error } = usePaths();
// data: Path[]
```

### usePath(id)
Fetch a single path by ID.

```tsx
const { data, isLoading, error } = usePath('path-id');
// data: Path
```

### useCreatePath()
Create a new path.

```tsx
const createPath = useCreatePath();

await createPath.mutateAsync({
  title: 'My Path',
  description: 'Description',
  difficulty: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
  category: 'frontend',
  userId: 'user-id',
});
```

### useUpdatePath()
Update an existing path.

```tsx
const updatePath = useUpdatePath();

await updatePath.mutateAsync({
  id: 'path-id',
  data: {
    title: 'Updated Title',
    description: 'Updated Description',
  },
});
```

### useDeletePath()
Delete a path.

```tsx
const deletePath = useDeletePath();

await deletePath.mutateAsync('path-id');
```

## Topics

### useTopics()
Fetch all topics.

```tsx
const { data, isLoading, error } = useTopics();
// data: Topic[]
```

### useTopic(id)
Fetch a single topic by ID.

```tsx
const { data, isLoading, error } = useTopic('topic-id');
// data: Topic
```

### useCreateTopic()
Create a new topic.

```tsx
const createTopic = useCreateTopic();

await createTopic.mutateAsync({
  title: 'My Topic',
  description: 'Description',
  order: 1,
  pathId: 'path-id',
});
```

## Questions

### useQuestions(filters?)
Fetch questions with optional filters.

```tsx
// All questions
const { data } = useQuestions();

// Filter by type
const { data } = useQuestions({ type: 'quiz' }); // 'quiz' | 'interview'

// Filter by difficulty
const { data } = useQuestions({ difficulty: 'easy' }); // 'easy' | 'medium' | 'hard'

// Filter by topic
const { data } = useQuestions({ topicId: 'topic-id' });

// Multiple filters
const { data } = useQuestions({
  type: 'quiz',
  difficulty: 'easy',
  topicId: 'topic-id',
});
// data: Question[]
```

### useQuestion(id)
Fetch a single question by ID.

```tsx
const { data, isLoading, error } = useQuestion('question-id');
// data: Question
```

### useCreateQuestion()
Create a new question.

```tsx
const createQuestion = useCreateQuestion();

await createQuestion.mutateAsync({
  question: 'What is React?',
  answer: 'A JavaScript library for building user interfaces',
  difficulty: 'easy', // 'easy' | 'medium' | 'hard'
  type: 'quiz', // 'quiz' | 'interview'
  topicId: 'topic-id',
});
```

## Progress

### useUserProgress(userId)
Fetch all progress for a user.

```tsx
const { data, isLoading, error } = useUserProgress('user-id');
// data: Progress[]
```

### useUserProgressStats(userId)
Fetch progress statistics for a user.

```tsx
const { data, isLoading, error } = useUserProgressStats('user-id');
// data: ProgressStats
// {
//   totalQuestions: number,
//   completedQuestions: number,
//   averageScore: number,
//   completionRate: number
// }
```

### useCreateOrUpdateProgress()
Create or update user progress.

```tsx
const updateProgress = useCreateOrUpdateProgress();

await updateProgress.mutateAsync({
  userId: 'user-id',
  questionId: 'question-id',
  completed: true,
  score: 90,
});
```

## TypeScript Types

### Path
```typescript
interface Path {
  id: string;
  title: string;
  description: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  topics?: Topic[];
}
```

### Topic
```typescript
interface Topic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  pathId: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}
```

### Question
```typescript
interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'interview';
  topicId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Progress
```typescript
interface Progress {
  id: string;
  completed: boolean;
  score: number | null;
  completedAt: string | null;
  userId: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Common Patterns

### Loading State
```tsx
const { data, isLoading, error } = usePaths();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!data) return null;

return <div>{/* render data */}</div>;
```

### Mutation with Feedback
```tsx
const createPath = useCreatePath();

const handleCreate = async () => {
  try {
    await createPath.mutateAsync(data);
    toast.success('Created successfully!');
  } catch (error) {
    toast.error('Failed to create');
  }
};
```

### Conditional Queries
```tsx
// Only fetch when ID is available
const { data } = usePath(id ?? '');

// Or with enabled option
const { data } = useQuery({
  queryKey: ['path', id],
  queryFn: () => api.get(`/paths/${id}`),
  enabled: !!id, // Only run when id exists
});
```

## Direct API Client

For cases where you need more control, use the API client directly:

```tsx
import { apiClient } from '@/lib/api-client';

// GET request
const paths = await apiClient.get<Path[]>('/api/v1/paths');

// POST request
const newPath = await apiClient.post<Path>('/api/v1/paths', {
  title: 'New Path',
  // ...
});

// PUT request
const updated = await apiClient.put<Path>(`/api/v1/paths/${id}`, {
  title: 'Updated',
});

// DELETE request
await apiClient.delete(`/api/v1/paths/${id}`);
```

## Error Handling

```tsx
import { APIError } from '@/lib/api-client';

try {
  await createPath.mutateAsync(data);
} catch (error) {
  if (error instanceof APIError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
  }
}
```
