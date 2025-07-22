import { Video } from '@/types/video';

export class InstagramDownloader {
  private static readonly API_BASE = 'https://api.instagram-downloader.dev';
  
  static async extractVideoInfo(instagramUrl: string): Promise<{
    title: string;
    videoUrl: string;
    thumbnail?: string;
    duration?: number;
  }> {
    try {
      // Clean the Instagram URL
      const cleanUrl = this.cleanInstagramUrl(instagramUrl);
      
      // For demo purposes, we'll simulate the download
      // In production, you'd integrate with a real Instagram downloader API
      const response = await this.simulateVideoExtraction(cleanUrl);
      
      return response;
    } catch (error) {
      console.error('Failed to extract video info:', error);
      throw new Error('Failed to process Instagram link. Please check the URL and try again.');
    }
  }

  private static cleanInstagramUrl(url: string): string {
    // Remove unnecessary parameters and clean the URL
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(urlRegex);
    
    if (!match) {
      throw new Error('Invalid Instagram URL format');
    }
    
    return `https://www.instagram.com/${match[1]}/${match[2]}/`;
  }

  private static async simulateVideoExtraction(url: string): Promise<{
    title: string;
    videoUrl: string;
    thumbnail?: string;
    duration?: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, return a sample video
    return {
      title: 'Motivational Content',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://via.placeholder.com/400x600/1a1a2e/ffffff?text=Motivation',
      duration: 30
    };
  }

  static async downloadVideo(videoInfo: {
    title: string;
    videoUrl: string;
    thumbnail?: string;
    duration?: number;
  }): Promise<Video> {
    try {
      // Generate unique ID
      const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For demo, we'll use the direct video URL
      // In production, you'd download and store locally
      const video: Video = {
        id,
        title: videoInfo.title,
        url: videoInfo.videoUrl,
        filePath: videoInfo.videoUrl, // In production, this would be local file path
        tags: [],
        createdAt: new Date().toISOString(),
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
        isLocal: false // Would be true for locally stored videos
      };

      return video;
    } catch (error) {
      console.error('Failed to download video:', error);
      throw new Error('Failed to download video. Please try again.');
    }
  }
}