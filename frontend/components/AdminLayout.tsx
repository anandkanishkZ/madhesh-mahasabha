'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart3,
  Target,
  MessageSquare,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ExternalLink
} from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/api';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

interface NavItem {
  href: string;
  label: string;
  labelNp?: string;
  icon: React.ElementType;
  isActive?: (pathname: string) => boolean;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items
  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      labelNp: 'ड्यासबोर्ड',
      icon: BarChart3,
      isActive: (path) => path === '/dashboard'
    },
    {
      href: '/dashboard/mission-representatives',
      label: 'Mission Representatives',
      labelNp: 'मिशन प्रतिनिधि',
      icon: Target,
      isActive: (path) => path.startsWith('/dashboard/mission-representatives')
    },
    {
      href: '/dashboard/contact-messages',
      label: 'Contact Messages',
      labelNp: 'सम्पर्क सन्देश',
      icon: MessageSquare,
      isActive: (path) => path.startsWith('/dashboard/contact-messages')
    },
    {
      href: '/dashboard/memberships',
      label: 'Members',
      labelNp: 'सदस्यता',
      icon: Users,
      isActive: (path) => path.startsWith('/dashboard/memberships')
    },
    {
      href: '/dashboard/news',
      label: 'News & Posts',
      labelNp: 'समाचार',
      icon: FileText,
      isActive: (path) => path.startsWith('/dashboard/news')
    },
    {
      href: '/dashboard/events',
      label: 'Events',
      labelNp: 'कार्यक्रम',
      icon: Calendar,
      isActive: (path) => path.startsWith('/dashboard/events')
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      labelNp: 'सेटिङ',
      icon: Settings,
      isActive: (path) => path.startsWith('/dashboard/settings')
    }
  ];

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    // Get user data
    const storedUserData = localStorage.getItem('mm_user_data');
    if (!storedUserData) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const isNavItemActive = (item: NavItem): boolean => {
    if (item.isActive) {
      return item.isActive(pathname);
    }
    return pathname === item.href;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mm-primary mx-auto mb-4"></div>
          <p className="text-gray-600 nepali-text">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-mm-bg transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-mm-primary">
                Madhesh Mahasabha
              </h1>
            </div>

            {/* Right: Search + Notifications + Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-64"
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
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30
            transition-transform duration-300 w-64 overflow-y-auto
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item);
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${active
                      ? 'bg-mm-primary/10 text-mm-primary font-semibold'
                      : 'hover:bg-mm-bg text-mm-ink'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              );
            })}

            <div className="pt-4 border-t mt-4 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {(title || description) && (
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
              {title && (
                <h2 className="text-2xl lg:text-3xl font-bold text-mm-ink nepali-heading mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground nepali-text">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
