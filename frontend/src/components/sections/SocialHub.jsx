
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Zap, ThumbsUp, MessageCircle, Share2, Image as ImageIcon, Send, Trash2, Users, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PostCard = ({ post, currentUser, onLike, onComment, onShare, onDelete, onUploadImage }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
      toast({ title: "Comment posted! 💬" });
    }
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  return (
    <Card className="glass-effect overflow-hidden card-interactive">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src={post.userAvatarUrl || `https://avatar.vercel.sh/${post.userHandle || post.user}.png?size=40`} alt={post.user} />
          <AvatarFallback className={post.avatarColor || 'bg-primary'}>{getInitials(post.user)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">{post.user}</CardTitle>
          <p className="text-xs text-muted-foreground">{post.time}</p>
        </div>
        {post.user === currentUser.name && (
          <Button variant="ghost" size="icon" className="ml-auto text-destructive/70 hover:text-destructive" onClick={() => onDelete(post.id)} title="Delete post">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-3 text-sm whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="rounded-lg overflow-hidden border border-border/50 mb-3 aspect-video bg-muted">
            <img-replace src={post.imageUrl} alt="Post image" className="w-full h-full object-contain" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t border-border/20 flex justify-between items-center">
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className="text-muted-foreground hover:text-primary">
            <ThumbsUp className={`w-4 h-4 mr-1 ${post.likedByMe ? 'text-primary fill-primary' : ''}`} /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="text-muted-foreground hover:text-primary">
            <MessageCircle className="w-4 h-4 mr-1" /> {post.commentsData?.length || 0}
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onShare(post.id)} className="text-muted-foreground hover:text-primary">
          <Share2 className="w-4 h-4 mr-1" /> Share
        </Button>
      </CardFooter>
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-t border-border/20 bg-background/30"
          >
            <div className="space-y-3 max-h-60 overflow-y-auto mb-3 pr-2 scrollbar-thin">
              {post.commentsData && post.commentsData.length > 0 ? (
                post.commentsData.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.userAvatarUrl || `https://avatar.vercel.sh/${comment.userHandle || comment.user}.png?size=32`} alt={comment.user} />
                      <AvatarFallback className={comment.avatarColor || 'bg-secondary'}>{getInitials(comment.user)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/50 p-2 rounded-lg flex-1">
                      <p className="text-xs font-semibold">{comment.user}</p>
                      <p className="text-xs whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Textarea 
                placeholder="Write a comment..." 
                className="text-xs min-h-[40px]" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button size="icon" onClick={handleCommentSubmit} disabled={!commentText.trim()} className="btn-primary-glow">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const AIChatModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm your RG Fling AI Assistant. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newUserMessage = { id: Date.now(), sender: 'user', text: userInput };
    // Placeholder for AI response
    const aiResponse = { id: Date.now() + 1, sender: 'ai', text: `Thanks for your message: "${userInput}". I'm still learning, but I'll do my best to help! (This is a simulated response)` };
    
    setChatMessages(prev => [...prev, newUserMessage, aiResponse]);
    setUserInput('');
    setNotifications("Sent a message to AI Chat Assistant.", "social");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-lg h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border/20">
          <DialogTitle className="flex items-center text-xl"><Zap className="w-5 h-5 mr-2 text-blue-400"/>AI Chat Assistant</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] p-2.5 rounded-lg text-sm ${msg.sender === 'ai' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="p-4 border-t border-border/20 bg-background/50">
          <div className="flex w-full space-x-2">
            <Input 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder="Type your message..." 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!userInput.trim()} className="btn-primary-glow">
              <Send className="w-4 h-4"/>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const SocialHub = ({ setNotifications, currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isAIChatModalOpen, setIsAIChatModalOpen] = useState(false);
  
  useEffect(() => {
    const savedPosts = localStorage.getItem('socialPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts = [
        {
          id: 1, user: "Alex Johnson", userHandle: "alexj", userAvatarUrl: null, avatarColor: "bg-green-500", time: "2h ago",
          content: "Just earned 500 RGX Coins from the education platform! 🎓 This platform is amazing for learning and earning. Highly recommend checking out the new AI courses.",
          imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
          likes: 24, likedByMe: false, commentsData: [
            {id: 101, user: currentUser.name, userHandle: currentUser.username, text: "Congrats Alex!", userAvatarUrl: null, avatarColor: currentUser.avatarColor},
            {id: 102, user: "Jane Doe", userHandle: "janed", text: "Wow, that's awesome!", userAvatarUrl: null, avatarColor: "bg-pink-500"},
          ], shares: 3
        },
        {
          id: 2, user: "Sarah Chen", userHandle: "sarahc", userAvatarUrl: null, avatarColor: "bg-purple-500", time: "4h ago",
          content: "Amazing marketplace deals today! Found the perfect freelancer for my project. 💼 The quality of work is top-notch.",
          imageUrl: null, likes: 18, likedByMe: true, commentsData: [], shares: 2
        }
      ];
      setPosts(initialPosts);
    }
  }, [currentUser.name, currentUser.username, currentUser.avatarColor]);

  useEffect(() => {
    localStorage.setItem('socialPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post! 📝", description: "Please write something to post.", variant: "destructive" });
      return;
    }
    const newPost = {
      id: Date.now(), user: currentUser.name, userHandle: currentUser.username, userAvatarUrl: currentUser.avatarUrl, 
      avatarColor: currentUser.avatarColor, time: "Just now", content: newPostContent, imageUrl: null, 
      likes: 0, likedByMe: false, commentsData: [], shares: 0
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostContent('');
    setShowCreatePost(false);
    toast({ title: "Post Created! 🎉", description: "Your thoughts are now shared with the world." });
    setNotifications("You created a new post.", "social");
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(p => p.id === postId ? {...p, likes: p.likedByMe ? p.likes -1 : p.likes + 1, likedByMe: !p.likedByMe} : p));
    const post = posts.find(p => p.id === postId);
    if (post && !post.likedByMe && post.user !== currentUser.name) { 
       setNotifications(`${currentUser.name} liked ${post.user === currentUser.name ? 'your' : `${post.user}'s`} post.`, "social");
    }
  };

  const handleCommentOnPost = (postId, commentText) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: Date.now(), user: currentUser.name, userHandle: currentUser.username,
          userAvatarUrl: currentUser.avatarUrl, avatarColor: currentUser.avatarColor, text: commentText,
        };
        return {...p, commentsData: [newComment, ...(p.commentsData || [])]};
      }
      return p;
    }));
    const post = posts.find(p => p.id === postId);
     if (post && post.user !== currentUser.name) {
       setNotifications(`${currentUser.name} commented on ${post.user === currentUser.name ? 'your' : `${post.user}'s`} post.`, "social");
    }
  };
  
  const handleSharePost = (postId) => {
    toast({ title: "Shared! 🚀", description: "This post has been 'shared' (feature placeholder)." });
    setNotifications(`You shared a post.`, "social");
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({ title: "Post Deleted! 🗑️", description: "Your post has been removed." });
    setNotifications("You deleted a post.", "system");
  };

  const handleUploadImage = () => {
    toast({ title: "🚧 Image Upload Coming Soon!", description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
    setNotifications("Image upload for post attempted.", "system");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <AIChatModal isOpen={isAIChatModalOpen} onOpenChange={setIsAIChatModalOpen} setNotifications={setNotifications} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Social Hub</h1>
        <Button className="neon-glow btn-primary-glow" onClick={() => setShowCreatePost(!showCreatePost)}>
          <Plus className="w-4 h-4 mr-2" />
          {showCreatePost ? 'Cancel' : 'Create Post'}
        </Button>
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <Card className="glass-effect mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Share your thoughts...</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`What's on your mind, ${currentUser.name}?`}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <Button variant="ghost" size="icon" onClick={handleUploadImage} title="Add image">
                  <ImageIcon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="btn-primary-glow">
                  <Send className="w-4 h-4 mr-2" /> Post
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="glass-effect rounded-xl p-6 neon-glow card-interactive">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <div>
                <h3 className="text-xl font-bold">AI Chat Assistant</h3>
                <p className="text-xs text-muted-foreground">Get instant help & recommendations!</p>
            </div>
          </div>
          <Button onClick={() => setIsAIChatModalOpen(true)} className="btn-primary-glow">
            <MessageSquare className="w-4 h-4 mr-2" />Start Chat
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: "circOut" }}
          >
            <PostCard 
              post={post} 
              currentUser={currentUser}
              onLike={handleLikePost} 
              onComment={handleCommentOnPost}
              onShare={handleSharePost}
              onDelete={handleDeletePost}
              onUploadImage={handleUploadImage}
            />
          </motion.div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-10 glass-effect rounded-xl">
            <Users className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">It's quiet here...</h3>
            <p className="text-muted-foreground">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialHub;
