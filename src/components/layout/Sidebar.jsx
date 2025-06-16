
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coins, Moon, Sun, Bell, UserCircle, Settings, LogOut, Shield, LifeBuoy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sidebar = ({ 
  activeTab, setActiveTab, 
  isMenuOpen, setIsMenuOpen, 
  rgxCoins, 
  toggleTheme, isDarkMode, 
  navigationItems, 
  onNotificationsToggle, unreadNotificationsCount,
  onShowProfile, onShowSettings, currentUser
}) => {
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out Successfully! 👋",
      description: "You have been logged out of RG Fling. See you soon!",
      duration: 4000,
    });
  };

  const handleGenericClick = (featureName) => {
    toast({ title: `🚧 ${featureName} Not Yet Implemented`, description: "This feature is on our roadmap! 🚀" });
  };

  return (
    <motion.div 
      className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:flex-col w-full lg:w-72 glass-effect border-r lg:border-r-border/20 p-4 sm:p-6 fixed lg:sticky top-0 h-screen lg:h-auto z-40 lg:z-auto overflow-y-auto lg:overflow-y-visible scrollbar-thin flex flex-col`}
      initial={{ x: isMenuOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.35, ease: "circOut" }}
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center space-x-3">
          <img-replace src="/rg_fling_logo.svg" alt="RG Fling Logo" className="w-10 h-10 rounded-full shadow-md" />
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">
              RG Fling
            </h1>
            <p className="text-xs text-muted-foreground">The Ultimate Platform</p>
          </div>
        </div>
      </div>

      <motion.div 
        className="mb-6 p-4 glass-effect rounded-lg neon-glow-subtle flex items-center space-x-3 cursor-pointer card-interactive" 
        onClick={onShowProfile}
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px hsl(var(--primary) / 0.4)" }}
        whileTap={{ scale: 0.99 }}
      >
         <Avatar className="w-11 h-11 border-2 border-primary/50 shadow-sm">
            <AvatarImage src={currentUser.avatarUrl || ''} alt={currentUser.name} />
            <AvatarFallback className={`${currentUser.avatarColor || 'bg-primary'} text-primary-foreground font-semibold text-lg`}>
                {getInitials(currentUser.name)}
            </AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <p className="font-semibold text-sm text-foreground truncate">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground truncate">{currentUser.username}</p>
        </div>
      </motion.div>


      <motion.div 
        className="mb-6 p-4 glass-effect rounded-lg neon-glow-subtle card-interactive"
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px hsl(var(--primary) / 0.4)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-foreground">RGX Coins</span>
          </div>
          <span className="text-xl font-bold text-yellow-400">{rgxCoins.toLocaleString()}</span>
        </div>
      </motion.div>

      <nav className="space-y-1.5 flex-grow">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start space-x-3 text-sm py-2.5 h-auto rounded-lg transition-all duration-200 ${
                isActive ? 'btn-primary-glow shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-accent/70 hover:scale-102'
              }`}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsMenuOpen && typeof window !== 'undefined' && window.innerWidth < 1024) setIsMenuOpen(false);
              }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : ''}`} />
              <span className={`${isActive ? 'text-primary-foreground font-semibold' : ''}`}>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/20 space-y-1.5 shrink-0">
        <Button variant="ghost" className="w-full justify-start space-x-3 text-sm py-2.5 h-auto text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-lg" onClick={onNotificationsToggle}>
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-sm py-2.5 h-auto text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-lg" onClick={onShowSettings}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-sm py-2.5 h-auto text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-lg" onClick={() => handleGenericClick("Help & Support")}>
          <LifeBuoy className="w-5 h-5" />
          <span>Help & Support</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-sm py-2.5 h-auto text-muted-foreground hover:text-foreground hover:bg-accent/70 rounded-lg" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>
         <Button variant="ghost" className="w-full justify-start space-x-3 text-sm py-2.5 h-auto text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
