"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    MessageSquare, ThumbsUp, Reply, MoreVertical,
    Send, Pin, Loader2
} from "lucide-react"
import Link from "next/link"
import { createDiscussion, createComment } from "@/app/actions/discussions"
import { useRouter } from "next/navigation"

function DiscussionCard({ discussion, pathId }: { discussion: any, pathId: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [liked, setLiked] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleReply = async () => {
        if (!replyText.trim()) return
        setIsSubmitting(true)
        try {
            const result = await createComment(discussion.id, replyText, pathId)
            if (result.success) {
                setReplyText("")
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to reply:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className={discussion.isPinned ? "border-primary" : ""}>
            <CardHeader>
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link href={`/profile/${discussion.author.username}`} className="font-semibold hover:text-primary transition-colors">
                                        {discussion.author.name}
                                    </Link>
                                    <span className="text-sm text-muted-foreground">@{discussion.author.username}</span>
                                    <span className="text-sm text-muted-foreground">·</span>
                                    <span className="text-sm text-muted-foreground">{discussion.timestamp}</span>
                                    {discussion.isPinned && (
                                        <>
                                            <span className="text-sm text-muted-foreground">·</span>
                                            <Badge variant="secondary" className="gap-1">
                                                <Pin className="h-3 w-3" />
                                                Pinned
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">{discussion.title}</h3>
                <p className="text-base">{discussion.content}</p>

                {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <Separator />

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`cursor-pointer ${liked ? "text-primary" : ""}`}
                        onClick={() => setLiked(!liked)}
                    >
                        <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                        {discussion.likes + (liked ? 1 : 0)}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {discussion.replies} {discussion.replies === 1 ? "Reply" : "Replies"}
                    </Button>
                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                    </Button>
                </div>

                {isExpanded && (
                    <div className="space-y-4 mt-4 pl-4 border-l-2">
                        {discussion.comments.map((reply: any) => (
                            <div key={reply.id} className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                        <AvatarFallback>{reply.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <Link href={`/profile/${reply.author.username}`} className="font-semibold text-sm hover:text-primary transition-colors">
                                                {reply.author.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">@{reply.author.username}</span>
                                            <span className="text-xs text-muted-foreground">·</span>
                                            <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                        </div>
                                        <p className="text-sm">{reply.content}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="ghost" size="sm" className="h-7 text-xs cursor-pointer">
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                {reply.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs cursor-pointer">
                                                <Reply className="h-3 w-3 mr-1" />
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={2}
                                />
                                <div className="flex justify-end">
                                    <Button size="sm" disabled={!replyText.trim() || isSubmitting} onClick={handleReply} className="cursor-pointer">
                                        {isSubmitting ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : <Send className="h-3 w-3 mr-2" />}
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function DiscussionClient({ pathId, initialDiscussions }: { pathId: string, initialDiscussions: any[] }) {
    const [newDiscussion, setNewDiscussion] = useState("")
    const [newTitle, setNewTitle] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleCreateDiscussion = async () => {
        if (!newDiscussion.trim() || !newTitle.trim()) return
        setIsSubmitting(true)
        try {
            const result = await createDiscussion(pathId, newTitle, newDiscussion)
            if (result.success) {
                setNewDiscussion("")
                setNewTitle("")
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to create discussion:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Discussion</h1>
                        <p className="text-muted-foreground mt-2">
                            Ask questions and share insights with other learners
                        </p>
                    </div>
                </div>

                {/* New Discussion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Start a Discussion</CardTitle>
                        <CardDescription>
                            Share your thoughts, ask questions, or help others
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Discussion Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <Textarea
                            placeholder="What's on your mind?"
                            value={newDiscussion}
                            onChange={(e) => setNewDiscussion(e.target.value)}
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setNewDiscussion(""); setNewTitle("") }} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button disabled={!newDiscussion.trim() || !newTitle.trim() || isSubmitting} onClick={handleCreateDiscussion} className="cursor-pointer">
                                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                                Post Discussion
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Discussions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Recent Discussions</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            Latest
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            Popular
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer">
                            Unanswered
                        </Button>
                    </div>
                </div>

                {initialDiscussions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No discussions yet. Be the first to start one!
                    </div>
                ) : (
                    initialDiscussions.map((discussion) => (
                        <DiscussionCard key={discussion.id} discussion={discussion} pathId={pathId} />
                    ))
                )}
            </div>
        </div>
    )
}
