import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, Edit3, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video } from '@/types/video';
import { VideoStorage } from '@/utils/video-storage';
import { useToast } from '@/hooks/use-toast';

interface VideoLibraryProps {
  videos: Video[];
  onVideosChange: () => void;
  onPlayVideo: (videoId: string) => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ 
  videos, 
  onVideosChange, 
  onPlayVideo 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const startEditing = (video: Video) => {
    setEditingId(video.id);
    setEditTitle(video.title);
    setEditTags([...video.tags]);
    setNewTag('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditTags([]);
    setNewTag('');
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      await VideoStorage.updateVideo(editingId, {
        title: editTitle,
        tags: editTags
      });

      setEditingId(null);
      onVideosChange();
      
      toast({
        title: "Updated! ✨",
        description: "Video details have been saved",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update video details",
        variant: "destructive"
      });
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      await VideoStorage.deleteVideo(videoId);
      onVideosChange();
      
      toast({
        title: "Deleted 🗑️",
        description: "Video removed from your library",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete video",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !editTags.includes(trimmedTag)) {
      setEditTags([...editTags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your Library is Empty
          </h2>
          <p className="text-muted-foreground">
            Add some motivational videos to get started
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Library
          </h1>
          <p className="text-muted-foreground">
            {videos.length} motivational video{videos.length !== 1 ? 's' : ''} ready to inspire
          </p>
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-card backdrop-blur-sm border border-border rounded-2xl p-6 shadow-elegant"
              >
                {editingId === video.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Video title"
                      className="bg-background/50"
                    />
                    
                    <div className="space-y-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Add tags..."
                        className="bg-background/50"
                      />
                      
                      {editTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              #{tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={saveEdit}
                        className="bg-gradient-button flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="outline"
                        className="border-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Play className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate mb-1">
                        {video.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        Added {new Date(video.createdAt).toLocaleDateString()}
                        {video.duration && ` • ${Math.round(video.duration)}s`}
                      </p>

                      {video.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {video.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-accent/10 text-accent text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPlayVideo(video.id)}
                        className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-lg transition-all"
                      >
                        <Play className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEditing(video)}
                        className="bg-accent/20 hover:bg-accent/30 text-accent p-2 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteVideo(video.id)}
                        className="bg-destructive/20 hover:bg-destructive/30 text-destructive p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};