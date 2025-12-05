import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    MapPin, Link as LinkIcon, Calendar, Award, BookOpen,
    Users, Settings, Share2, Trophy, Flame, Target,
    Clock, Star, CheckCircle2, Zap, Sparkles
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { paths, topics, questions, users, progress, lessons } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"

async function getUserProfile(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });
    return user;
}

async function getUserStats(userId: string) {
    // Get all progress for user
    const userProgress = await db.select({
        lessonId: progress.lessonId
    })
        .from(progress)
        .where(and(eq(progress.userId, userId), eq(progress.completed, true)));

    const totalPoints = userProgress.length * 10; // 10 points per lesson

    // Get paths progress
    const rows = await db.select({
        pathId: paths.id,
        pathTitle: paths.title,
        pathCategory: paths.category,
        totalLessons: sql<number>`count(distinct ${lessons.id})`,
        completedLessons: sql<number>`count(distinct case when ${progress.completed} then ${progress.lessonId} end)`
    })
        .from(paths)
        .innerJoin(topics, eq(topics.pathId, paths.id))
        .innerJoin(lessons, eq(lessons.topicId, topics.id))
        .leftJoin(progress, and(eq(progress.lessonId, lessons.id), eq(progress.userId, userId)))
        .groupBy(paths.id, paths.title, paths.category);

    // Filter paths where user has at least some progress
    const myPaths = rows.filter(r => Number(r.completedLessons) > 0).map(r => ({
        id: r.pathId,
        title: r.pathTitle,
        category: r.pathCategory,
        totalLessons: Number(r.totalLessons),
        completedLessons: Number(r.completedLessons),
        progress: Math.round((Number(r.completedLessons) / Number(r.totalLessons)) * 100),
        lastAccessed: "Recently" // Placeholder
    }));

    const pathsCompleted = myPaths.filter(p => p.progress === 100).length;

    return {
        totalPoints,
        pathsCompleted,
        myPaths
    };
}

async function getCreatedPaths(userId: string) {
    const created = await db.query.paths.findMany({
        where: eq(paths.userId, userId),
        orderBy: [desc(paths.createdAt)]
    });
    return created;
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await getUserProfile(session.user.id);
    if (!user) redirect("/login");

    const { totalPoints, pathsCompleted, myPaths } = await getUserStats(user.id);
    const createdPaths = await getCreatedPaths(user.id);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                            <AvatarImage src="" alt={user.name || ""} />
                            <AvatarFallback className="text-3xl">{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold">{user.name}</h1>
                                        <p className="text-muted-foreground">@{user.email.split('@')[0]}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="cursor-pointer">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button size="sm" asChild className="cursor-pointer">
                                            <Link href="/settings">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-3 text-muted-foreground">No bio yet.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {user.createdAt.toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div>
                                    <span className="font-bold text-lg">0</span>
                                    <span className="text-muted-foreground ml-1">Followers</span>
                                </div>
                                <div>
                                    <span className="font-bold text-lg">0</span>
                                    <span className="text-muted-foreground ml-1">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Total Points
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalPoints.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Flame className="h-4 w-4" />
                            Current Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0 days</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Paths Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pathsCompleted}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Badges Earned
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="learning" className="w-full">
                <TabsList>
                    <TabsTrigger value="learning" className="cursor-pointer">
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Paths
                    </TabsTrigger>
                    <TabsTrigger value="created" className="cursor-pointer">
                        <Target className="h-4 w-4 mr-2" />
                        Created Paths
                    </TabsTrigger>
                    <TabsTrigger value="badges" className="cursor-pointer">
                        <Award className="h-4 w-4 mr-2" />
                        Badges
                    </TabsTrigger>
                </TabsList>

                {/* My Paths Tab */}
                <TabsContent value="learning" className="mt-6 space-y-4">
                    {myPaths.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            You haven't started any paths yet.
                        </div>
                    )}
                    {myPaths.map((path) => (
                        <Card key={path.id} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline">{path.category}</Badge>
                                            {path.progress === 100 && (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Completed
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl">
                                            <Link href={`/path/${path.id}`} className="hover:text-primary transition-colors">
                                                {path.title}
                                            </Link>
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">
                                            {path.completedLessons} of {path.totalLessons} lessons completed
                                        </span>
                                        <span className="font-medium">{path.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${path.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        Last accessed {path.lastAccessed}
                                    </div>
                                    <Button size="sm" asChild className="cursor-pointer">
                                        <Link href={`/path/${path.id}`}>
                                            {path.progress === 100 ? "Review" : "Continue"}
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Created Paths Tab */}
                <TabsContent value="created" className="mt-6 space-y-4">
                    {createdPaths.map((path) => (
                        <Card key={path.id} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <Link href={`/path/${path.id}`} className="hover:text-primary transition-colors">
                                        {path.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription>Published {path.createdAt.toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>0 students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span>5.0 (0 ratings)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild className="cursor-pointer">
                                            <Link href={`/path/${path.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button size="sm" asChild className="cursor-pointer">
                                            <Link href={`/path/${path.id}`}>View</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full cursor-pointer" asChild>
                        <Link href="/create">Create New Path</Link>
                    </Button>
                </TabsContent>

                {/* Badges Tab */}
                <TabsContent value="badges" className="mt-6">
                    <div className="text-center py-10 text-muted-foreground">
                        Badges coming soon...
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
