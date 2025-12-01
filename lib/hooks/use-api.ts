/**
 * React Query hooks for fetching data from the API
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  Path,
  Topic,
  Question,
  Progress,
  ProgressStats,
  CreatePathRequest,
  CreateTopicRequest,
  CreateQuestionRequest,
  CreateProgressRequest,
  UpdateProgressRequest,
} from '@/lib/types';

// Query Keys
export const queryKeys = {
  paths: ['paths'] as const,
  path: (id: string) => ['paths', id] as const,
  topics: ['topics'] as const,
  topic: (id: string) => ['topics', id] as const,
  questions: (filters?: { type?: string; difficulty?: string; topicId?: string }) =>
    ['questions', filters] as const,
  question: (id: string) => ['questions', id] as const,
  userProgress: (userId: string) => ['progress', 'user', userId] as const,
  userProgressStats: (userId: string) => ['progress', 'user', userId, 'stats'] as const,
};

// Paths
export function usePaths() {
  return useQuery({
    queryKey: queryKeys.paths,
    queryFn: () => apiClient.get<Path[]>('/api/v1/paths'),
  });
}

export function usePath(id: string) {
  return useQuery({
    queryKey: queryKeys.path(id),
    queryFn: () => apiClient.get<Path>(`/api/v1/paths/${id}`),
    enabled: !!id,
  });
}

export function useCreatePath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePathRequest) =>
      apiClient.post<Path>('/api/v1/paths', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paths });
    },
  });
}

export function useUpdatePath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePathRequest> }) =>
      apiClient.put<Path>(`/api/v1/paths/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paths });
      queryClient.invalidateQueries({ queryKey: queryKeys.path(variables.id) });
    },
  });
}

export function useDeletePath() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/v1/paths/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paths });
    },
  });
}

// Topics
export function useTopics() {
  return useQuery({
    queryKey: queryKeys.topics,
    queryFn: () => apiClient.get<Topic[]>('/api/v1/topics'),
  });
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: queryKeys.topic(id),
    queryFn: () => apiClient.get<Topic>(`/api/v1/topics/${id}`),
    enabled: !!id,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTopicRequest) =>
      apiClient.post<Topic>('/api/v1/topics', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
    },
  });
}

// Questions
export function useQuestions(filters?: {
  type?: string;
  difficulty?: string;
  topicId?: string;
}) {
  return useQuery({
    queryKey: queryKeys.questions(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.topicId) params.append('topicId', filters.topicId);

      const queryString = params.toString();
      return apiClient.get<Question[]>(
        `/api/v1/questions${queryString ? `?${queryString}` : ''}`,
      );
    },
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: queryKeys.question(id),
    queryFn: () => apiClient.get<Question>(`/api/v1/questions/${id}`),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      apiClient.post<Question>('/api/v1/questions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.questions() });
    },
  });
}

// Progress
export function useUserProgress(userId: string) {
  return useQuery({
    queryKey: queryKeys.userProgress(userId),
    queryFn: () => apiClient.get<Progress[]>(`/api/v1/progress/user/${userId}`),
    enabled: !!userId,
  });
}

export function useUserProgressStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.userProgressStats(userId),
    queryFn: () => apiClient.get<ProgressStats>(`/api/v1/progress/user/${userId}/stats`),
    enabled: !!userId,
  });
}

export function useCreateOrUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgressRequest) =>
      apiClient.post<Progress>('/api/v1/progress', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProgress(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProgressStats(variables.userId),
      });
    },
  });
}
