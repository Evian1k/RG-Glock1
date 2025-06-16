import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Gamepad2, Music, Video, Play, Star, Users, Tv, Radio, DollarSign, Ticket, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";

const EntertainmentCard = ({ item, onAction }) => (
  <Card className="glass-effect overflow-hidden h-full flex flex-col">
    <CardHeader className="p-0 relative">
      <div className="aspect-video overflow-hidden bg-muted">
        <img-replace src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>
      {item.live && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Radio className="w-3 h-3 mr-1 animate-pulse" /> LIVE
        </div>
      )}
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-lg font-semibold mb-1">{item.title}</CardTitle>
      <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
      <p className="text-sm text-muted-foreground mb-3 h-10 overflow-hidden text-ellipsis">{item.description}</p>
      {item.viewers && <p className="text-xs text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1"/>{item.viewers.toLocaleString()} watching</p>}
    </CardContent>
    <CardFooter className="p-4 border-t border-border/20">
      <Button className="w-full neon-glow" onClick={() => onAction(item)}>
        {item.actionIcon || <PlayCircle className="w-4 h-4 mr-2" />} {item.actionText || "Watch Now"}
      </Button>
    </CardFooter>
  </Card>
);


const Entertainment = ({ setNotifications }) => {
  const gamingItems = [
    { id: "g1", title: "RGX Arena Fighters", category: "Fighting Game", description: "Battle it out in the ultimate arena!", imageUrl: "Characters fighting in a vibrant arena", viewers: 12500, live: true, actionText: "Join Tournament (50 RGX)" },
    { id: "g2", title: "Cosmic Racers", category: "Racing Game", description: "Speed through futuristic tracks.", imageUrl: "Futuristic race cars on a glowing track", actionText: "Play Now" },
  ];
  const musicItems = [
    { id: "m1", title: "Chill Vibes Radio", category: "Live Radio", description: "Relax with lo-fi beats and chillhop.", imageUrl: "Headphones with abstract sound waves", viewers: 5200, live: true, actionText: "Listen Live", actionIcon: <Music className="w-4 h-4 mr-2"/> },
    { id: "m2", title: "Top Hits Playlist", category: "Playlist", description: "The biggest tracks right now.", imageUrl: "Music notes and audio visualizations", actionText: "Play Playlist", actionIcon: <Music className="w-4 h-4 mr-2"/> },
  ];
  const videoItems = [
    { id: "v1", title: "Tech Review Weekly", category: "Live Show", description: "Latest gadgets and tech news.", imageUrl: "Tech reviewer with gadgets on a desk", viewers: 8800, live: true, actionText: "Watch Live", actionIcon: <Tv className="w-4 h-4 mr-2"/> },
    { id: "v2", title: "The RGX Documentary", category: "Movie", description: "The story behind the platform.", imageUrl: "Movie poster for a documentary film", actionText: "Watch Movie", actionIcon: <Video className="w-4 h-4 mr-2"/> },
  ];

  const handleAction = (item) => {
    toast({ title: `🚧 Accessing ${item.title}`, description: "This feature is under development. Check back later! 🚀" });
    setNotifications(`Accessed "${item.title}" in Entertainment.`, "entertainment");
  };

  const handleSubscription = (type) => {
     toast({ title: `🚧 ${type} Subscription Coming Soon!`, description: "This feature is under development. Check back later! 🚀" });
     setNotifications(`Attempted to manage ${type} subscription.`, "system");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <motion.h1 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          Entertainment Hub
        </motion.h1>
        <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          Games, music, videos, and live streams. Your daily dose of fun!
        </motion.p>
      </div>

      <Tabs defaultValue="gaming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 mb-6 glass-effect p-2 rounded-lg">
          <TabsTrigger value="gaming" className="py-2.5"><Gamepad2 className="w-4 h-4 mr-2"/>Gaming</TabsTrigger>
          <TabsTrigger value="music" className="py-2.5"><Music className="w-4 h-4 mr-2"/>Music</TabsTrigger>
          <TabsTrigger value="video" className="py-2.5"><Video className="w-4 h-4 mr-2"/>Video & Streams</TabsTrigger>
        </TabsList>

        <TabsContent value="gaming">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gamingItems.map((item, index) => (
                <motion.div key={item.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index * 0.1}}>
                    <EntertainmentCard item={item} onAction={handleAction} />
                </motion.div>
            ))}
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: gamingItems.length * 0.1}}>
                <Card className="glass-effect overflow-hidden h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-border/50 hover:border-primary transition-colors">
                    <Gamepad2 className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">More Games Coming Soon!</h3>
                    <p className="text-muted-foreground text-sm">Explore our growing library of P2E games and tournaments.</p>
                </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        <TabsContent value="music">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {musicItems.map((item,index) => (
                <motion.div key={item.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index * 0.1}}>
                    <EntertainmentCard item={item} onAction={handleAction} />
                </motion.div>
            ))}
             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: musicItems.length * 0.1}}>
                <Card className="glass-effect overflow-hidden h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-border/50 hover:border-primary transition-colors">
                    <Music className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Discover New Artists</h3>
                    <p className="text-muted-foreground text-sm">Millions of tracks, curated playlists, and live radio stations.</p>
                </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
        <TabsContent value="video">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videoItems.map((item, index) => (
                <motion.div key={item.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index * 0.1}}>
                    <EntertainmentCard item={item} onAction={handleAction} />
                </motion.div>
            ))}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: videoItems.length * 0.1}}>
                <Card className="glass-effect overflow-hidden h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-border/50 hover:border-primary transition-colors">
                    <Play className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Stream Your World</h3>
                    <p className="text-muted-foreground text-sm">Watch movies, shows, or start your own live stream.</p>
                </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center"><Ticket className="w-6 h-6 mr-2 text-primary"/>Live Streaming Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-3">Enjoy your first month of live streaming on us! After that, it's just $2.50/month (payable in RGX Coins) for unlimited access.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full neon-glow" onClick={() => handleSubscription('Live Streaming')}>
              Start 1-Month Free Trial
            </Button>
          </CardFooter>
        </Card>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center"><DollarSign className="w-6 h-6 mr-2 text-green-400"/>Betting Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-3">Place bets on your favorite games and events using RGX Coins. A 3% fee applies to all winnings. Bet responsibly.</p>
          </CardContent>
          <CardFooter>
             <Button className="w-full" variant="outline" onClick={() => handleAction({title: "Betting Platform"})}>
              Explore Betting Odds
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
};

export default Entertainment;