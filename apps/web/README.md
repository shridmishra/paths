# Paths - Learning Platform

A modern learning platform built with Next.js 15, React 19, and shadcn/ui components.

## Features

This application implements all 10 pages from the design files:

### 1. **Homepage** (`/`)
- Discover learning paths
- Filter by trending, new, or all paths
- Path cards with ratings, students, duration, and tags
- Responsive grid layout

### 2. **Individual Path View** (`/path/[id]`)
- Detailed path information
- Progress tracking
- Curriculum with modules and lessons
- Tabs for curriculum, about, reviews, and discussion
- Instructor information

### 3. **Leaderboard** (`/leaderboard`)
- Top learners ranking
- User stats (points, paths completed, streak, badges)
- Filter by all-time, monthly, or weekly
- Your current rank display

### 4. **Notifications** (`/notifications`)
- Activity feed with different notification types
- Filter by all, unread, achievements, or social
- Mark all as read functionality
- Real-time notification indicators

### 5. **Onboarding** (`/onboarding`)
- Multi-step onboarding flow
- User preferences collection
- Interest selection
- Skill level assessment
- Goal setting

### 6. **Path Creation** (`/create`)
- Rich path editor
- Dynamic module and lesson management
- Drag-and-drop ordering
- Multiple content types (video, article, exercise, quiz)
- Category and difficulty selection

### 7. **Search Results** (`/search`)
- Advanced search with filters
- Filter by category, difficulty, duration, and rating
- Collapsible filter sidebar
- Search results with path previews

### 8. **Settings** (`/settings`)
- Profile management
- Notification preferences
- Privacy settings
- Appearance customization
- Security settings

### 9. **User Profile** (`/profile`)
- User stats and achievements
- Learning paths in progress
- Created paths showcase
- Badges collection
- Profile editing

### 10. **Discussion/Comments** (`/path/[id]/discussion`)
- Threaded discussions
- Reply functionality
- Like and interaction features
- Pinned discussions
- Tag filtering

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
apps/web/
├── app/
│   ├── (main)/              # Main layout with navigation
│   │   ├── page.tsx         # Homepage
│   │   ├── leaderboard/     # Leaderboard page
│   │   ├── notifications/   # Notifications page
│   │   ├── create/          # Path creation page
│   │   ├── search/          # Search results page
│   │   ├── settings/        # Settings page
│   │   ├── profile/         # User profile page
│   │   └── path/[id]/       # Individual path pages
│   │       ├── page.tsx     # Path view
│   │       └── discussion/  # Discussion page
│   ├── onboarding/          # Onboarding flow (separate layout)
│   └── layout.tsx           # Root layout
└── components/
    └── providers.tsx        # Theme provider
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Routes

- `/` - Homepage (Discover Paths)
- `/path/1` - Individual Path View
- `/leaderboard` - Leaderboard
- `/notifications` - Notifications
- `/onboarding` - Onboarding Flow
- `/create` - Path Creation
- `/search` - Search Results
- `/settings` - Settings
- `/profile` - User Profile
- `/path/1/discussion` - Discussion

## UI Components Used

The following shadcn/ui components are integrated:

- Avatar
- Badge
- Button
- Card
- Dialog
- Dropdown Menu
- Input
- Scroll Area
- Select
- Separator
- Switch
- Tabs
- Textarea

## Features Implemented

### Navigation
- Responsive top navigation bar
- Mobile bottom navigation
- Breadcrumb navigation where appropriate

### Interactivity
- Tab switching
- Filter toggles
- Progress tracking
- Like/unlike functionality
- Collapsible sections
- Modal dialogs

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management

## Design Principles

1. **Modern & Premium**: Rich aesthetics with gradients, shadows, and smooth animations
2. **User-Centric**: Intuitive navigation and clear information hierarchy
3. **Consistent**: Unified design language across all pages
4. **Performant**: Optimized for fast loading and smooth interactions

## Next Steps

To make this production-ready:

1. **Backend Integration**: Connect to a real API
2. **Authentication**: Implement user authentication
3. **Database**: Set up data persistence
4. **Real-time Features**: Add WebSocket for live updates
5. **Image Optimization**: Use Next.js Image component
6. **SEO**: Add metadata and structured data
7. **Analytics**: Integrate analytics tracking
8. **Testing**: Add unit and integration tests

## License

MIT
