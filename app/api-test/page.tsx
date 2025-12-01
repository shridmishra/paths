'use client';

import { usePaths, useTopics, useQuestions } from '@/lib/hooks/use-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApiTestPage() {
    const { data: paths, isLoading: pathsLoading, error: pathsError } = usePaths();
    const { data: topics, isLoading: topicsLoading } = useTopics();
    const { data: questions, isLoading: questionsLoading } = useQuestions();

    if (pathsLoading || topicsLoading || questionsLoading) {
        return (
            <div className="container mx-auto p-8 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    if (pathsError) {
        return (
            <div className="container mx-auto p-8">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle>Error Loading Data</CardTitle>
                        <CardDescription>
                            Failed to connect to the API. Make sure the backend is running.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                            {JSON.stringify(pathsError, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">🎉 Frontend-Backend Connected!</h1>
                <p className="text-muted-foreground">
                    This page is fetching live data from the API backend
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{paths?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topics?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{questions?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">API Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="default" className="bg-green-500">Connected</Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Paths */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Learning Paths</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {paths?.map((path) => (
                        <Card key={path.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle>{path.title}</CardTitle>
                                    <Badge variant="outline">{path.difficulty}</Badge>
                                </div>
                                <CardDescription>{path.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="secondary">{path.category}</Badge>
                                    {path.topics && (
                                        <span>{path.topics.length} topics</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Topics */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">All Topics</h2>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {topics?.map((topic) => (
                        <Card key={topic.id} className="hover:border-primary transition-colors">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">{topic.title}</CardTitle>
                                {topic.description && (
                                    <CardDescription className="text-xs line-clamp-2">
                                        {topic.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Sample Questions</h2>
                <div className="space-y-3">
                    {questions?.slice(0, 5).map((question) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-base font-medium">
                                        {question.question}
                                    </CardTitle>
                                    <div className="flex gap-2 shrink-0">
                                        <Badge variant="outline">{question.difficulty}</Badge>
                                        <Badge variant="secondary">{question.type}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{question.answer}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Raw Data */}
            <details className="space-y-4">
                <summary className="text-xl font-bold cursor-pointer hover:text-primary">
                    View Raw API Response
                </summary>
                <Card>
                    <CardHeader>
                        <CardTitle>Paths JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                            {JSON.stringify(paths, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </details>
        </div>
    );
}
