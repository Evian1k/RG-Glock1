
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Edit3, Mail, MapPin, X, CheckCircle, Shield, MessageCircle } from 'lucide-react';

const UserProfileModal = ({ user, onClose, onEdit }) => {
  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const isEmailVisible = user.preferences?.privacy?.showEmail ?? false;
  const isLocationVisible = user.preferences?.privacy?.showLocation ?? true;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-effect sm:max-w-md p-0 overflow-hidden rounded-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: "circOut" }}
        >
          <div className="h-40 bg-gradient-to-br from-primary via-green-400 to-teal-400 relative group">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20 rounded-full transition-all" onClick={onClose}>
              <X className="w-5 h-5"/>
            </Button>
             {user.isVerified && (
                <div className="absolute bottom-3 left-4 bg-white/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1 font-semibold">
                    <CheckCircle className="w-3 h-3"/>
                    <span>Verified User</span>
                </div>
            )}
          </div>
          <div className="relative px-6 pb-6">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <Avatar className={`w-32 h-32 rounded-full border-4 border-background shadow-lg ${user.avatarColor || 'bg-primary'} flex items-center justify-center overflow-hidden`}>
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : null }
                <AvatarFallback className="text-5xl font-semibold text-primary-foreground bg-transparent w-full h-full flex items-center justify-center">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="pt-20 text-center">
              <DialogTitle className="text-3xl font-bold text-foreground">{user.name || "User Name"}</DialogTitle>
              <p className="text-base text-primary font-medium">{user.username || "@username"}</p>
            </div>
            
            <p className="text-sm text-center my-6 text-muted-foreground px-4 min-h-[40px]">
              {user.bio || "No bio yet. Click edit to add one and tell the world about yourself!"}
            </p>
            
            <div className="flex justify-around text-center my-6 border-t border-b border-border/30 py-5 bg-background/20 rounded-lg">
              <div>
                <p className="text-2xl font-bold text-foreground">{user.postsCount || 0}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.followers || 0}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.following || 0}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
            </div>
            
            <div className="space-y-3.5 text-sm px-2">
              {user.email && isEmailVisible && (
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-3 text-primary flex-shrink-0" /> {user.email}
                </div>
              )}
              {user.location && isLocationVisible && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-3 text-primary flex-shrink-0" /> {user.location}
                </div>
              )}
              {(!user.email || !isEmailVisible) && (!user.location || !isLocationVisible) && (
                 <p className="text-xs text-muted-foreground text-center italic py-2">Contact info is private or not set.</p>
              )}
            </div>

          </div>
          <DialogFooter className="p-6 pt-3 flex flex-col sm:flex-row sm:justify-between gap-3 bg-background/50 border-t border-border/20">
             <Button variant="outline" className="w-full sm:w-auto" onClick={() => { /* Placeholder for direct message */ }}>
              <MessageCircle className="w-4 h-4 mr-2" /> Message
            </Button>
            <Button className="w-full sm:w-auto btn-primary-glow" onClick={() => { onClose(); onEdit(); }}>
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
