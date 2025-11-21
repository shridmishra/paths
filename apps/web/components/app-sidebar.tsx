"use client"

import { Calendar, Home, Inbox, Search, Settings, User, Compass, Trophy, Plus, Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
} from "@workspace/ui/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

// Menu items.
const items = [
    {
        title: "Discover",
        url: "/",
        icon: Home,
    },
    {
        title: "Leaderboard",
        url: "/leaderboard",
        icon: Trophy,
    },
    {
        title: "Search",
        url: "/search",
        icon: Search,
    },
    {
        title: "Create Path",
        url: "/create",
        icon: Plus,
    },
    {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
    },
    {
        title: "Profile",
        url: "/profile",
        icon: User,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Compass className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Paths</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-2 flex items-center justify-between">
                    <ThemeToggle />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/profile">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">User</span>
                                    <span className="truncate text-xs">user@example.com</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
