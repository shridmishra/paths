import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Separator } from "@workspace/ui/components/separator"
import {
    BookOpen, Clock, Users, Star, CheckCircle2, Circle, Play,
    MessageSquare, Share2, Bookmark, Award
} from "lucide-react"
import Link from "next/link"

// Mock data
const pathData = {
    id: 1,
    title: "Master React & Next.js",
    description: "Learn modern React development with Next.js, from basics to advanced patterns. This comprehensive path covers everything you need to become a proficient React developer.",
    author: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        username: "sarahchen",
        bio: "Senior Frontend Engineer at Tech Corp. 10+ years of experience."
    },
    category: "Web Development",
    difficulty: "Intermediate",
    duration: "8 weeks",
    students: 1234,
    rating: 4.8,
    totalRatings: 456,
    progress: 35,
    tags: ["React", "Next.js", "TypeScript"],
    modules: [
        {
            id: 1,
            title: "Introduction to React",
            lessons: [
                { id: 1, title: "What is React?", duration: "15 min", completed: true },
                { id: 2, title: "Setting up your environment", duration: "20 min", completed: true },
                { id: 3, title: "Your first component", duration: "25 min", completed: true },
                { id: 4, title: "Props and State", duration: "30 min", completed: false }
            ]
        },
        {
            id: 2,
            title: "React Hooks Deep Dive",
            lessons: [
                { id: 5, title: "useState and useEffect", duration: "35 min", completed: false },
                { id: 6, title: "useContext and useReducer", duration: "40 min", completed: false },
                { id: 7, title: "Custom Hooks", duration: "30 min", completed: false }
            ]
        },
        {
            id: 3,
            title: "Next.js Fundamentals",
            lessons: [
                { id: 8, title: "Pages and Routing", duration: "25 min", completed: false },
                { id: 9, title: "Server Components", duration: "35 min", completed: false },
                { id: 10, title: "Data Fetching", duration: "40 min", completed: false }
            ]
        }
    ]
}

export default async function PathViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const completedLessons = pathData.modules.reduce(
        (acc, module) => acc + module.lessons.filter(l => l.completed).length,
        0
    )
    const totalLessons = pathData.modules.reduce((acc, module) => acc + module.lessons.length, 0)

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{pathData.category}</Badge>
                            <Badge variant="secondary">{pathData.difficulty}</Badge>
                            {pathData.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{pathData.title}</h1>
                        <p className="text-lg text-muted-foreground">{pathData.description}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{pathData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{pathData.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{pathData.rating} ({pathData.totalRatings} ratings)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{totalLessons} lessons</span>
                    </div>
                </div>

                {/* Progress */}
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
                                    style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="lg" className="gap-2">
                        <Play className="h-4 w-4" />
                        Continue Learning
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                        <Bookmark className="h-4 w-4" />
                        Save
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
                <TabsList>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="discussion">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discussion
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum" className="mt-6 space-y-4">
                    {pathData.modules.map((module, idx) => (
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
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <h3 className="font-semibold mb-2">What you'll learn</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span>Build modern React applications with hooks and functional components</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span>Master Next.js for server-side rendering and static site generation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span>Implement TypeScript for type-safe React development</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                        <span>Deploy production-ready applications</span>
                                    </li>
                                </ul>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-4">Instructor</h3>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={pathData.author.avatar} alt={pathData.author.name} />
                                        <AvatarFallback>{pathData.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg">{pathData.author.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">@{pathData.author.username}</p>
                                        <p className="text-sm">{pathData.author.bio}</p>
                                        <Button variant="outline" size="sm" className="mt-3" asChild>
                                            <Link href={`/profile/${pathData.author.username}`}>View Profile</Link>
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
                            <Button asChild>
                                <Link href={`/path/${pathData.id}/discussion`}>View Discussions</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
