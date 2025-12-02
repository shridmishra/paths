import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Bell, MessageSquare, Heart, UserPlus, Award,
    CheckCircle2, TrendingUp, BookOpen, Settings
} from "lucide-react"
import Link from "next/link"

// Mock notifications data
const notifications = [
    {
        id: 1,
        type: "achievement",
        icon: Award,
        title: "New Badge Earned!",
        description: "You've earned the 'Fast Learner' badge for completing 5 lessons in one day",
        time: "2 hours ago",
        read: false,
        actionUrl: "/profile/badges"
    },
    {
        id: 2,
        type: "comment",
        icon: MessageSquare,
        user: { name: "Sarah Chen", username: "sarahchen", avatar: "/avatars/sarah.jpg" },
        title: "New comment on your discussion",
        description: "Sarah replied to your question in 'Master React & Next.js'",
        time: "4 hours ago",
        read: false,
        actionUrl: "/path/1/discussion"
    },
    {
        id: 3,
        type: "like",
        icon: Heart,
        user: { name: "Mike Johnson", username: "mikej", avatar: "/avatars/mike.jpg" },
        title: "Someone liked your path",
        description: "Mike liked your path 'Introduction to TypeScript'",
        time: "6 hours ago",
        read: true,
        actionUrl: "/path/5"
    },
    {
        id: 4,
        type: "follow",
        icon: UserPlus,
        user: { name: "Emma Wilson", username: "emmaw", avatar: "/avatars/emma.jpg" },
        title: "New follower",
        description: "Emma started following you",
        time: "1 day ago",
        read: true,
        actionUrl: "/profile/emmaw"
    },
    {
        id: 5,
        type: "milestone",
        icon: TrendingUp,
        title: "Milestone Reached!",
        description: "You've completed 10 paths! Keep up the great work!",
        time: "2 days ago",
        read: true,
        actionUrl: "/profile"
    },
    {
        id: 6,
        type: "path_update",
        icon: BookOpen,
        user: { name: "David Lee", username: "davidl", avatar: "/avatars/david.jpg" },
        title: "Path updated",
        description: "David added 3 new lessons to 'DevOps & Cloud Engineering'",
        time: "3 days ago",
        read: true,
        actionUrl: "/path/3"
    },
    {
        id: 7,
        type: "achievement",
        icon: Award,
        title: "Streak Achievement!",
        description: "You've maintained a 7-day learning streak!",
        time: "4 days ago",
        read: true,
        actionUrl: "/profile"
    },
    {
        id: 8,
        type: "comment",
        icon: MessageSquare,
        user: { name: "Lisa Park", username: "lisap", avatar: "/avatars/lisa.jpg" },
        title: "New comment on your path",
        description: "Lisa left a review on 'UI/UX Design Fundamentals'",
        time: "5 days ago",
        read: true,
        actionUrl: "/path/2/reviews"
    }
]

function getNotificationColor(type: string) {
    switch (type) {
        case "achievement":
            return "bg-purple-500/10 text-purple-500"
        case "comment":
            return "bg-blue-500/10 text-blue-500"
        case "like":
            return "bg-pink-500/10 text-pink-500"
        case "follow":
            return "bg-green-500/10 text-green-500"
        case "milestone":
            return "bg-yellow-500/10 text-yellow-500"
        case "path_update":
            return "bg-orange-500/10 text-orange-500"
        default:
            return "bg-gray-500/10 text-gray-500"
    }
}

function NotificationItem({ notification }: { notification: typeof notifications[0] }) {
    const Icon = notification.icon

    return (
        <Link href={notification.actionUrl}>
            <Card className={`transition-all hover:shadow-md cursor-pointer ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getNotificationColor(notification.type)}`}>
                            <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-semibold">{notification.title}</p>
                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                )}
                            </div>

                            {notification.user && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                                        <AvatarFallback>{notification.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">@{notification.user.username}</span>
                                </div>
                            )}

                            <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function NotificationsPage() {
    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Bell className="h-8 w-8" />
                        <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
                    </div>
                    {unreadCount > 0 && (
                        <p className="text-muted-foreground">
                            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">
                        All
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {unreadCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6 space-y-3">
                    {notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </TabsContent>

                <TabsContent value="unread" className="mt-6 space-y-3">
                    {notifications.filter(n => !n.read).length > 0 ? (
                        notifications.filter(n => !n.read).map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-lg font-medium mb-2">You&apos;re all caught up!</p>
                                <p className="text-muted-foreground">No unread notifications</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="achievements" className="mt-6 space-y-3">
                    {notifications.filter(n => n.type === "achievement" || n.type === "milestone").map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </TabsContent>

                <TabsContent value="social" className="mt-6 space-y-3">
                    {notifications.filter(n => n.type === "comment" || n.type === "like" || n.type === "follow").map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
