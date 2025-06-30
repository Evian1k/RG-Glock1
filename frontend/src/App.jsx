import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import HomeContent from '@/components/sections/HomeContent';
import SocialHub from '@/components/sections/SocialHub';
import Education from '@/components/sections/Education';
import Entertainment from '@/components/sections/Entertainment';
import HealthAI from '@/components/sections/HealthAI';
import RGXWallet from '@/components/sections/RGXWallet';
import NotificationsPanel from '@/components/features/NotificationsPanel';
import { navigationItems } from '@/config/navigation';
import UserProfileModal from '@/components/features/UserProfileModal';
import SettingsModal from '@/components/features/SettingsModal';
import { Loader2 } from 'lucide-react';
import Login from './components/Login';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isVip, setIsVip] = useState(() => {
    return localStorage.getItem('isVip') === 'true';
  });

  useEffect(() => {
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

  const handleUpgradeVip = () => {
    setIsVip(true);
    localStorage.setItem('isVip', 'true');
    toast({ title: "VIP Activated!", description: "You are now a VIP member. Enjoy your perks! 🎉" });
  };

  const handleSpinWheel = useCallback((reward) => {
    if (hasSpunToday) {
      toast({
        title: "Already Spun Today! 🎯",
        description: "Patience, young grasshopper! Your next spin awaits tomorrow.",
        variant: "default",
        duration: 3000,
      });
      return;
    }
    setRgxCoins(prevCoins => {
      const newTotal = prevCoins + reward;
      addNotification(`🎉 You won ${reward} RGX Coins from the daily spin! Your balance is updated.`, "reward");
      toast({
        title: `🌟 Jackpot! You Won ${reward} RGX Coins! 🌟`,
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

  // Stripe.js loader
  useEffect(() => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Real Stripe Checkout integration (test mode, ready for your publishable key)
  const handleStripeCheckout = async (priceId, productName) => {
    // Replace with your real Stripe publishable key
    const STRIPE_PUBLISHABLE_KEY = "pk_test_51N...";
    if (!window.Stripe) {
      toast({ title: "Stripe Not Loaded", description: "Stripe.js failed to load. Please check your connection.", variant: "destructive" });
      return;
    }
    const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    addNotification(`Redirecting to Stripe for ${productName}...`, "system");
    // Simulate a real priceId for demo; in production, use your backend to create a Checkout Session
    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: window.location.origin + '/?success=true',
        cancelUrl: window.location.origin + '/?canceled=true',
      });
      if (error) {
        toast({ title: "Stripe Error", description: error.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Stripe Error", description: err.message, variant: "destructive" });
    }
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

  if (!isLoggedIn) {
    return <Login onLogin={(username) => { setIsLoggedIn(true); setLoggedInUser(username); }} />;
  }

  const renderContent = () => {
    const commonProps = { setNotifications: addNotification, currentUser: userProfile, rgxCoins, updateRgxCoins, handleStripeCheckout };
    switch (activeTab) {
      case 'home':
        return <HomeContent
          rgxCoins={rgxCoins}
          onSpin={handleSpinWheel}
          hasSpunToday={hasSpunToday}
          setNotifications={addNotification}
          isVip={isVip}
          onUpgradeVip={handleUpgradeVip}
        />;
      case 'social':
        return <SocialHub {...commonProps} />;
      case 'marketplace':
        // Instead of rendering React Marketplace, redirect to Flask HTML
        window.location.href = 'http://localhost:5000/products';
        return null;
      case 'education':
        return <Education {...commonProps} />;
      case 'entertainment':
        return <Entertainment {...commonProps} />;
      case 'health':
        return <HealthAI {...commonProps} />;
      case 'wallet':
        return <RGXWallet {...commonProps} />;
      default:
        return <HomeContent
          rgxCoins={rgxCoins}
          onSpin={handleSpinWheel}
          hasSpunToday={hasSpunToday}
          setNotifications={addNotification}
          isVip={isVip}
          onUpgradeVip={handleUpgradeVip}
        />;
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
          onLogout={() => { setIsLoggedIn(false); setLoggedInUser(null); }}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.42, 0, 0.58, 1] }}
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
        {pythonInfo && (
          <span className="block mt-1 text-xs text-gray-300">Python {pythonInfo.python_version} ({pythonInfo.implementation}) on {pythonInfo.system} {pythonInfo.release}</span>
        )}
        {pythonFunFact && (
          <span className="block mt-1 text-xs text-yellow-200 italic">Fun Fact: {pythonFunFact}</span>
        )}
      </footer>
    </div>
  );
}

export default App;
