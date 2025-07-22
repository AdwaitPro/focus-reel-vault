import { Video } from '@/types/video';

export class VideoStorage {
  private static readonly STORAGE_KEY = 'focusreels_videos';
  
  static async getAllVideos(): Promise<Video[]> {
    try {
      const storedVideos = localStorage.getItem(this.STORAGE_KEY);
      return storedVideos ? JSON.parse(storedVideos) : [];
    } catch (error) {
      console.error('Failed to load videos:', error);
      return [];
    }
  }
  
  static async saveVideo(video: Video): Promise<void> {
    try {
      const videos = await this.getAllVideos();
      videos.unshift(video); // Add to beginning
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
    } catch (error) {
      console.error('Failed to save video:', error);
      throw new Error('Failed to save video');
    }
  }
  
  static async deleteVideo(videoId: string): Promise<void> {
    try {
      const videos = await this.getAllVideos();
      const filteredVideos = videos.filter(v => v.id !== videoId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredVideos));
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw new Error('Failed to delete video');
    }
  }
  
  static async updateVideo(videoId: string, updates: Partial<Video>): Promise<void> {
    try {
      const videos = await this.getAllVideos();
      const videoIndex = videos.findIndex(v => v.id === videoId);
      
      if (videoIndex === -1) {
        throw new Error('Video not found');
      }
      
      videos[videoIndex] = { ...videos[videoIndex], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videos));
    } catch (error) {
      console.error('Failed to update video:', error);
      throw new Error('Failed to update video');
    }
  }
}