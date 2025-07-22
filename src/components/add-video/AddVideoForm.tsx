import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Link as LinkIcon, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InstagramDownloader } from '@/utils/instagram-downloader';
import { VideoStorage } from '@/utils/video-storage';
import { useToast } from '@/hooks/use-toast';

interface AddVideoFormProps {
  onVideoAdded: () => void;
}

export const AddVideoForm: React.FC<AddVideoFormProps> = ({ onVideoAdded }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTag = (tagText: string) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      addTag(currentTag);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an Instagram URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract video information
      const videoInfo = await InstagramDownloader.extractVideoInfo(url);
      
      // Download video
      const video = await InstagramDownloader.downloadVideo({
        ...videoInfo,
        title: title.trim() || videoInfo.title
      });

      // Add tags
      video.tags = tags;

      // Save to storage
      await VideoStorage.saveVideo(video);

      // Reset form
      setUrl('');
      setTitle('');
      setTags([]);
      setCurrentTag('');

      toast({
        title: "Video Added! 🎉",
        description: "Your motivational video is ready to inspire you",
      });

      onVideoAdded();
    } catch (error) {
      console.error('Failed to add video:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ⚡
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add Motivation
          </h1>
          <p className="text-muted-foreground">
            Paste any Instagram link to fuel your focus
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Instagram URL
            </label>
            <Input
              type="url"
              placeholder="https://instagram.com/p/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-card/50 border-border backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Custom Title (Optional)
            </label>
            <Input
              type="text"
              placeholder="Morning Motivation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-card/50 border-border backdrop-blur-sm"
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <Input
              type="text"
              placeholder="fitness, motivation, study..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="bg-card/50 border-border backdrop-blur-sm"
              disabled={isLoading}
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="pt-4"
          >
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full bg-gradient-button hover:shadow-glow transition-all duration-300 text-lg py-6 rounded-2xl font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading Magic...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  Add to Feed
                </div>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Quick Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <p className="text-sm text-muted-foreground mb-3">Quick Tags:</p>
          <div className="flex flex-wrap gap-2">
            {['motivation', 'fitness', 'study', 'mindset', 'goals', 'success'].map((tag) => (
              <motion.button
                key={tag}
                whileTap={{ scale: 0.95 }}
                onClick={() => addTag(tag)}
                className="bg-muted/50 hover:bg-accent/20 text-muted-foreground hover:text-accent px-3 py-1 rounded-full text-sm transition-all"
                disabled={isLoading || tags.includes(tag)}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};