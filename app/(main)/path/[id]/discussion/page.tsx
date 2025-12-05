import DiscussionClient from "./DiscussionClient"
import { db } from "@/lib/db"
import { discussions, comments, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

async function getDiscussions(pathId: string) {
    const data = await db.query.discussions.findMany({
        where: eq(discussions.pathId, pathId),
        with: {
            user: true,
            comments: {
                with: {
                    user: true
                },
                orderBy: (comments, { asc }) => [asc(comments.createdAt)]
            }
        },
        orderBy: (discussions, { desc }) => [desc(discussions.createdAt)]
    });

    return data.map(d => ({
        id: d.id,
        title: d.title,
        content: d.content,
        author: {
            name: d.user.name || "Unknown",
            username: d.user.email.split('@')[0],
            avatar: "" // Placeholder
        },
        timestamp: d.createdAt.toLocaleDateString(),
        likes: 0, // Placeholder
        replies: d.comments.length,
        isPinned: d.isPinned,
        tags: [], // Placeholder
        comments: d.comments.map(c => ({
            id: c.id,
            content: c.content,
            author: {
                name: c.user.name || "Unknown",
                username: c.user.email.split('@')[0],
                avatar: "" // Placeholder
            },
            timestamp: c.createdAt.toLocaleDateString(),
            likes: 0 // Placeholder
        }))
    }));
}

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const discussionsData = await getDiscussions(id);

    return <DiscussionClient pathId={id} initialDiscussions={discussionsData} />
}
