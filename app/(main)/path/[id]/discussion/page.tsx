import DiscussionClient from "./DiscussionClient"

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // In the future, you can use the id to fetch specific path discussions
    // For now, we just pass it to the client component if needed

    return <DiscussionClient />
}
