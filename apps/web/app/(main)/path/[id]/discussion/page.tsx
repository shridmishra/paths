"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Separator } from "@workspace/ui/components/separator"
import {
    MessageSquare, ThumbsUp, Reply, MoreVertical,
    Send, Pin, Flag, Trash2, Edit
} from "lucide-react"
import Link from "next/link"

// Mock discussion data
const discussions = [
    {
        id: 1,
        author: { name: "Sarah Chen", username: "sarahchen", avatar: "/avatars/sarah.jpg" },
        content: "I'm having trouble understanding the useEffect cleanup function. Can someone explain when and why we need it?",
        timestamp: "2 hours ago",
        likes: 12,
        replies: 3,
        isPinned: true,
        tags: ["React", "Hooks"]
    },
    {
        id: 2,
        author: { name: "Mike Johnson", username: "mikej", avatar: "/avatars/mike.jpg" },
        content: "Just completed the Next.js routing section! The app directory is so much better than pages. Anyone else loving the new features?",
        timestamp: "5 hours ago",
        likes: 8,
        replies: 5,
        isPinned: false,
        tags: ["Next.js"]
    },
    {
        id: 3,
        author: { name: "Emma Wilson", username: "emmaw", avatar: "/avatars/emma.jpg" },
        content: "Quick tip: When working with TypeScript in React, always define your prop types explicitly. It saves so much debugging time later!",
        timestamp: "1 day ago",
        likes: 24,
        replies: 7,
        isPinned: false,
        tags: ["TypeScript", "React"]
    }
]

const replies = [
    {
        id: 1,
        discussionId: 1,
        author: { name: "David Lee", username: "davidl", avatar: "/avatars/david.jpg" },
        content: "The cleanup function runs before the component unmounts or before the effect runs again. It's useful for cleaning up subscriptions, timers, or event listeners to prevent memory leaks.",
        timestamp: "1 hour ago",
        likes: 5
    },
    {
        id: 2,
        discussionId: 1,
        author: { name: "Lisa Park", username: "lisap", avatar: "/avatars/lisa.jpg" },
        content: "Great explanation! I'd also add that you should return a cleanup function whenever your effect creates something that needs to be cleaned up. For example, if you add an event listener in useEffect, you should remove it in the cleanup.",
        timestamp: "45 minutes ago",
        likes: 3
    }
]

function DiscussionCard({ discussion }: { discussion: typeof discussions[0] }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [liked, setLiked] = useState(false)
    const [replyText, setReplyText] = useState("")

    const discussionReplies = replies.filter(r => r.discussionId === discussion.id)

    return (
        <Card className={discussion.isPinned ? "border-primary" : ""}>
            <CardHeader>
                <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-base">{discussion.content}</p>

                {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag) => (
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
                        className={liked ? "text-primary" : ""}
                        onClick={() => setLiked(!liked)}
                    >
                        <ThumbsUp className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                        {discussion.likes + (liked ? 1 : 0)}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {discussion.replies} {discussion.replies === 1 ? "Reply" : "Replies"}
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                    </Button>
                </div>

                {isExpanded && (
                    <div className="space-y-4 mt-4 pl-4 border-l-2">
                        {discussionReplies.map((reply) => (
                            <div key={reply.id} className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                                        <AvatarFallback>{reply.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                {reply.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs">
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
                                    <Button size="sm" disabled={!replyText.trim()}>
                                        <Send className="h-3 w-3 mr-2" />
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

export default function DiscussionPage({ params }: { params: { id: string } }) {
    const [newDiscussion, setNewDiscussion] = useState("")

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
                        <Textarea
                            placeholder="What's on your mind?"
                            value={newDiscussion}
                            onChange={(e) => setNewDiscussion(e.target.value)}
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setNewDiscussion("")}>
                                Cancel
                            </Button>
                            <Button disabled={!newDiscussion.trim()}>
                                <Send className="h-4 w-4 mr-2" />
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
                        <Button variant="outline" size="sm">
                            Latest
                        </Button>
                        <Button variant="ghost" size="sm">
                            Popular
                        </Button>
                        <Button variant="ghost" size="sm">
                            Unanswered
                        </Button>
                    </div>
                </div>

                {discussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}
            </div>
        </div>
    )
}
