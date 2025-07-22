import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Library } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'feed' | 'add' | 'library';
  onTabChange: (tab: 'feed' | 'add' | 'library') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'add', icon: Plus, label: 'Add' },
    { id: 'library', icon: Library, label: 'Library' },
  ] as const;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center p-3 min-w-0 flex-1"
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-2 bg-gradient-primary rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`relative z-10 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab.id === 'add' ? (
                    <motion.div
                      animate={{ 
                        rotate: isActive ? 90 : 0,
                        scale: isActive ? 1.2 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'shadow-glow' : ''}`} />
                    </motion.div>
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? 'shadow-glow' : ''}`} />
                  )}
                </motion.div>
                
                {/* Label */}
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                    y: isActive ? 0 : 2
                  }}
                  className={`relative z-10 text-xs font-medium mt-1 ${
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};