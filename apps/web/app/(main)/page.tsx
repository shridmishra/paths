import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { BookOpen, Clock, Users, Star, TrendingUp, Flame } from "lucide-react"
import Link from "next/link"

// Mock data for paths
const paths = [
    {
        id: 1,
        title: "Master React & Next.js",
        description: "Learn modern React development with Next.js, from basics to advanced patterns",
        author: { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", username: "sarahchen" },
        category: "Web Development",
        difficulty: "Intermediate",
        duration: "8 weeks",
        students: 1234,
        rating: 4.8,
        progress: 0,
        tags: ["React", "Next.js", "TypeScript"],
        trending: true
    },
    {
        id: 2,
        title: "Python for Data Science",
        description: "Complete guide to data analysis and machine learning with Python",
        author: { name: "Alex Kumar", avatar: "/avatars/alex.jpg", username: "alexk" },
        category: "Data Science",
        difficulty: "Beginner",
        duration: "10 weeks",
        students: 2156,
        rating: 4.9,
        progress: 0,
        tags: ["Python", "Pandas", "ML"],
        trending: true
    },
    {
        id: 3,
        title: "System Design Fundamentals",
        description: "Learn to design scalable systems and ace your technical interviews",
        author: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", username: "mikej" },
        category: "System Design",
        difficulty: "Advanced",
        duration: "6 weeks",
        students: 892,
        rating: 4.7,
        progress: 0,
        tags: ["Architecture", "Scalability", "Interviews"],
        trending: false
    },
    {
        id: 4,
        title: "Mobile App Development with Flutter",
        description: "Build beautiful cross-platform mobile apps with Flutter and Dart",
        author: { name: "Emma Wilson", avatar: "/avatars/emma.jpg", username: "emmaw" },
        category: "Mobile Development",
        difficulty: "Intermediate",
        duration: "12 weeks",
        students: 1567,
        rating: 4.6,
        progress: 0,
        tags: ["Flutter", "Dart", "Mobile"],
        trending: true
    },
    {
        id: 5,
        title: "DevOps & Cloud Engineering",
        description: "Master AWS, Docker, Kubernetes and modern DevOps practices",
        author: { name: "David Lee", avatar: "/avatars/david.jpg", username: "davidl" },
        category: "DevOps",
        difficulty: "Advanced",
        duration: "14 weeks",
        students: 743,
        rating: 4.8,
        progress: 0,
        tags: ["AWS", "Docker", "Kubernetes"],
        trending: false
    },
    {
        id: 6,
        title: "UI/UX Design Mastery",
        description: "Create stunning user interfaces and delightful user experiences",
        author: { name: "Lisa Park", avatar: "/avatars/lisa.jpg", username: "lisap" },
        category: "Design",
        difficulty: "Beginner",
        duration: "8 weeks",
        students: 1923,
        rating: 4.9,
        progress: 0,
        tags: ["Figma", "Design", "UX"],
        trending: true
    }
]

function PathCard({ path }: { path: typeof paths[0] }) {
    const difficultyColors = {
        Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
        Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Advanced: "bg-red-500/10 text-red-500 border-red-500/20"
    }

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{path.category}</Badge>
                            <Badge className={difficultyColors[path.difficulty as keyof typeof difficultyColors]}>
                                {path.difficulty}
                            </Badge>
                            {path.trending && (
                                <Badge variant="secondary" className="gap-1">
                                    <Flame className="h-3 w-3" />
                                    Trending
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            <Link href={`/path/${path.id}`}>{path.title}</Link>
                        </CardTitle>
                    </div>
                </div>
                <CardDescription className="line-clamp-2">{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {path.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {path.duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {path.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {path.rating}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={path.author.avatar} alt={path.author.name} />
                        <AvatarFallback>{path.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-medium">{path.author.name}</p>
                    </div>
                </div>
                <Button size="sm" asChild>
                    <Link href={`/path/${path.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Learning
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function HomePage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Discover Your Learning Path
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Explore curated learning paths created by experts. Start your journey today.
                </p>
            </div>

            {/* Tabs for filtering */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                    <TabsTrigger value="all">All Paths</TabsTrigger>
                    <TabsTrigger value="trending">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trending
                    </TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paths.map((path) => (
                            <PathCard key={path.id} path={path} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paths.filter(p => p.trending).map((path) => (
                            <PathCard key={path.id} path={path} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="new" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paths.slice(0, 3).map((path) => (
                            <PathCard key={path.id} path={path} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
