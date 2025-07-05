
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell } from 'lucide-react';

const MobileHeader = ({ onMenuToggle, isMenuOpen, onNotificationsToggle, unreadNotificationsCount }) => {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 glass-effect border-b border-border/20 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <img-replace src="/rg_fling_logo.svg" alt="RG Fling Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-gradient-primary">
          RG Fling
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onNotificationsToggle} className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-6 h-6" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
};

export default MobileHeader;
