"use server"

import YouTube from "youtube-sr"

export type YouTubeVideo = {
    id: string
    title: string
    duration: string
    thumbnail: string
    url: string
}

export async function fetchPlaylist(url: string): Promise<YouTubeVideo[]> {
    try {
        // youtube-sr handles various URL formats
        const playlist = await YouTube.getPlaylist(url, { limit: 50 })
        
        if (!playlist || !playlist.videos) {
            throw new Error("Playlist not found or empty")
        }

        return playlist.videos.map(video => ({
            id: video.id || "",
            title: video.title || "Untitled Video",
            duration: video.durationFormatted || "0:00",
            thumbnail: video.thumbnail?.url || "",
            url: `https://www.youtube.com/watch?v=${video.id}`
        }))
    } catch (error) {
        console.error("Error fetching playlist:", error)
        throw new Error("Failed to fetch playlist. Please check the URL.")
    }
}
