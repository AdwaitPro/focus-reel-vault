export interface Video {
  id: string;
  title: string;
  url: string;
  filePath: string;
  tags: string[];
  createdAt: string;
  thumbnail?: string;
  duration?: number;
  isLocal: boolean;
}

export interface VideoDownloadRequest {
  instagramUrl: string;
  title?: string;
  tags?: string[];
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
}