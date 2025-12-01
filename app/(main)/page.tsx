import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Star, TrendingUp, Flame, ArrowRight, Sparkles } from "lucide-react"
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
    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm">{path.category}</Badge>
                            {path.trending && (
                                <Badge variant="secondary" className="rounded-full gap-1 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">
                                    <Flame className="h-3 w-3" />
                                    Trending
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                            <Link href={`/path/${path.id}`} className="after:absolute after:inset-0">{path.title}</Link>
                        </CardTitle>
                    </div>
                </div>
                <CardDescription className="line-clamp-2 text-muted-foreground/80">{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                    {path.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs rounded-md bg-secondary/50 text-secondary-foreground/80">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{path.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>{path.students.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-foreground font-medium">{path.rating}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 bg-muted/20 p-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                            <AvatarImage src={path.author.avatar} alt={path.author.name} />
                            <AvatarFallback className="text-xs">{path.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-muted-foreground">{path.author.name}</span>
                    </div>
                    <div className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        Start Path <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default function HomePage() {
    return (
        <div className="flex flex-col gap-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-muted/50 to-background border border-border/50 p-8 md:p-12">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                        <Sparkles className="mr-2 h-4 w-4" />
                        New Learning Paths Available
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        Master Your Craft with <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">Curated Paths</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Structured learning journeys designed by industry experts. Stop guessing what to learn next and start building your future.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 rounded-full text-base">
                            Explore Paths
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm">
                            View Leaderboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Featured Paths</h2>
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                        <TabsTrigger
                            value="all"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            All Paths
                        </TabsTrigger>
                        <TabsTrigger
                            value="trending"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Trending
                        </TabsTrigger>
                        <TabsTrigger
                            value="new"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Newest
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {paths.map((path) => (
                                <PathCard key={path.id} path={path} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trending" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {paths.filter(p => p.trending).map((path) => (
                                <PathCard key={path.id} path={path} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="new" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {paths.slice(0, 3).map((path) => (
                                <PathCard key={path.id} path={path} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
