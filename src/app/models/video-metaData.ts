export interface Video {
    // id: string | null;
    description: string | null;
    title: string | null;
    // userId: string | null;
    // likes: number;
    // disLikes: number;
    tags: string[] | null;
    videoUrl: string | null;
    VideoStatus: VideoStatus | null;
    // viewCount: number;
    thumbNailUrl: string | null;
    // comments :Comments[] | null;
}

export enum VideoStatus {
    private = "PRIVATE",
    public = "PUBLIC"
}

export interface Comments {
    id: string | null;
    text: string | null;
    author: string | null;
    likeCount: number;
    disLikeCount: number;
}