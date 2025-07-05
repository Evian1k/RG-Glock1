import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import HomeContent from '@/components/sections/HomeContent';
import SocialHub from '@/components/sections/SocialHub';
import Marketplace from '@/components/sections/Marketplace';
import Education from '@/components/sections/Education';
import Entertainment from '@/components/sections/Entertainment';
import HealthAI from '@/components/sections/HealthAI';
import RGXWallet from '@/components/sections/RGXWallet';
import NotificationsPanel from '@/components/features/NotificationsPanel';
import { navigationItems } from '@/config/navigation';
import UserProfileModal from '@/components/features/UserProfileModal';
import SettingsModal from '@/components/features/SettingsModal';
import AuthForms from '@/components/AuthForms';
import { Loader2 } from 'lucide-react';

const initialUserProfile = {
  name: "RG Fling User",
  username: "@rgfling_user",
  bio: "Exploring the ultimate platform! ✨🚀 Ready to connect and discover.",
  avatarColor: "bg-blue-500",
  avatarUrl: null,
  followers: 120,
  following: 75,
  postsCount: 15,
  email: "user@example.com",
  location: "Metaverse",
  preferences: {
    notifications: {
      social: true,
      marketplace: true,
      system: true,
    },
    privacy: {
      showEmail: false,
      showLocation: true,
    }
  }
};

const initialNotifications = [
  { id: Date.now() + 1, message: "Welcome to RG Fling! Your adventure starts now. Explore and earn RGX coins.", read: false, time: "10m ago", type: "welcome" },
  { id: Date.now() + 2, message: "Your daily spin is ready! Don't miss out on free RGX.", read: false, time: "1h ago", type: "reminder" },
  { id: Date.now() + 3, message: "Alex Johnson liked your recent post about AI courses. Keep up the great content!", read: true, time: "3h ago", type: "social" },
  { id: Date.now() + 4, message: "Marketplace Deal: 20% off on all digital assets today only!", read: false, time: "5h ago", type: "marketplace" }
];


function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [rgxCoins, setRgxCoins] = useState(1250);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [pythonInfo, setPythonInfo] = useState(null);
  const [pythonFunFact, setPythonFunFact] = useState(null);
  const [evalInput, setEvalInput] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [authedUser, setAuthedUser] = useState(null); // Auth state, do not persist in localStorage for security

  useEffect(() => {
    // NOTE: The following useEffect hooks use localStorage for demo purposes only.
    // TODO: Replace with backend API calls for persistent, secure data storage.
    const loadAppData = () => {
      try {
        const savedTheme = localStorage.getItem('isDarkMode');
        setIsDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : true);

        const savedCoins = localStorage.getItem('rgxCoins');
        setRgxCoins(savedCoins ? parseInt(savedCoins) : 1250);
        
        const lastSpin = localStorage.getItem('lastSpinDate');
        setHasSpunToday(lastSpin === new Date().toDateString());

        const savedNotifications = localStorage.getItem('notifications');
        setNotifications(savedNotifications ? JSON.parse(savedNotifications) : initialNotifications);

        const savedProfile = localStorage.getItem('userProfile');
        setUserProfile(savedProfile ? JSON.parse(savedProfile) : initialUserProfile);

      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        toast({ title: "Error Loading Data", description: "Could not load saved preferences. Using defaults.", variant: "destructive"});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppData();
  }, []);


  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('rgxCoins', rgxCoins.toString());
  }, [rgxCoins, isLoading]);

  useEffect(() => {
    if (!isLoading) localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile, isLoading]);
  
  useEffect(() => {
    if (!isLoading) localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications, isLoading]);

  useEffect(() => {
    fetch('/api/python-info')
      .then(res => res.json())
      .then(data => setPythonInfo(data))
      .catch(() => setPythonInfo(null));
  }, []);

  useEffect(() => {
    fetch('/api/python-fun-fact')
      .then(res => res.json())
      .then(data => setPythonFunFact(data.fact))
      .catch(() => setPythonFunFact(null));
  }, []);

  const addNotification = useCallback((message, type = "system") => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      time: "Just now",
      type,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      addNotification(`Theme changed to ${newMode ? 'Dark' : 'Light'} Mode. Enjoy the new look!`, "system");
      return newMode;
    });
  }, [addNotification]);

  const handleSpinWheel = useCallback(() => {
    if (hasSpunToday) {
      toast({
        title: "Already Spun Today! 🎯",
        description: "Patience, young grasshopper! Your next spin awaits tomorrow.",
        variant: "default",
        duration: 3000,
      });
      return;
    }

    const rewards = [50, 100, 150, 200, 250, 500, 750, 1000];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    setRgxCoins(prevCoins => {
      const newTotal = prevCoins + randomReward;
      addNotification(`🎉 You won ${randomReward} RGX Coins from the daily spin! Your balance is updated.`, "reward");
      toast({
        title: `🌟 Jackpot! You Won ${randomReward} RGX Coins! 🌟`,
        description: `Your new RGX balance: ${newTotal.toLocaleString()}`,
        duration: 5000,
      });
      return newTotal;
    });
    setHasSpunToday(true);
    localStorage.setItem('lastSpinDate', new Date().toDateString());
  }, [hasSpunToday, addNotification]);

  const toggleNotificationsPanel = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map((n) => ({ ...n, read: true }))
    );
    addNotification("All notifications marked as read. Inbox zero achieved!", "system");
  }, [addNotification]);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    toast({ title: "Notifications Cleared! 🗑️", description: "Your notification list is now sparkling clean." });
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setUserProfile(prevProfile => ({...prevProfile, ...updatedProfile}));
    toast({ title: "Profile Updated! ✨", description: "Your new look and info are saved." });
    addNotification("Your profile details have been successfully updated.", "system");
  }, [addNotification]);

  const updateRgxCoins = useCallback((amount) => {
    setRgxCoins(prevCoins => Math.max(0, prevCoins + amount)); // Prevent negative balance
  }, []);

  const handleStripeCheckout = async (priceId, productName) => {
    addNotification(`Initiating secure checkout for ${productName}... Please wait.`, "system");
    toast({
      title: "🚧 Stripe Not Fully Implemented 🚧",
      description: "Real payment processing requires your Stripe Publishable Key & Price ID. This is a frontend simulation.",
      variant: "destructive",
      duration: 7000,
    });
    
    setTimeout(() => {
      toast({
        title: "Purchase Successful (Simulated)! 🛍️",
        description: `You've 'purchased' ${productName}. Thank you for 'shopping' with RG Fling!`,
      });
      addNotification(`Successfully 'purchased' ${productName}. Your order is 'on its way'!`, "marketplace");
    }, 2000);

  };

  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    setEvalLoading(true);
    setEvalResult(null);
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: evalInput })
      });
      const data = await res.json();
      if (data.result !== undefined) setEvalResult(data.result.toString());
      else setEvalResult('Error: ' + (data.error || 'Unknown error'));
    } catch {
      setEvalResult('Error: Could not connect to backend');
    }
    setEvalLoading(false);
  };

  const handleAuthSuccess = (user) => {
    setAuthedUser(user);
    // TODO: Use secure HTTP-only cookies or backend session for real authentication
    // Do NOT store user info in localStorage for production apps
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gradient-bg text-foreground">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
        <img-replace src="/rg_fling_logo.svg" alt="RG Fling Loading" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Loading RG Fling...</h1>
        <p className="text-lg text-muted-foreground">Preparing your ultimate platform experience!</p>
      </div>
    );
  }

  if (!authedUser) {
    return <AuthForms onAuthSuccess={handleAuthSuccess} />;
  }

  const renderContent = () => {
    const commonProps = { setNotifications: addNotification, currentUser: userProfile, rgxCoins, updateRgxCoins, handleStripeCheckout };
    switch (activeTab) {
      case 'home':
        return <HomeContent {...commonProps} onSpin={handleSpinWheel} hasSpunToday={hasSpunToday} />;
      case 'social':
        return <SocialHub {...commonProps} />;
      case 'marketplace':
        return <Marketplace {...commonProps} />;
      case 'education':
        return <Education {...commonProps} />;
      case 'entertainment':
        return <Entertainment {...commonProps} />;
      case 'health':
        return <HealthAI {...commonProps} />;
      case 'wallet':
        return <RGXWallet {...commonProps} />;
      default:
        return <HomeContent {...commonProps} onSpin={handleSpinWheel} hasSpunToday={hasSpunToday} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} gradient-bg font-sans antialiased flex flex-col`}>
      <div className="flex flex-col lg:flex-row flex-1">
        <MobileHeader 
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
          isMenuOpen={isMenuOpen} 
          onNotificationsToggle={toggleNotificationsPanel}
          unreadNotificationsCount={unreadNotificationsCount}
        />
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          rgxCoins={rgxCoins}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          navigationItems={navigationItems}
          onNotificationsToggle={toggleNotificationsPanel}
          unreadNotificationsCount={unreadNotificationsCount}
          onShowProfile={() => setShowUserProfile(true)}
          onShowSettings={() => setShowSettings(true)}
          currentUser={userProfile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }} /* Smoother cubic bezier */
              className="p-4 md:p-6 lg:p-8"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {showNotifications && (
              <NotificationsPanel
                notifications={notifications}
                onClose={toggleNotificationsPanel}
                onMarkAsRead={markNotificationAsRead}
                onClearAll={clearAllNotifications}
                onMarkAllAsRead={markAllNotificationsAsRead}
              />
            )}
            {showUserProfile && (
              <UserProfileModal 
                user={userProfile} 
                onClose={() => setShowUserProfile(false)}
                onEdit={() => { setShowUserProfile(false); setTimeout(() => setShowSettings(true), 150); }} /* Delay for smoother transition */
              />
            )}
            {showSettings && (
              <SettingsModal
                user={userProfile}
                onClose={() => setShowSettings(false)}
                onSave={handleProfileUpdate}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
      <footer className="w-full text-center py-4 bg-black bg-opacity-60 text-white text-sm mt-auto">
        <span role="img" aria-label="python">🐍</span> Powered by <strong>Python</strong> & Flask API — Python is the backbone of our backend, handling all business logic, data, and API services.<br />
        {pythonInfo && (
          <span className="block mt-1 text-xs text-gray-300">Python {pythonInfo.python_version} ({pythonInfo.implementation}) on {pythonInfo.system} {pythonInfo.release}</span>
        )}
        {pythonFunFact && (
          <span className="block mt-1 text-xs text-yellow-200 italic">Fun Fact: {pythonFunFact}</span>
        )}
        <form onSubmit={handleEvalSubmit} className="mt-2 flex flex-col items-center gap-1">
          <label htmlFor="py-eval" className="text-xs text-gray-400">Try a Python expression (e.g. <code>2+2</code>, <code>sum([1,2,3])</code>):</label>
          <div className="flex gap-1">
            <input id="py-eval" type="text" value={evalInput} onChange={e => setEvalInput(e.target.value)} className="rounded px-2 py-1 text-black text-xs" style={{minWidth:120}} disabled={evalLoading} />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1 text-xs" disabled={evalLoading || !evalInput}>Eval</button>
          </div>
          {evalResult && <span className="text-xs text-blue-200">Result: {evalResult}</span>}
        </form>
      </footer>
    </div>
  );
}

export default App;
