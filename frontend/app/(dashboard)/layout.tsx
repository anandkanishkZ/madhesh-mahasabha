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
  ExternalLink
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

  // CRITICAL FIX: Check if on login page immediately to prevent spinner
  // Handle both /login and /login/ (with trailing slash)
  const isLoginPage = pathname === '/login' || pathname === '/login/' || pathname?.endsWith('/login') || pathname?.endsWith('/login/');

  // Debug logging (remove after fixing)
  console.log('🔍 Layout Debug:', {
    pathname,
    isLoginPage,
    isLoading,
    timestamp: new Date().toISOString()
  });

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

  // ⚡ CRITICAL FIX: Check login page FIRST before any loading state
  // This prevents the spinner from showing on the login page
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
                  <Avatar>
                    <AvatarFallback className="bg-mm-primary text-white font-semibold">
                      {userData.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-mm-ink">{userData.name}</p>
                    <p className="text-xs text-muted-foreground">{userData.role}</p>
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
            w-64 bg-white border-r border-gray-200 
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Navigation
            </h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>

          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                  transition-all duration-200 group
                  ${isActive(item.href)
                    ? 'bg-mm-primary text-white shadow-lg shadow-mm-primary/25 scale-[1.01]'
                    : 'text-gray-700 hover:bg-mm-bg/80 hover:text-mm-primary hover:shadow-sm'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive(item.href)
                    ? 'bg-white/15'
                    : 'bg-mm-primary/5 group-hover:bg-mm-primary/10'
                  }
                `}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm leading-tight">{item.label}</div>
                  <div className={`
                    text-xs leading-tight mt-0.5
                    ${isActive(item.href)
                      ? 'text-white/75'
                      : 'text-gray-500 group-hover:text-mm-primary/70'
                    }
                  `}>
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-mm-bg/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
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
