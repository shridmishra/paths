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
    FileText, Video, Link as LinkIcon, Code, Loader2
} from "lucide-react"
import { createPath, type CreatePathData } from "@/app/actions/paths"
import { useRouter } from "next/navigation"

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
    const router = useRouter()
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

    const [playlistUrl, setPlaylistUrl] = useState("")
    const [isImporting, setIsImporting] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const handleImportPlaylist = async () => {
        if (!playlistUrl) return

        setIsImporting(true)
        try {
            const { fetchPlaylist } = await import("@/app/actions/youtube")
            const videos = await fetchPlaylist(playlistUrl)

            const newModule: Module = {
                id: Date.now().toString(),
                title: "Imported Playlist",
                description: "Videos imported from YouTube",
                lessons: videos.map(video => ({
                    id: video.id,
                    title: video.title,
                    type: "video",
                    duration: video.duration,
                    content: video.url
                })),
                expanded: true
            }

            setModules([...modules, newModule])
            setPlaylistUrl("")
        } catch (error) {
            console.error("Failed to import playlist", error)
            alert("Failed to import playlist. Please check the URL.")
        } finally {
            setIsImporting(false)
        }
    }

    const handlePublish = async () => {
        if (!pathTitle || !pathDescription || !category || !difficulty) {
            alert("Please fill in all required fields")
            return
        }

        setIsPublishing(true)
        try {
            const pathData: CreatePathData = {
                title: pathTitle,
                description: pathDescription,
                category,
                difficulty,
                tags,
                modules: modules.map(m => ({
                    title: m.title,
                    description: m.description,
                    lessons: m.lessons.map(l => ({
                        title: l.title,
                        type: l.type,
                        duration: l.duration,
                        content: l.content
                    }))
                }))
            }

            const result = await createPath(pathData, true)
            if (result.success && result.pathId) {
                router.push(`/path/${result.pathId}`)
            } else {
                throw new Error(result.error || "Failed to create path")
            }
        } catch (error) {
            console.error("Failed to publish path:", error)
            alert("Failed to publish path. Please try again.")
        } finally {
            setIsPublishing(false)
        }
    }

    const handlePreview = async () => {
        if (!pathTitle || !pathDescription || !category || !difficulty) {
            alert("Please fill in all required fields")
            return
        }

        setIsPublishing(true)
        try {
            const pathData: CreatePathData = {
                title: pathTitle,
                description: pathDescription,
                category,
                difficulty,
                tags,
                modules: modules.map(m => ({
                    title: m.title,
                    description: m.description,
                    lessons: m.lessons.map(l => ({
                        title: l.title,
                        type: l.type,
                        duration: l.duration,
                        content: l.content
                    }))
                }))
            }

            const result = await createPath(pathData, false) // published = false
            if (result.success && result.pathId) {
                router.push(`/path/${result.pathId}`)
            } else {
                throw new Error(result.error || "Failed to create draft")
            }
        } catch (error) {
            console.error("Failed to create draft:", error)
            alert("Failed to create draft. Please try again.")
        } finally {
            setIsPublishing(false)
        }
    }

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
                    <Button variant="outline" size="lg" className="cursor-pointer" onClick={handlePreview} disabled={isPublishing}>
                        <Eye className="h-4 w-4 mr-2" />
                        {isPublishing ? "Saving..." : "Preview"}
                    </Button>
                    <Button size="lg" onClick={handlePublish} disabled={isPublishing} className="cursor-pointer">
                        {isPublishing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Publish Path
                            </>
                        )}
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
                                    <SelectItem value="web" className="cursor-pointer">Web Development</SelectItem>
                                    <SelectItem value="mobile" className="cursor-pointer">Mobile Development</SelectItem>
                                    <SelectItem value="data" className="cursor-pointer">Data Science</SelectItem>
                                    <SelectItem value="design" className="cursor-pointer">UI/UX Design</SelectItem>
                                    <SelectItem value="devops" className="cursor-pointer">DevOps</SelectItem>
                                    <SelectItem value="ai" className="cursor-pointer">AI & ML</SelectItem>
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
                                    <SelectItem value="beginner" className="cursor-pointer">Beginner</SelectItem>
                                    <SelectItem value="intermediate" className="cursor-pointer">Intermediate</SelectItem>
                                    <SelectItem value="advanced" className="cursor-pointer">Advanced</SelectItem>
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
                            <Button type="button" onClick={addTag} className="cursor-pointer">Add</Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="ml-1 cursor-pointer">
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
                <CardContent className="space-y-6">
                    {/* YouTube Import */}
                    <div className="flex gap-2 items-end p-4 border rounded-lg bg-muted/30">
                        <div className="flex-1 space-y-2">
                            <label htmlFor="youtube-url" className="text-sm font-medium flex items-center gap-2">
                                <Video className="h-4 w-4 text-red-500" />
                                Import from YouTube Playlist
                            </label>
                            <Input
                                id="youtube-url"
                                placeholder="Paste YouTube playlist URL here..."
                                value={playlistUrl}
                                onChange={(e) => setPlaylistUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleImportPlaylist}
                            disabled={!playlistUrl || isImporting}
                            variant="secondary"
                            className="cursor-pointer"
                        >
                            {isImporting ? "Importing..." : "Import"}
                        </Button>
                    </div>

                    <div className="space-y-4">
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
                                                        className="cursor-pointer"
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
                                                            className="cursor-pointer"
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
                                                                onValueChange={(value) => updateLesson(module.id, lesson.id, "type", value as Lesson["type"])}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="video" className="cursor-pointer">Video</SelectItem>
                                                                    <SelectItem value="article" className="cursor-pointer">Article</SelectItem>
                                                                    <SelectItem value="exercise" className="cursor-pointer">Exercise</SelectItem>
                                                                    <SelectItem value="quiz" className="cursor-pointer">Quiz</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                value={lesson.duration}
                                                                onChange={(e) => updateLesson(module.id, lesson.id, "duration", e.target.value)}
                                                                placeholder="Duration"
                                                                className="w-24"
                                                            />
                                                        </div>
                                                        {/* Content Input based on type */}
                                                        <Input
                                                            value={lesson.content}
                                                            onChange={(e) => updateLesson(module.id, lesson.id, "content", e.target.value)}
                                                            placeholder={lesson.type === "video" ? "Video URL" : "Content / Description"}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeLesson(module.id, lesson.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        })}

                                        <Button
                                            variant="outline"
                                            className="w-full cursor-pointer"
                                            onClick={() => addLesson(module.id)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Lesson
                                        </Button>
                                    </CardContent>
                                )}
                            </Card>
                        ))}

                        <Button variant="outline" className="w-full cursor-pointer" onClick={addModule}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
