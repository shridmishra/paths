"use server"

import { db } from "@/lib/db"
import { paths, topics, lessons } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type CreatePathData = {
    title: string
    description: string
    category: string
    difficulty: string
    tags: string[]
    modules: {
        title: string
        description: string
        lessons: {
            title: string
            type: "video" | "article" | "exercise" | "quiz"
            duration: string
            content: string
        }[]
    }[]
}

export async function createPath(data: CreatePathData, published: boolean = true) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    try {
        const pathId = await db.transaction(async (tx) => {
            // Create Path
            const [newPath] = await tx.insert(paths).values({
                title: data.title,
                description: data.description,
                category: data.category,
                difficulty: data.difficulty,
                userId: session.user.id,
                published: published,
            }).returning()

            // Create Modules (Topics) and Lessons
            for (let i = 0; i < data.modules.length; i++) {
                const module = data.modules[i]
                const [newTopic] = await tx.insert(topics).values({
                    title: module.title,
                    description: module.description,
                    order: i,
                    pathId: newPath.id,
                }).returning()

                if (module.lessons.length > 0) {
                    await tx.insert(lessons).values(
                        module.lessons.map((lesson, index) => ({
                            title: lesson.title,
                            content: lesson.content,
                            type: lesson.type,
                            duration: lesson.duration,
                            order: index,
                            topicId: newTopic.id,
                        }))
                    )
                }
            }
            return newPath.id
        })

        revalidatePath("/profile")
        revalidatePath("/search")
        return { success: true, pathId }
    } catch (error) {
        console.error("Failed to create path:", error)
        return { success: false, error: "Failed to create path" }
    }
}
