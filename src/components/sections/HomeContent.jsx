import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Users, TrendingUp, Star, Gift, Zap, Crown, Trophy } from 'lucide-react';

const HomeContent = ({ rgxCoins, onSpin, hasSpunToday, setNotifications }) => {
  
  const handleVipUpgrade = () => {
    toast({ title: "🚧 VIP Membership Coming Soon!", description: "This feature is under development. Check back later! 🚀" });
    setNotifications("VIP Membership upgrade attempted.", "system");
  };

  const handleViewRankings = () => {
    toast({ title: "🚧 Leaderboards Coming Soon!", description: "This feature is under development. Check back later! 🚀" });
    setNotifications("Leaderboard view attempted.", "system");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          Welcome to RG Fling
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The ultimate platform combining social networking, marketplace, education, entertainment, and health services all in one place!
        </motion.p>
      </div>

      <motion.div 
        className="max-w-md mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
      >
        <div className="glass-effect rounded-2xl p-6 text-center neon-glow">
          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
            <Gift className="w-8 h-8 text-yellow-400" />
            <span>Daily Spin Wheel</span>
          </h3>
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <motion.div 
              className="w-full h-full coin-gradient rounded-full flex items-center justify-center"
              animate={{ rotate: hasSpunToday ? 0 : 3600 }}
              transition={{ duration: hasSpunToday ? 0 : 10, ease: "linear", repeat: hasSpunToday ? 0 : Infinity }}
            >
              <Zap className="w-16 h-16 text-black" />
            </motion.div>
          </div>
          <Button
            onClick={onSpin}
            disabled={hasSpunToday}
            className="w-full neon-glow"
            size="lg"
          >
            {hasSpunToday ? "Come Back Tomorrow!" : "Spin for RGX Coins!"}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Users, label: "Active Users", value: "50K+", color: "text-blue-400" },
          { icon: TrendingUp, label: "Daily Transactions", value: "1.2M", color: "text-green-400" },
          { icon: Star, label: "Platform Rating", value: "4.9/5", color: "text-yellow-400" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="glass-effect rounded-xl p-6 text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 50 }}
          >
            <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
            <h3 className="text-3xl font-bold">{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
            className="glass-effect rounded-xl p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span>VIP Membership</span>
          </h3>
          <p className="text-muted-foreground mb-4">
            Unlock premium features, exclusive content, and priority support for just $1.19/month!
          </p>
          <Button className="w-full neon-glow" onClick={handleVipUpgrade}>
            Upgrade to VIP
          </Button>
        </motion.div>

        <motion.div 
            className="glass-effect rounded-xl p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-green-400" />
            <span>Leaderboards</span>
          </h3>
          <p className="text-muted-foreground mb-4">
            Compete with other users and climb the rankings to earn exclusive rewards!
          </p>
          <Button variant="outline" className="w-full" onClick={handleViewRankings}>
            View Rankings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeContent;