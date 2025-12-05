import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Flame, Crown } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { users, progress } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getLeaderboard() {
    const leaderboard = await db.select({
        userId: users.id,
        name: users.name,
        email: users.email,
        points: sql<number>`count(${progress.id}) * 10`
    })
        .from(users)
        .leftJoin(progress, and(eq(progress.userId, users.id), eq(progress.completed, true)))
        .groupBy(users.id, users.name, users.email)
        .orderBy(desc(sql`count(${progress.id})`))
        .limit(50);

    return leaderboard.map((entry, index) => ({
        rank: index + 1,
        user: {
            name: entry.name || "Unknown",
            username: entry.email.split('@')[0],
            avatar: "" // Placeholder
        },
        points: Number(entry.points),
        pathsCompleted: 0, // Placeholder as it's expensive to calc
        streak: 0, // Placeholder
        badges: 0, // Placeholder
        change: 0 // Placeholder
    }));
}

function getRankIcon(rank: number) {
    switch (rank) {
        case 1:
            return <Crown className="h-6 w-6 text-yellow-500" />
        case 2:
            return <Medal className="h-6 w-6 text-gray-400" />
        case 3:
            return <Medal className="h-6 w-6 text-amber-700" />
        default:
            return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
}

function getRankBadgeColor(rank: number) {
    switch (rank) {
        case 1:
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
        case 2:
            return "bg-gray-400/10 text-gray-400 border-gray-400/20"
        case 3:
            return "bg-amber-700/10 text-amber-700 border-amber-700/20"
        default:
            return ""
    }
}

function LeaderboardRow({ entry }: { entry: any }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors">
            <div className="flex items-center justify-center w-12">
                {getRankIcon(entry.rank)}
            </div>

            <Link href={`/profile/${entry.user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                    <AvatarFallback>{entry.user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{entry.user.name}</p>
                        {entry.rank <= 3 && (
                            <Badge className={getRankBadgeColor(entry.rank)}>
                                Top {entry.rank}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{entry.user.username}</p>
                </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                    <p className="font-bold text-lg">{entry.points.toLocaleString()}</p>
                    <p className="text-muted-foreground">Points</p>
                </div>
                {/* 
                <div className="text-center">
                    <p className="font-bold text-lg">{entry.pathsCompleted}</p>
                    <p className="text-muted-foreground">Paths</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <p className="font-bold text-lg">{entry.streak}</p>
                    </div>
                    <p className="text-muted-foreground">Streak</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <Award className="h-4 w-4 text-purple-500" />
                        <p className="font-bold text-lg">{entry.badges}</p>
                    </div>
                    <p className="text-muted-foreground">Badges</p>
                </div>
                */}
            </div>

            {/*
            {entry.change !== 0 && (
                <div className="flex items-center gap-1">
                    <TrendingUp
                        className={`h-4 w-4 ${entry.change > 0 ? 'text-green-500 rotate-0' : 'text-red-500 rotate-180'}`}
                    />
                    <span className={`text-sm font-medium ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(entry.change)}
                    </span>
                </div>
            )}
            */}
        </div>
    )
}

export default async function LeaderboardPage() {
    const session = await getServerSession(authOptions);
    const leaderboardData = await getLeaderboard();

    const currentUserEntry = session?.user?.email
        ? leaderboardData.find(e => e.user.username === session.user?.email?.split('@')[0])
        : null;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <Trophy className="h-12 w-12 text-yellow-500" />
                    <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    See how you rank against other learners
                </p>
            </div>

            {/* Stats Cards */}
            {currentUserEntry && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Your Rank
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">#{currentUserEntry.rank}</div>
                            {/*
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="text-green-500">↑ 0</span> from last week
                            </p>
                            */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Your Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{currentUserEntry.points.toLocaleString()}</div>
                            {/*
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="text-green-500">+0</span> this week
                            </p>
                            */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Current Streak
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Flame className="h-8 w-8 text-orange-500" />
                                <div className="text-3xl font-bold">0</div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                days in a row
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Leaderboard Tabs */}
            <Tabs defaultValue="all-time" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                    <TabsTrigger value="all-time">All Time</TabsTrigger>
                    <TabsTrigger value="monthly">This Month</TabsTrigger>
                    <TabsTrigger value="weekly">This Week</TabsTrigger>
                </TabsList>

                <TabsContent value="all-time" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Learners</CardTitle>
                            <CardDescription>
                                The most dedicated learners on the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {leaderboardData.map((entry) => (
                                <LeaderboardRow key={entry.rank} entry={entry} />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="monthly" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>This Month&apos;s Leaders</CardTitle>
                            <CardDescription>
                                Top performers this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-muted-foreground text-center py-4">Coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="weekly" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>This Week&apos;s Leaders</CardTitle>
                            <CardDescription>
                                Top performers this week
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-muted-foreground text-center py-4">Coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
