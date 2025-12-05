import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    BookOpen, Clock, Users, Star, CheckCircle2, Circle, Play,
    MessageSquare, Share2, Bookmark
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { paths, topics, lessons, users, progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ShareButton } from "@/components/ShareButton"

async function getPath(id: string) {
    const path = await db.query.paths.findFirst({
        where: eq(paths.id, id),
        with: {
            user: true,
            topics: {
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.order)]
                    }
                },
                orderBy: (topics, { asc }) => [asc(topics.order)]
            }
        }
    });
    return path;
}

async function getUserProgress(userId: string | undefined, pathId: string) {
    if (!userId) return { completedLessonIds: new Set<string>() };

    const userProgress = await db.select({
        lessonId: progress.lessonId,
        completed: progress.completed
    })
        .from(progress)
        .innerJoin(lessons, eq(progress.lessonId, lessons.id))
        .innerJoin(topics, eq(lessons.topicId, topics.id))
        .where(and(
            eq(progress.userId, userId),
            eq(topics.pathId, pathId),
            eq(progress.completed, true)
        ));

    return {
        completedLessonIds: new Set(userProgress.map(p => p.lessonId).filter(Boolean) as string[])
    };
}

export default async function PathViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const path = await getPath(id);

    if (!path) {
        notFound();
    }

    const { completedLessonIds } = await getUserProgress(session?.user?.id, id);

    // Map DB data to UI structure
    const modules = path.topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        lessons: topic.lessons.map(l => ({
            id: l.id,
            title: l.title,
            duration: l.duration || "15 min",
            completed: completedLessonIds.has(l.id)
        }))
    }));

    const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = modules.reduce(
        (acc, module) => acc + module.lessons.filter(l => l.completed).length,
        0
    );
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Find first incomplete lesson
    let firstIncompleteLessonId = null;
    for (const module of modules) {
        for (const lesson of module.lessons) {
            if (!lesson.completed) {
                firstIncompleteLessonId = lesson.id;
                break;
            }
        }
        if (firstIncompleteLessonId) break;
    }

    // If all completed, link to the first lesson of the first module (review)
    if (!firstIncompleteLessonId && modules.length > 0 && modules[0].lessons.length > 0) {
        firstIncompleteLessonId = modules[0].lessons[0].id;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{path.category}</Badge>
                            <Badge variant="secondary">{path.difficulty}</Badge>
                            {/* Tags placeholder */}
                            <Badge variant="outline" className="text-xs">
                                {path.category}
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{path.title}</h1>
                        <p className="text-lg text-muted-foreground">{path.description}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>8 weeks</span> {/* Placeholder */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>0 students</span> {/* Placeholder */}
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>5.0 (0 ratings)</span> {/* Placeholder */}
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{totalLessons} lessons</span>
                    </div>
                </div>

                {/* Progress */}
                {session?.user && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Your Progress</span>
                                    <span className="text-muted-foreground">
                                        {completedLessons} of {totalLessons} lessons completed
                                    </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="lg" className="gap-2 cursor-pointer" asChild>
                        <Link href={firstIncompleteLessonId ? `/path/${id}/lesson/${firstIncompleteLessonId}` : "#"}>
                            <Play className="h-4 w-4" />
                            {progressPercentage > 0 ? "Continue Learning" : "Start Path"}
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2 cursor-pointer">
                        <Bookmark className="h-4 w-4" />
                        Save
                    </Button>
                    <ShareButton />
                </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
                <TabsList>
                    <TabsTrigger value="curriculum" className="cursor-pointer">Curriculum</TabsTrigger>
                    <TabsTrigger value="about" className="cursor-pointer">About</TabsTrigger>
                    <TabsTrigger value="reviews" className="cursor-pointer">Reviews</TabsTrigger>
                    <TabsTrigger value="discussion" className="cursor-pointer">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discussion
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6 space-y-4">
                    {modules.map((module, idx) => (
                        <Card key={module.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                                        {idx + 1}
                                    </div>
                                    {module.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                {lesson.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                )}
                                                <div>
                                                    <p className="font-medium group-hover:text-primary transition-colors">
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>About this Path</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{path.description}</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-4">Instructor</h3>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="" alt={path.user.name || ""} />
                                        <AvatarFallback>{path.user.name?.split(' ').map(n => n[0]).join('') || '?'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg">{path.user.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">@{path.user.email.split('@')[0]}</p>
                                        <Button variant="outline" size="sm" className="mt-3 cursor-pointer" asChild>
                                            <Link href={`/profile/${path.user.email.split('@')[0]}`}>View Profile</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Reviews</CardTitle>
                            <CardDescription>See what others are saying about this path</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Reviews coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="discussion" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Discussion</CardTitle>
                            <CardDescription>Ask questions and share insights with other learners</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="cursor-pointer">
                                <Link href={`/path/${path.id}/discussion`}>View Discussions</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
