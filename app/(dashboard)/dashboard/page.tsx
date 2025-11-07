'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  LogOut,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserData {
  username: string;
  name: string;
  email: string;
  role: string;
  loginTime: string;
}

interface DashboardStats {
  totalMembers: number;
  totalPosts: number;
  engagement: number;
  messages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mock dashboard stats
  const [stats] = useState<DashboardStats>({
    totalMembers: 1247,
    totalPosts: 89,
    engagement: 76,
    messages: 23
  });

  // Recent activities mock data
  const recentActivities = [
    { id: 1, action: 'New member joined', user: 'Ram Kumar', time: '5 minutes ago' },
    { id: 2, action: 'Post published', user: 'Sita Devi', time: '15 minutes ago' },
    { id: 3, action: 'Comment added', user: 'Hari Bahadur', time: '30 minutes ago' },
    { id: 4, action: 'Event created', user: 'Geeta Sharma', time: '1 hour ago' },
  ];

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('mm_auth_token');
    const storedUserData = localStorage.getItem('mm_user_data');

    if (!authToken || !storedUserData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('mm_auth_token');
    localStorage.removeItem('mm_user_data');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mm-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-mm-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-mm-ink font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-mm-bg/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu + Logo */}
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
                    {userData.name.charAt(0)}
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
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30
          transition-transform duration-300 w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-mm-primary/10 text-mm-primary font-semibold">
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Users className="w-5 h-5" />
              <span>Members</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <FileText className="w-5 h-5" />
              <span>Posts</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-mm-bg transition-colors text-mm-ink">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>

            <div className="pt-4 lg:hidden">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-mm-ink mb-2">
              Welcome back, {userData.name}!
            </h2>
            <p className="text-muted-foreground">
              Here's your daily activity summary
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Members
                </CardTitle>
                <Users className="w-5 h-5 text-mm-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-mm-ink">{stats.totalMembers.toLocaleString()}</div>
                <p className="text-xs text-mm-primary mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% this month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-accent">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Posts
                </CardTitle>
                <FileText className="w-5 h-5 text-mm-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-mm-ink">{stats.totalPosts}</div>
                <p className="text-xs text-mm-accent mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +5 this week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-mm-warm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Engagement Rate
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-mm-warm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-mm-ink">{stats.engagement}%</div>
                <p className="text-xs text-mm-warm mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New Messages
                </CardTitle>
                <MessageSquare className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-mm-ink">{stats.messages}</div>
                <p className="text-xs text-blue-500 mt-1">
                  Awaiting response
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest activity from the past hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-mm-bg/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-mm-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-mm-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-mm-ink">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Users className="w-4 h-4 mr-3" />
                  <span>Add New Member</span>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <FileText className="w-4 h-4 mr-3" />
                  <span>Create Post</span>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Schedule Event</span>
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  <span>Send Message</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
