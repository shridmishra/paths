"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Plus, X, GripVertical, Save, Eye, ChevronDown, ChevronUp,
    FileText, Video, Link as LinkIcon, Code
} from "lucide-react"

type Lesson = {
    id: string
    title: string
    type: "video" | "article" | "exercise" | "quiz"
    duration: string
    content: string
}

type Module = {
    id: string
    title: string
    description: string
    lessons: Lesson[]
    expanded: boolean
}

export default function PathCreationPage() {
    const [pathTitle, setPathTitle] = useState("")
    const [pathDescription, setPathDescription] = useState("")
    const [category, setCategory] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [modules, setModules] = useState<Module[]>([
        {
            id: "1",
            title: "Introduction",
            description: "",
            lessons: [],
            expanded: true
        }
    ])

    const addModule = () => {
        const newModule: Module = {
            id: Date.now().toString(),
            title: `Module ${modules.length + 1}`,
            description: "",
            lessons: [],
            expanded: true
        }
        setModules([...modules, newModule])
    }

    const removeModule = (moduleId: string) => {
        setModules(modules.filter(m => m.id !== moduleId))
    }

    const updateModule = (moduleId: string, field: keyof Module, value: Module[keyof Module]) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, [field]: value } : m
        ))
    }

    const toggleModule = (moduleId: string) => {
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, expanded: !m.expanded } : m
        ))
    }

    const addLesson = (moduleId: string) => {
        const newLesson: Lesson = {
            id: Date.now().toString(),
            title: "New Lesson",
            type: "article",
            duration: "15 min",
            content: ""
        }
        setModules(modules.map(m =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
        ))
    }

    const removeLesson = (moduleId: string, lessonId: string) => {
        setModules(modules.map(m =>
            m.id === moduleId
                ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
                : m
        ))
    }

    const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: Lesson[keyof Lesson]) => {
        setModules(modules.map(m =>
            m.id === moduleId
                ? {
                    ...m,
                    lessons: m.lessons.map(l =>
                        l.id === lessonId ? { ...l, [field]: value } : l
                    )
                }
                : m
        ))
    }

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const getLessonIcon = (type: Lesson["type"]) => {
        switch (type) {
            case "video":
                return Video
            case "article":
                return FileText
            case "exercise":
                return Code
            case "quiz":
                return LinkIcon
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Create Learning Path</h1>
                    <p className="text-muted-foreground mt-2">
                        Share your knowledge by creating a structured learning path
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="lg">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button size="lg">
                        <Save className="h-4 w-4 mr-2" />
                        Publish Path
                    </Button>
                </div>
            </div>

            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Provide the essential details about your learning path
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Path Title *
                        </label>
                        <Input
                            id="title"
                            placeholder="e.g., Master React & Next.js"
                            value={pathTitle}
                            onChange={(e) => setPathTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description *
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Describe what learners will gain from this path..."
                            rows={4}
                            value={pathDescription}
                            onChange={(e) => setPathDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">
                                Category *
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="web">Web Development</SelectItem>
                                    <SelectItem value="mobile">Mobile Development</SelectItem>
                                    <SelectItem value="data">Data Science</SelectItem>
                                    <SelectItem value="design">UI/UX Design</SelectItem>
                                    <SelectItem value="devops">DevOps</SelectItem>
                                    <SelectItem value="ai">AI & ML</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="difficulty" className="text-sm font-medium">
                                Difficulty Level *
                            </label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger id="difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium">
                            Tags
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                placeholder="Add a tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag}>Add</Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
                <CardHeader>
                    <CardTitle>Curriculum</CardTitle>
                    <CardDescription>
                        Organize your content into modules and lessons
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {modules.map((module) => (
                        <Card key={module.id} className="border-2">
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <Input
                                                value={module.title}
                                                onChange={(e) => updateModule(module.id, "title", e.target.value)}
                                                className="font-semibold text-lg"
                                                placeholder="Module title"
                                            />
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleModule(module.id)}
                                                >
                                                    {module.expanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                {modules.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeModule(module.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {module.expanded && (
                                            <Textarea
                                                value={module.description}
                                                onChange={(e) => updateModule(module.id, "description", e.target.value)}
                                                placeholder="Module description (optional)"
                                                rows={2}
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {module.expanded && (
                                <CardContent className="space-y-2">
                                    {module.lessons.map((lesson) => {
                                        const LessonIcon = getLessonIcon(lesson.type)
                                        return (
                                            <div key={lesson.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                                <GripVertical className="h-4 w-4 text-muted-foreground mt-2 cursor-move" />
                                                <LessonIcon className="h-4 w-4 text-muted-foreground mt-2" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={lesson.title}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, "title", e.target.value)}
                                                            placeholder="Lesson title"
                                                            className="flex-1"
                                                        />
                                                        <Select
                                                            value={lesson.type}
                                                            onValueChange={(value) => updateLesson(module.id, lesson.id, "type", value)}
                                                        >
                                                            <SelectTrigger className="w-32">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="video">Video</SelectItem>
                                                                <SelectItem value="article">Article</SelectItem>
                                                                <SelectItem value="exercise">Exercise</SelectItem>
                                                                <SelectItem value="quiz">Quiz</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input
                                                            value={lesson.duration}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, "duration", e.target.value)}
                                                            placeholder="Duration"
                                                            className="w-24"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeLesson(module.id, lesson.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )
                                    })}

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => addLesson(module.id)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Lesson
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    ))}

                    <Button variant="outline" className="w-full" onClick={addModule}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Module
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
