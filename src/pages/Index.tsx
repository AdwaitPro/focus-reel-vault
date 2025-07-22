import React, { useState, useEffect } from 'react';
import { VideoFeed } from '@/components/video/VideoFeed';
import { AddVideoForm } from '@/components/add-video/AddVideoForm';
import { VideoLibrary } from '@/components/library/VideoLibrary';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { VideoStorage } from '@/utils/video-storage';
import { Video } from '@/types/video';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'add' | 'library'>('feed');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = async () => {
    try {
      const storedVideos = await VideoStorage.getAllVideos();
      setVideos(storedVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleVideoAdded = () => {
    loadVideos();
    setActiveTab('feed');
  };

  const handlePlayVideo = (videoId: string) => {
    const videoIndex = videos.findIndex(v => v.id === videoId);
    if (videoIndex !== -1) {
      // TODO: Navigate to specific video in feed
      setActiveTab('feed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h2 className="text-2xl font-bold text-foreground">FocusReels</h2>
          <p className="text-muted-foreground">Loading your motivation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'feed' && (
          <VideoFeed videos={videos} />
        )}
        
        {activeTab === 'add' && (
          <AddVideoForm onVideoAdded={handleVideoAdded} />
        )}
        
        {activeTab === 'library' && (
          <VideoLibrary 
            videos={videos} 
            onVideosChange={loadVideos}
            onPlayVideo={handlePlayVideo}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default Index;
