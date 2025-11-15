'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart3,
  Target,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ExternalLink,
  Megaphone,
  Image as ImageLib
} from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if on login page
  const isLoginPage = pathname === '/login' || pathname === '/login/' || pathname?.endsWith('/login') || pathname?.endsWith('/login/');

  // Navigation items
  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      description: 'Overview & Stats',
      icon: BarChart3,
    },
    {
      href: '/dashboard/mission-representatives',
      label: 'Mission Reps',
      description: 'Applications',
      icon: Target,
    },
    {
      href: '/dashboard/contact-messages',
      label: 'Messages',
      description: 'Contact Inbox',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/members',
      label: 'Members',
      description: 'Membership',
      icon: Users,
    },
    {
      href: '/dashboard/press-releases',
      label: 'Press Releases',
      description: 'Announcements',
      icon: Megaphone,
    },
    {
      href: '/dashboard/media',
      label: 'Media Library',
      description: 'Files & Images',
      icon: ImageLib,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      description: 'Configuration',
      icon: Settings,
    },
  ];

  useEffect(() => {
    // Skip authentication check for login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check authentication for protected routes
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    // Load user data
    const storedUser = localStorage.getItem('mm_user_data');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, [router, pathname, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // ⚡ Check login page FIRST before any loading state
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner only for protected routes during authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mm-primary"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, don't render
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mm-bg/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-mm-bg transition-colors"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-mm-primary">
                Madhesh Mahasabha Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-64"
                />
              </div>

              <button className="relative p-2 rounded-full hover:bg-mm-bg transition-colors">
                <Bell className="w-5 h-5 text-mm-ink" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-mm-accent rounded-full"></span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="hidden md:flex"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Site
              </Button>

              {userData && (
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-mm-primary/10">
                    <AvatarFallback className="bg-gradient-to-br from-mm-primary to-mm-accent text-white font-bold text-sm">
                      {getUserInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-mm-ink">{userData.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {userData.role || 'Administrator'}
                    </p>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)]
            w-64 bg-white border-r border-gray-200 shadow-sm
            transition-transform duration-300 ease-in-out
            flex flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-mm-primary/5 to-transparent">
            <h2 className="text-xs font-bold text-mm-primary uppercase tracking-wider mb-1">
              Navigation
            </h2>
            <p className="text-xs text-gray-500">Admin Control Panel</p>
          </div>

          {/* Scrollable Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                  transition-all duration-200 group relative
                  focus:outline-none focus:ring-2 focus:ring-mm-primary/50 focus:ring-offset-2
                  ${isActive(item.href)
                    ? 'bg-mm-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-mm-primary/10 hover:text-mm-primary'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                )}
                
                <div className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-white/20'
                    : 'bg-mm-primary/5 group-hover:bg-mm-primary/15'
                  }
                `}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.label}</div>
                </div>
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gradient-to-r from-red-50 to-transparent">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200 font-medium focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
