
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { User, Mail, MapPin, Palette, Save, X, Shield, Bell, UploadCloud } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const avatarColors = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500",
  "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500",
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500"
];

const SettingsModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', email: '', location: '', avatarColor: 'bg-blue-500', avatarUrl: null,
    preferences: {
      notifications: { social: true, marketplace: true, system: true },
      privacy: { showEmail: false, showLocation: true }
    }
  });
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        location: user.location || '',
        avatarColor: user.avatarColor || 'bg-blue-500',
        avatarUrl: user.avatarUrl || null,
        preferences: user.preferences || {
          notifications: { social: true, marketplace: true, system: true },
          privacy: { showEmail: false, showLocation: true }
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [category, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [category]: {
            ...prev.preferences[category],
            [key]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, avatarColor: color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      toast({ title: "Missing Fields! 😟", description: "Name and Username are required.", variant: "destructive" });
      return;
    }
    onSave({ ...user, ...formData });
    onClose();
  };
  
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const handleAvatarUpload = () => {
    toast({
      title: "🚧 Avatar Upload Coming Soon!",
      description: "This feature needs backend storage. For now, you can change avatar color!",
      duration: 4000
    });
  };
  
  const renderProfileSettings = () => (
    <>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative group">
          <div className={`w-24 h-24 rounded-full ${formData.avatarColor} flex items-center justify-center text-primary-foreground text-4xl font-semibold border-2 border-background shadow-md overflow-hidden`}>
            {formData.avatarUrl ? <img-replace src={formData.avatarUrl} alt="User Avatar" className="w-full h-full object-cover"/> : getInitials(formData.name)}
          </div>
          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-background/80 group-hover:bg-accent transition-all" onClick={handleAvatarUpload} title="Upload new avatar">
             <UploadCloud className="w-4 h-4 text-primary"/>
          </Button>
        </div>
        <div className="flex-1">
          <Label htmlFor="avatarColor" className="flex items-center mb-2 text-sm font-medium text-muted-foreground">
            <Palette className="w-4 h-4 mr-2" /> Avatar Background Color
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {avatarColors.map(color => (
              <button
                type="button" key={color}
                className={`w-7 h-7 rounded-full ${color} border-2 transition-all duration-150 ${formData.avatarColor === color ? 'border-primary ring-2 ring-primary ring-offset-1 ring-offset-background' : 'border-transparent hover:border-primary/50'}`}
                onClick={() => handleColorChange(color)}
                aria-label={`Select ${color.split('-')[1]} color`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
        <div><Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Full Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="E.g. John Doe" className="mt-1" /></div>
        <div><Label htmlFor="username" className="text-sm font-medium text-muted-foreground">Username</Label><Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="E.g. @johndoe" className="mt-1" /></div>
      </div>
      <div><Label htmlFor="bio" className="text-sm font-medium text-muted-foreground">Bio</Label><Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us a bit about yourself..." className="min-h-[100px] mt-1" /></div>
      <div><Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email (Optional)</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E.g. john.doe@example.com" className="mt-1" /></div>
      <div><Label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location (Optional)</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="E.g. San Francisco, CA" className="mt-1" /></div>
    </>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground mb-1">Notification Preferences</h3>
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
        <Label htmlFor="notifications.social" className="text-sm text-foreground">Social Notifications (Likes, Comments)</Label>
        <Switch id="notifications.social" name="preferences.notifications.social" checked={formData.preferences.notifications.social} onCheckedChange={(checked) => handleChange({ target: { name: 'preferences.notifications.social', type: 'checkbox', checked } })} />
      </div>
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
        <Label htmlFor="notifications.marketplace" className="text-sm text-foreground">Marketplace Updates (New Items, Sales)</Label>
        <Switch id="notifications.marketplace" name="preferences.notifications.marketplace" checked={formData.preferences.notifications.marketplace} onCheckedChange={(checked) => handleChange({ target: { name: 'preferences.notifications.marketplace', type: 'checkbox', checked } })} />
      </div>
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
        <Label htmlFor="notifications.system" className="text-sm text-foreground">System Alerts (Updates, Rewards)</Label>
        <Switch id="notifications.system" name="preferences.notifications.system" checked={formData.preferences.notifications.system} onCheckedChange={(checked) => handleChange({ target: { name: 'preferences.notifications.system', type: 'checkbox', checked } })} />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
     <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground mb-1">Privacy Settings</h3>
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
        <Label htmlFor="privacy.showEmail" className="text-sm text-foreground">Show Email on Profile</Label>
        <Switch id="privacy.showEmail" name="preferences.privacy.showEmail" checked={formData.preferences.privacy.showEmail} onCheckedChange={(checked) => handleChange({ target: { name: 'preferences.privacy.showEmail', type: 'checkbox', checked } })} />
      </div>
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
        <Label htmlFor="privacy.showLocation" className="text-sm text-foreground">Show Location on Profile</Label>
        <Switch id="privacy.showLocation" name="preferences.privacy.showLocation" checked={formData.preferences.privacy.showLocation} onCheckedChange={(checked) => handleChange({ target: { name: 'preferences.privacy.showLocation', type: 'checkbox', checked } })} />
      </div>
      <Button variant="link" className="text-primary p-0 h-auto" onClick={() => toast({title:"🚧 Privacy Policy Not Yet Available"})}>View Full Privacy Policy</Button>
    </div>
  );

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User, content: renderProfileSettings() },
    { id: 'notifications', label: 'Notifications', icon: Bell, content: renderNotificationSettings() },
    { id: 'privacy', label: 'Privacy', icon: Shield, content: renderPrivacySettings() },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-effect sm:max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <DialogHeader className="p-6 pb-4 border-b border-border/20">
            <DialogTitle className="text-2xl font-bold flex items-center text-foreground">
              <User className="w-6 h-6 mr-3 text-primary" /> Platform Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <nav className="w-full md:w-48 border-b md:border-b-0 md:border-r border-border/20 p-4 space-y-1.5 shrink-0">
              {settingsTabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeSettingsTab === tab.id ? "secondary" : "ghost"}
                  className={`w-full justify-start space-x-2 rounded-md ${activeSettingsTab === tab.id ? 'font-semibold' : ''}`}
                  onClick={() => setActiveSettingsTab(tab.id)}
                >
                  <tab.icon className={`w-4 h-4 ${activeSettingsTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </nav>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="px-6 py-5 space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSettingsTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {settingsTabs.find(tab => tab.id === activeSettingsTab)?.content}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DialogFooter className="p-6 flex sm:justify-end space-x-3 border-t border-border/20 bg-background/50 sticky bottom-0">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2"/>Cancel
                </Button>
                <Button type="submit" className="btn-primary-glow">
                  <Save className="w-4 h-4 mr-2"/>Save Changes
                </Button>
              </DialogFooter>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
