"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Search, SlidersHorizontal, X, BookOpen, Clock,
    Users, Star, Filter
} from "lucide-react"
import Link from "next/link"

// Mock search results
const searchResults = [
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
        tags: ["React", "Next.js", "TypeScript"]
    },
    {
        id: 2,
        title: "React Hooks Masterclass",
        description: "Deep dive into React Hooks and modern state management",
        author: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", username: "mikej" },
        category: "Web Development",
        difficulty: "Advanced",
        duration: "4 weeks",
        students: 892,
        rating: 4.7,
        tags: ["React", "Hooks", "State Management"]
    },
    {
        id: 3,
        title: "Full Stack React Development",
        description: "Build complete web applications with React, Node.js, and MongoDB",
        author: { name: "Emma Wilson", avatar: "/avatars/emma.jpg", username: "emmaw" },
        category: "Web Development",
        difficulty: "Intermediate",
        duration: "12 weeks",
        students: 1567,
        rating: 4.6,
        tags: ["React", "Node.js", "MongoDB"]
    }
]

const categories = ["All", "Web Development", "Mobile Development", "Data Science", "Design", "DevOps", "AI & ML"]
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"]
const durations = ["Any Duration", "0-4 weeks", "4-8 weeks", "8-12 weeks", "12+ weeks"]

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("React")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
    const [selectedDuration, setSelectedDuration] = useState("Any Duration")
    const [showFilters, setShowFilters] = useState(true)
    const [minRating, setMinRating] = useState(0)

    const activeFiltersCount = [
        selectedCategory !== "All",
        selectedDifficulty !== "All Levels",
        selectedDuration !== "Any Duration",
        minRating > 0
    ].filter(Boolean).length

    const clearFilters = () => {
        setSelectedCategory("All")
        setSelectedDifficulty("All Levels")
        setSelectedDuration("Any Duration")
        setMinRating(0)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Header */}
            <div className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Try adjusting your search or filter to find what you&apos;re looking for..."
                            className="pl-10 h-12 text-lg"
                        />
                    </div>
                    <Button size="lg" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Found <span className="font-semibold text-foreground">{searchResults.length}</span> results for &quot;{searchQuery}&quot;
                    </p>
                    {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                {showFilters && (
                    <aside className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Category Filter */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm">Category</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === category
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Difficulty Filter */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm">Difficulty</h3>
                                    <div className="space-y-2">
                                        {difficulties.map((difficulty) => (
                                            <button
                                                key={difficulty}
                                                onClick={() => setSelectedDifficulty(difficulty)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedDifficulty === difficulty
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                                    }`}
                                            >
                                                {difficulty}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Duration Filter */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm">Duration</h3>
                                    <div className="space-y-2">
                                        {durations.map((duration) => (
                                            <button
                                                key={duration}
                                                onClick={() => setSelectedDuration(duration)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedDuration === duration
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                                    }`}
                                            >
                                                {duration}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Rating Filter */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm">Minimum Rating</h3>
                                    <div className="space-y-2">
                                        {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setMinRating(rating)}
                                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${minRating === rating
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-accent"
                                                    }`}
                                            >
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                {rating}+ stars
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                )}

                {/* Search Results */}
                <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
                    {searchResults.map((path) => (
                        <Card key={path.id} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline">{path.category}</Badge>
                                            <Badge variant="secondary">{path.difficulty}</Badge>
                                        </div>
                                        <CardTitle className="text-xl hover:text-primary transition-colors">
                                            <Link href={`/path/${path.id}`}>{path.title}</Link>
                                        </CardTitle>
                                        <CardDescription className="mt-2">{path.description}</CardDescription>
                                    </div>
                                </div>
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
                                        View Path
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
