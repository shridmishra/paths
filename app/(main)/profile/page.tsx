import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    MapPin, Link as LinkIcon, Calendar, Award, BookOpen,
    Users, Settings, Share2, Trophy, Flame, Target,
    Clock, Star, CheckCircle2
} from "lucide-react"
import Link from "next/link"

// Mock user data
const userData = {
    name: "John Doe",
    username: "johndoe",
    avatar: "/avatars/user.jpg",
    bio: "Passionate learner and developer. Love building things with React and Next.js.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinedDate: "January 2024",
    stats: {
        pathsCompleted: 12,
        pathsCreated: 3,
        followers: 245,
        following: 189,
        totalPoints: 7890,
        currentStreak: 15,
        longestStreak: 28,
        badges: 8
    }
}

const myPaths = [
    {
        id: 1,
        title: "Master React & Next.js",
        progress: 75,
        totalLessons: 40,
        completedLessons: 30,
        lastAccessed: "2 hours ago",
        category: "Web Development"
    },
    {
        id: 2,
        title: "Python for Data Science",
        progress: 45,
        totalLessons: 50,
        completedLessons: 22,
        lastAccessed: "1 day ago",
        category: "Data Science"
    },
    {
        id: 3,
        title: "UI/UX Design Fundamentals",
        progress: 100,
        totalLessons: 25,
        completedLessons: 25,
        lastAccessed: "3 days ago",
        category: "Design"
    }
]

const createdPaths = [
    {
        id: 1,
        title: "Introduction to TypeScript",
        students: 156,
        rating: 4.7,
        totalRatings: 42,
        published: "2 months ago"
    },
    {
        id: 2,
        title: "React Testing Best Practices",
        students: 89,
        rating: 4.8,
        totalRatings: 23,
        published: "1 month ago"
    }
]

const badges = [
    { id: 1, name: "Fast Learner", description: "Complete 5 lessons in one day", icon: "⚡" },
    { id: 2, name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥" },
    { id: 3, name: "Path Creator", description: "Create your first path", icon: "✨" },
    { id: 4, name: "Community Helper", description: "Help 10 other learners", icon: "🤝" },
    { id: 5, name: "Top Contributor", description: "Earn 5000 points", icon: "🏆" },
    { id: 6, name: "Completionist", description: "Complete 10 paths", icon: "✅" }
]

export default function ProfilePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                            <AvatarImage src={userData.avatar} alt={userData.name} />
                            <AvatarFallback className="text-3xl">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold">{userData.name}</h1>
                                        <p className="text-muted-foreground">@{userData.username}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href="/settings">
                                                <Settings className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-3 text-muted-foreground">{userData.bio}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {userData.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {userData.location}
                                    </div>
                                )}
                                {userData.website && (
                                    <a
                                        href={userData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        {userData.website.replace('https://', '')}
                                    </a>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Joined {userData.joinedDate}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div>
                                    <span className="font-bold text-lg">{userData.stats.followers}</span>
                                    <span className="text-muted-foreground ml-1">Followers</span>
                                </div>
                                <div>
                                    <span className="font-bold text-lg">{userData.stats.following}</span>
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
                        <div className="text-3xl font-bold">{userData.stats.totalPoints.toLocaleString()}</div>
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
                        <div className="text-3xl font-bold">{userData.stats.currentStreak} days</div>
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
                        <div className="text-3xl font-bold">{userData.stats.pathsCompleted}</div>
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
                        <div className="text-3xl font-bold">{userData.stats.badges}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="learning" className="w-full">
                <TabsList>
                    <TabsTrigger value="learning">
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Paths
                    </TabsTrigger>
                    <TabsTrigger value="created">
                        <Target className="h-4 w-4 mr-2" />
                        Created Paths
                    </TabsTrigger>
                    <TabsTrigger value="badges">
                        <Award className="h-4 w-4 mr-2" />
                        Badges
                    </TabsTrigger>
                </TabsList>

                {/* My Paths Tab */}
                <TabsContent value="learning" className="mt-6 space-y-4">
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
                                    <Button size="sm" asChild>
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
                                <CardDescription>Published {path.published}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{path.students} students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span>{path.rating} ({path.totalRatings} ratings)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/path/${path.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href={`/path/${path.id}`}>View</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/create">Create New Path</Link>
                    </Button>
                </TabsContent>

                {/* Badges Tab */}
                <TabsContent value="badges" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {badges.map((badge) => (
                            <Card key={badge.id} className="hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex items-start gap-3">
                                        <div className="text-4xl">{badge.icon}</div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{badge.name}</CardTitle>
                                            <CardDescription className="mt-1">{badge.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
