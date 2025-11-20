import Link from "next/link"
import { Home, Compass, Trophy, Bell, User, Settings, Search, MessageSquare, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-6 w-6" />
              <span className="font-bold text-xl">Paths</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Discover
              </Link>
              <Link href="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
                Leaderboard
              </Link>
              <Link href="/search" className="text-sm font-medium transition-colors hover:text-primary">
                Search
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Path
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center gap-1 px-3 py-2">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center gap-1 px-3 py-2">
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link href="/create" className="flex flex-col items-center gap-1 px-3 py-2">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Link>
          <Link href="/leaderboard" className="flex flex-col items-center gap-1 px-3 py-2">
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Leaderboard</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-2">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
