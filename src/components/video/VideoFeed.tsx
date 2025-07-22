import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/types/video';

interface VideoFeedProps {
  videos: Video[];
  onVideoEnd?: (videoId: string) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ videos, onVideoEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.y > threshold) {
      // Swipe down - previous video
      goToPrevious();
    } else if (info.offset.y < -threshold) {
      // Swipe up - next video
      goToNext();
    }
  };

  const goToNext = () => {
    if (videos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const goToPrevious = () => {
    if (videos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleVideoEnd = () => {
    const currentVideo = videos[currentIndex];
    if (currentVideo) {
      onVideoEnd?.(currentVideo.id);
    }
    goToNext();
  };

  // Auto-advance on spacebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (videos.length === 0) {
    return (
      <div className="h-screen bg-gradient-hero flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Motivated?
          </h2>
          <p className="text-muted-foreground mb-8">
            Add your first motivational video to start your focus journey
          </p>
          <motion.div
            animate={{ 
              boxShadow: [
                'var(--shadow-glow)',
                'var(--shadow-accent-glow)',
                'var(--shadow-glow)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-gradient-button text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg"
          >
            Tap + to Add Videos
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-hidden relative"
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="h-full"
        style={{
          y: isDragging ? 0 : currentIndex * -window.innerHeight
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="h-screen w-full"
            style={{
              transform: `translateY(${index * 100}%)`
            }}
          >
            <VideoPlayer
              video={video}
              isActive={index === currentIndex}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        ))}
      </motion.div>

      {/* Video Counter */}
      <div className="absolute top-12 right-6 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white font-medium">
          {currentIndex + 1} / {videos.length}
        </span>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
        {videos.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 h-8 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-gradient-primary shadow-glow' 
                : 'bg-white/30'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1
            }}
          />
        ))}
      </div>
    </div>
  );
};