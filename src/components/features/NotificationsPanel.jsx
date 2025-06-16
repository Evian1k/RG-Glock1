
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Bell, CheckCircle, Trash2, Zap, Gift, Users, ShoppingCart, GraduationCap, Gamepad2, HeartPulse, Coins as RGXCoinIcon, AlertTriangle } from 'lucide-react';

const getNotificationIcon = (type) => {
  const iconProps = "w-6 h-6 flex-shrink-0"; // Slightly larger icons
  switch (type) {
    case 'social': return <Users className={`${iconProps} text-blue-400`} />;
    case 'reward': return <Gift className={`${iconProps} text-yellow-400`} />;
    case 'system': return <Zap className={`${iconProps} text-purple-400`} />;
    case 'marketplace': return <ShoppingCart className={`${iconProps} text-green-400`} />;
    case 'education': return <GraduationCap className={`${iconProps} text-indigo-400`} />;
    case 'entertainment': return <Gamepad2 className={`${iconProps} text-red-400`} />;
    case 'health': return <HeartPulse className={`${iconProps} text-pink-400`} />;
    case 'wallet': return <RGXCoinIcon className={`${iconProps} text-orange-400`} />;
    case 'welcome': return <Bell className={`${iconProps} text-primary`} />;
    case 'reminder': return <Bell className={`${iconProps} text-yellow-500`} />;
    case 'error': return <AlertTriangle className={`${iconProps} text-destructive`} />;
    default: return <Bell className={`${iconProps} text-muted-foreground`} />;
  }
};


const NotificationsPanel = ({ notifications, onClose, onMarkAsRead, onClearAll, onMarkAllAsRead }) => {
  const panelVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.35, ease: "circOut" }}
      className="fixed top-0 right-0 h-full w-full max-w-md glass-effect shadow-2xl z-[60] flex flex-col border-l border-border/30"
    >
      <div className="flex items-center justify-between p-5 border-b border-border/20 sticky top-0 bg-card/80 backdrop-blur-sm z-10">
        <h2 className="text-xl font-semibold flex items-center text-foreground">
          <Bell className="w-6 h-6 mr-3 text-primary" />
          Notifications
          {unreadCount > 0 && <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center justify-center h-full">
            <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay:0.2, type:'spring', stiffness:150}}>
              <Bell className="w-20 h-20 mx-auto mb-6 opacity-30" />
            </motion.div>
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm mt-1">Your notification tray is empty.</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.07, ease: "circOut" }}
              className={`p-3.5 rounded-lg flex items-start space-x-3.5 transition-all duration-200 ease-out relative overflow-hidden group ${
                notification.read ? 'bg-background/40 opacity-75 hover:opacity-100' : 'bg-primary/10 neon-glow-subtle hover:bg-primary/20'
              }`}
            >
             {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-md"></div>}
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <p className={`text-sm leading-snug ${notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:text-primary/80 h-8 w-8 flex-shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Mark as read"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
         <div className="p-4 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-3 bg-card/80 backdrop-blur-sm sticky bottom-0 z-10">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto rounded-lg"
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Mark all as read
            </Button>
             <Button 
              variant="destructive" 
              size="sm"
              className="w-full sm:w-auto rounded-lg"
              onClick={onClearAll}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationsPanel;
