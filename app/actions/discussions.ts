"use server"

import { db } from "@/lib/db"
import { discussions, comments, users } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createDiscussion(pathId: string, title: string, content: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    try {
        await db.insert(discussions).values({
            title,
            content,
            pathId,
            userId: session.user.id,
        })

        revalidatePath(`/path/${pathId}/discussion`)
        return { success: true }
    } catch (error) {
        console.error("Failed to create discussion:", error)
        return { success: false, error: "Failed to create discussion" }
    }
}

export async function createComment(discussionId: string, content: string, pathId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    try {
        await db.insert(comments).values({
            content,
            discussionId,
            userId: session.user.id,
        })

        revalidatePath(`/path/${pathId}/discussion`)
        return { success: true }
    } catch (error) {
        console.error("Failed to create comment:", error)
        return { success: false, error: "Failed to create comment" }
    }
}
