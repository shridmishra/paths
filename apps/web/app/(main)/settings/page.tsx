"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
    User, Bell, Lock, Palette, Mail, Globe,
    Shield, Trash2, Save, Upload
} from "lucide-react"

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [weeklyDigest, setWeeklyDigest] = useState(false)
    const [courseUpdates, setCourseUpdates] = useState(true)
    const [communityUpdates, setCommunityUpdates] = useState(true)
    const [darkMode, setDarkMode] = useState(false)

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">
                        <Lock className="h-4 w-4 mr-2" />
                        Privacy
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Palette className="h-4 w-4 mr-2" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and profile picture
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/avatars/user.jpg" alt="Profile" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Change Photo
                                    </Button>
                                    <p className="text-sm text-muted-foreground">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium">
                                            First Name
                                        </label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium">
                                            Last Name
                                        </label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-medium">
                                        Username
                                    </label>
                                    <Input id="username" defaultValue="johndoe" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bio" className="text-sm font-medium">
                                        Bio
                                    </label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself..."
                                        rows={4}
                                        defaultValue="Passionate learner and developer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="website" className="text-sm font-medium">
                                        Website
                                    </label>
                                    <Input id="website" type="url" placeholder="https://yourwebsite.com" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Choose what updates you want to receive via email
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">Email Notifications</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Receive email notifications for important updates
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Course Updates</p>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when paths you're enrolled in are updated
                                    </p>
                                </div>
                                <Switch
                                    checked={courseUpdates}
                                    onCheckedChange={setCourseUpdates}
                                    disabled={!emailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Community Updates</p>
                                    <p className="text-sm text-muted-foreground">
                                        Notifications about comments, likes, and follows
                                    </p>
                                </div>
                                <Switch
                                    checked={communityUpdates}
                                    onCheckedChange={setCommunityUpdates}
                                    disabled={!emailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Weekly Digest</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receive a weekly summary of your learning progress
                                    </p>
                                </div>
                                <Switch
                                    checked={weeklyDigest}
                                    onCheckedChange={setWeeklyDigest}
                                    disabled={!emailNotifications}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Push Notifications</CardTitle>
                            <CardDescription>
                                Manage browser push notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">Push Notifications</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications in your browser
                                    </p>
                                </div>
                                <Switch
                                    checked={pushNotifications}
                                    onCheckedChange={setPushNotifications}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>
                                Control who can see your profile and activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">Public Profile</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Make your profile visible to everyone
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Show Learning Progress</p>
                                    <p className="text-sm text-muted-foreground">
                                        Display your completed paths and progress publicly
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="font-medium">Show on Leaderboard</p>
                                    <p className="text-sm text-muted-foreground">
                                        Appear on the public leaderboard
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Manage your password and security settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="currentPassword" className="text-sm font-medium">
                                    Current Password
                                </label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-sm font-medium">
                                    New Password
                                </label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                            <Button>
                                <Shield className="h-4 w-4 mr-2" />
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible actions for your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardDescription>
                                Customize how the app looks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">Dark Mode</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Use dark theme across the application
                                    </p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Language & Region</CardTitle>
                            <CardDescription>
                                Set your preferred language and region
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="language" className="text-sm font-medium">
                                    Language
                                </label>
                                <Input id="language" defaultValue="English (US)" readOnly />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="timezone" className="text-sm font-medium">
                                    Timezone
                                </label>
                                <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" readOnly />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
